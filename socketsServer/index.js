import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mysql from 'mysql';
import { readFile } from 'fs';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import credentials from './credentials.js';

//SQL Connection.
const sql = mysql.createConnection({
  host: "localhost",
  user: "pendejos",
  password: "losVergudos",
  database: "sockets",
  multipleStatements: false
});

sql.connect((err) => {
  if (err) console.log(err);
  console.log("[Server] Connected to SQL.")
})

//SMTP Connection. Email Service.
const sender = nodemailer.createTransport({
  host: "smtppro.zoho.com",
  port: 465,
  secure: true,
  auth: credentials,
});

const sendMail = async (code, email) => {
  const html = await readFile('./index.html', 'utf-8');
  const template = handlebars.compile(html);
  const data = {
    code: code,
    email: email,
  };
  const parsedHtml = template(data);
  const mail = {
    from: 'admin@ylcode.online',
    to: email,
    subject: 'Verification code',
    html: parsedHtml
  };
  sender.sendMail(mailOptions, (error, info) => {
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

app.get('/', (req, res) => {
  res.json(chatRooms);
});

io.on("connection", (socket) => {
  let user_id;
  console.log(`[+]: ${socket.id} user connected.`);

  socket.on("requestUsers", (online) => {
    if (online) {
      //Implementar
    } else {
      sql.query("SELECT user_id AS \"index\", username, avatar, state FROM user", (err, result) => {
        if (err) console.log(err);
        socket.emit("requestUsers", result);
      });
    }
  });

  socket.on("validateUsername", (auth) => {
    let query = "SELECT user_id FROM user WHERE username=? OR email=? OR phonenumber=?"; 
    sql.query(query, [auth, auth, auth], (err, result) => {
      if (err) console.log(err);
      socket.emit("validateUsername", result);
    });
  });

  socket.on("login", (username, password) => {
    let query = "SELECT username FROM user WHERE username=? AND password=? OR email=? AND password=? OR phonenumber=? AND password=?";
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

  socket.on("testEmail", (code, email) => {
    console.log("asd");
    sendMail(code, email);
  })

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
