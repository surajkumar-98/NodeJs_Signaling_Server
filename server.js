const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200", // Update with your frontend URL
    methods: ["GET", "POST"],
  },
});

// Use the cors middleware
app.use(
  cors({
    origin: "http://localhost:4200", // Update with your frontend URL
  })
);

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("join", (room) => {
    console.log(`${socket.id} joined room ${room}`);
    socket.join(room);
    io.to(room).emit("user-joined", { id: socket.id, room: room });
  });

  socket.on("offer", (data) => {
    console.log(`Offer from ${socket.id} to room ${data.room}`);
    socket.to(data.room).emit("offer", data.offer);
  });

  socket.on("answer", (data) => {
    console.log(`Answer from ${socket.id} to room ${data.room}`);
    socket.to(data.room).emit("answer", data.answer);
  });

  socket.on("candidate", (data) => {
    console.log(`Candidate from ${socket.id} to room ${data.room}`);
    socket.to(data.room).emit("candidate", data.candidate);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Signaling server is running on port 3000");
});
