import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mysql from 'mysql';
import fs from 'fs';
import { promisify } from 'util';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import credentialsSMTP from './credentialsSMTP.js';
import credentialsSQL from './credentialsSQL.js';

//SQL Connection.
const pool = mysql.createPool(credentialsSQL);

//SMTP Connection. Email Service.
const readFile = promisify(fs.readFile);
const sender = nodemailer.createTransport(credentialsSMTP);

const sendMail = async (code, email) => {
  const html = await readFile('./email.html', 'utf8');
  const template = handlebars.compile(html);
  const data = {
    code: code,
    email: email,
  };
  const parsedHtml = template(data);
  const mail = {
    from: '"YLCode Admin 👻" <admin@ylcode.online>',
    to: email,
    subject: 'Verification code',
    html: parsedHtml
  };
  sender.sendMail(mail, (error, info) => {
    if (error) console.log(error);
    console.log(info);
  });
}

const app = express();
const server = http.Server(app);
const io = new Server(server, {
  maxHttpBufferSize: 1e7
});
const PORT = 4000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
  res.json(chatRooms);
});

io.on("connection", (socket) => {
  let user_id;
  console.log(`[+]: ${socket.id} user connected.`);
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("SELECT c.id AS 'index', c.name, c.avatar, m.content AS 'state' FROM chatgroup c LEFT JOIN (SELECT * FROM message m1 WHERE (m1.recipient_id, m1.postDate) IN (SELECT recipient_id, MAX(postDate) FROM message GROUP BY recipient_id)) m ON c.id = m.recipient_id", (err, result) => {
      if (err) console.log(err);
      socket.emit("requestUsers", result);
    });

    socket.on("requestUsers", (online, id) => {
      let query = "SELECT c.id AS 'index', c.name, c.avatar, m.content AS 'state' FROM chatgroup c LEFT JOIN (SELECT * FROM message m1 WHERE (m1.recipient_id, m1.postDate) IN (SELECT recipient_id, MAX(postDate) FROM message GROUP BY recipient_id)) m ON c.id = m.recipient_id WHERE c.id != ?";
      connection.query(query, [id], (err, result) => {
        if (err) console.log(err);
        socket.emit("requestUsers", result);
      });
    });

    socket.on("validateUsername", (auth) => {
      let query = "SELECT id, salt FROM user WHERE username=? OR email=? OR phonenumber=?"; 
      connection.query(query, [auth, auth, auth], (err, result) => {
        if (err) console.log(err);
        socket.emit("validateUsername", result);
      });
    });

    socket.on("login", (username, password) => {
      let query = "SELECT username, id AS \"index\" FROM user WHERE username=? AND password=? OR email=? AND password=? OR phonenumber=? AND password=?";
      connection.query(query, [username, password, username, password, username, password], (err, result) => {
        if (err) console.log(err);
        socket.emit("login", result);
      });
    });

    socket.on("register", (username, salt, password, email, phonenumber) => {
      let queryRegister = "INSERT INTO user (username, salt, password, email, phonenumber) VALUES (?,?,?,?,?)";
      connection.query(queryRegister, [username, salt, password, email, phonenumber], (err, register) => {
        if (err) console.log(err);
        else {
          connection.query("INSERT INTO chatgroup (name) VALUES (?)", [username], (err, group) => {
            if (err) console.log(err);
            else {
              connection.query("INSERT INTO user_chatgroup VALUES (?,?)", [register.insertId, group.insertId], (err, result) => {
                if (err) console.log(err);
              });
            }
          });
        }
      });
    });

    socket.on("getAvatarSource", (username) => {
      let query = "SELECT avatar FROM chatgroup WHERE name=?"
      connection.query(query, [username], (err, result) =>{
        if (err) console.error(err);
        if (result.length > 0) {
          const avatarSource = result[0].avatar;
          socket.emit("getAvatarSource", avatarSource);
        } else {
          socket.emit("getAvatarSource", null);
        }
      });
    });

    socket.on("sendVerificationEmail", (email) => {
      let deletePrevious = "DELETE FROM verification WHERE email=?";
      connection.query(deletePrevious, [email], (err, result) => {
        if (err) console.log(err);
      });

      let code = Math.floor(Math.random() * (9999)).toString().padStart(4, "0");
      let query = "INSERT INTO verification (email, code) VALUES (?, ?)"
      connection.query(query, [email, code], (err, result) => {
        if (err) console.log(err);
      });
      sendMail(code, email);
    });

    socket.on("verifyEmailCode", (email) => {
      let query = "SELECT code FROM verification WHERE DATE_SUB(CURDATE(), INTERVAL 30 MINUTE) <= created AND email=?";
      connection.query(query, [email], (err, result) => {
        if (err) console.log(err);
        if (result.length > 0) {
          const code = result[0].code;
          socket.emit("verifyEmailCode", code);
        } else {
          socket.emit("verifyEmailCode", null);
        }
      });
    });

    socket.on("identify", (id) => {
      user_id = id;
    }); 

    socket.on("disconnect", () => {
      console.log(`[-]: ${socket.id} user disconnected.`)
      socket.disconnect();
    });

    socket.on("sendMessage", (sender_id, recipient_id, content) => {
      let query = "INSERT INTO message VALUES (DEFAULT, ?, ?, DEFAULT, ?)";
      connection.query(query, [sender_id, recipient_id, content], (err, result) => {
        if (err) console.log(err);
        socket.emit("sendMessage", result);
      });
    });

    socket.on("deployMessages", (group_id) => {
      let query = "SELECT * FROM message WHERE recipient_id = ?";
      connection.query(query, [group_id], (err, result) => {
        if (err) console.log(err);
        socket.emit("deployMessages", result);
      })
    });
  });
});

server.listen(PORT, () => {
  console.log(`[Server] Listening on http://ylcode.online:${PORT}`);
});
