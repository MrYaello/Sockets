import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mysql from 'mysql';
//import { createServer } from 'node:http';

//SQL Connection.
const sql = mysql.createConnection({
  host: "ylcode.online",
  user: "pendejos",
  password: "penelopePene6"
});

sql.connect((err) => {
  if (err) throw err;
  console.log("[Server] Connected to SQL.")
})
const app = express();
const server = http.Server(app);
const io = new Server(server);
const PORT = 4000;

let chatRooms = []

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json(chatRooms);
});

io.on("connection", (socket) => {
  console.log(`[+]: ${socket.id} user connected.`);

  socket.on("prueba", (text) => {
    console.log(text);
  })

  socket.on("disconnect", () => {
    console.log(`[-]: ${socket.id} user disconnected.`)
    socket.disconnect();
  })
})

server.listen(PORT, () => {
  console.log(`[Server] Listening on http://localhost:${PORT}`);
});
