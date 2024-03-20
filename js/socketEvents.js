import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import { togglePlayer, toggleCell, checkWinner, removeListeners } from "./logic.js";
const name = document.getElementById("name");
const room = document.getElementById("roomid");

// global variables
let roomId = null;

// initialize socket
export const socket = io();

// get username details
export const username = prompt("Enter your username");
name.innerHTML = username;

// get room id to join
function getRoomId() {
  return prompt("Enter room id to join");
}

// add event listener to join room button
document.getElementById("joinroom").addEventListener("click", () => {
  roomId = getRoomId();
  if (roomId) {
    room.innerHTML = roomId;
    socket.emit("join-room", { roomId, username });
  }
});

// EVENTS
// user (opponent) disconnected
socket.on("user-left", () => {
  alert("player left");
});

// move event
export function emitMoveEvent(cellId, cellContent) {
  console.log(cellId, cellContent);
  socket.emit("move", { roomId, cellId, cellContent });
}

socket.on("move", (data) => {
  console.log(data);
  const cell = document.getElementById(data.cellId);
  console.log(cell);
  cell.innerHTML = data.cellContent;
  cell.removeEventListener("click", toggleCell);
  togglePlayer();
  let winner = checkWinner();
  if (winner) {
    removeListeners();
    document.getElementById("winner").innerHTML = `Winner: ${winner}`;
  }
});

// user(opponent) connected
socket.on("user-connected", (username) => {
  console.log(username, "connected");
});
