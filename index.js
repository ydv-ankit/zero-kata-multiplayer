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

// rooms with client names
const rooms = {};

const generateRoomId = () => {
  return Math.random().toString(36).substring(7);
};

const addUserToRoom = (username, roomId = generateRoomId()) => {
  if (rooms[roomId] && rooms[roomId].length < 2) {
    rooms[roomId].push(username);
  } else {
    rooms[roomId] = [username];
  }
  console.log(rooms);
  return roomId;
};

const getRoomUsers = (roomId) => {
  return rooms[roomId];
};

// socket server events
io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, username }) => {
    console.log("user '" + username + "' joined room: ", roomId);
    addUserToRoom(username, roomId);
    socket.join(roomId);
    socket.roomId = roomId;
    console.log(socket.rooms);
    io.to(roomId).emit("user-connected", getRoomUsers(roomId));
    console.log(getRoomUsers(roomId));
  });
  socket.on("move", (data) => {
    console.log(data);
    socket.to(data?.roomId).emit("move", data);
  });
  socket.on("new-room-join", (username) => {
    console.log("new room joined by: " + username);
    const roomId = addUserToRoom(username);
    socket.join(roomId);
    socket.emit("room-joined", roomId);
  });

  // play again
  socket.on("play-again", (roomId) => {
    console.log("play again: " + roomId);
    socket.to(roomId).emit("play-again");
  });
  socket.on("disconnect", (roomId, username) => {
    console.log("user disconnected: " + username);
    socket.to(roomId).emit("user-left");
  });
});

server.listen(3000, () => {
  console.log("server running at PORT: 3000");
});
