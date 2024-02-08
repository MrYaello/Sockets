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
const sql = mysql.createConnection(credentialsSQL);

sql.connect((err) => {
  if (err) console.log(err);
  console.log("[Server] Connected to SQL.")
})

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
  sql.query("SELECT user_id AS \"index\", username, avatar, state FROM user WHERE user_id!=?", [user_id], (err, result) => {
    if (err) console.log(err);
    socket.emit("requestUsers", result);
  });

  socket.on("requestUsers", (online, id) => {
    let query = "SELECT user_id AS \"index\", username, avatar, state FROM user WHERE user_id!=?";
    sql.query(query, [id], (err, result) => {
      if (err) console.log(err);
      socket.emit("requestUsers", result);
    });
  });

  socket.on("validateUsername", (auth) => {
    let query = "SELECT user_id FROM user WHERE username=? OR email=? OR phonenumber=?"; 
    sql.query(query, [auth, auth, auth], (err, result) => {
      if (err) console.log(err);
      socket.emit("validateUsername", result);
    });
  });

  socket.on("login", (username, password) => {
    let query = "SELECT username, user_id AS \"index\" FROM user WHERE username=? AND password=? OR email=? AND password=? OR phonenumber=? AND password=?";
    sql.query(query, [username, password, username, password, username, password], (err, result) => {
      if (err) console.log(err);
      socket.emit("login", result);
    });
  });

  socket.on("register", (username, password, email, phonenumber) => {
    let query = "INSERT INTO user (username, password, email, phonenumber) VALUES (?,?,?,?)";
    sql.query(query, [username, password, email, phonenumber], (err, result) => {
      if (err) console.log(err);
      socket.emit("register", result);
    });
  });

  socket.on("getAvatarSource", (username) => {
    let query = "SELECT avatar FROM user WHERE username=?"
    sql.query(query, [username], (err, result) =>{
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
    sql.query(deletePrevious, [email], (err, result) => {
      if (err) console.log(err);
    });

    let code = Math.floor(Math.random() * (9999)).toString().padStart(4, "0");
    let query = "INSERT INTO verification (email, code) VALUES (?, ?)"
    sql.query(query, [email, code], (err, result) => {
      if (err) console.log(err);
    });
    sendMail(code, email);
  });

  socket.on("verifyEmailCode", (email) => {
    let query = "SELECT code FROM verification WHERE DATE_SUB(CURDATE(), INTERVAL 30 MINUTE) <= created AND email=?";
    sql.query(query, [email], (err, result) => {
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
});

server.listen(PORT, () => {
  console.log(`[Server] Listening on http://ylcode.online:${PORT}`);
});