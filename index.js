const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(__dirname + "/css"));
app.use(express.static(__dirname + "/js"));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "/html/index.html"));
});

// socket server events
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("join-room", ({ roomId, username }) => {
    console.log("user", username, "joined room: ", roomId);
    socket.join(roomId);
    socket.roomId = roomId;
    console.log(socket.rooms);
    socket.broadcast.to(roomId).emit("user-connected");
  });
  socket.on("move", (data) => {
    console.log(data);
    socket.to(data?.roomId).emit("move", data);
  });
  socket.on("disconnect", (roomId, username) => {
    console.log("user disconnected: " + username);
    socket.to(roomId).emit("user-left");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
