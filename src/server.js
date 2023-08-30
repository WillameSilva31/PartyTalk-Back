const express = require('express');
const http = require('http');
const socketIo = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  })

const port = process.env.PORT || 4000;

const users = [];

app.get("/", (req,res)=> res.json("hello world"));

io.on('connection', (socket) => {
    socket.on("disconnect", () => {
        console.log(`socket desconectado: ${socket.id}`);
        io.emit("message",{ name: null, message:`alguém saiu da party ;-;`});
    })
    socket.on("join", (name) => {
        const user = { id: socket.id, name };
        users.push(user);
        io.emit("message", { name: null, id : null , message: `${name} entrou na party`})
        io.emit("users", users)
        console.log(`socket conectado: ${socket.id}`);
    })

    socket.on("message", (message) => {
        message.userId = socket.id;
        io.emit("message", message);
    })
})

server.listen(port, () => console.log(`servidor rodando na porta: ${port}`));