import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
//import { createServer } from 'node:http';

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
  console.log(`Server listening on http://localhost:${PORT}`);
});