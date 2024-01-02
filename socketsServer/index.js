import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
//import { createServer } from 'node:http';

const app = express();
const server = http.Server(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  }
});
const PORT = 4000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cors());

app.get('/api', (req, res) => {
  res.json({
    message: "Test",
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

io.on("connection", (socket) => {
  console.log(`[+]: ${socket.id} user connected.`);

  socket.on("prueba", (text) => {
    console.log(text);
  })

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("[-]: A user disconnected.")
  })
})