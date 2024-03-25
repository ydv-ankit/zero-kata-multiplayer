import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import {
  checkWinner,
  removeListeners,
  toggleCell,
  toggleCreator,
  togglePlayer,
  togglePlayerSign,
} from "./logic.js";
const name = document.getElementById("name");
const room = document.getElementById("roomid");
const newRoomBtn = document.getElementById("newroom");

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
  toggleCreator(false);
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

// user status
function togglePlayerStatus(status) {
  const playerStatus = document.getElementById("playerStatus");
  playerStatus.innerHTML = status;
}

// move event
export function emitMoveEvent(cellId, cellContent) {
  console.log(cellId, cellContent);
  socket.emit("move", { roomId, cellId, cellContent });
}

socket.on("move", (data) => {
  console.log(data);
  const cell = document.getElementById(data.cellId);
  cell.innerHTML = data.cellContent;
  cell.removeEventListener("click", toggleCell);
  togglePlayer();
  let winner = checkWinner();
  if (winner) {
    removeListeners();
    document.getElementById("winner").innerHTML = `Winner: ${winner}`;
    return;
  }
});

// join new room
newRoomBtn.addEventListener("click", () => {
  togglePlayerSign("X");
  toggleCreator(true);
  socket.emit("new-room-join", username);
});

// room joined
socket.on("room-joined", (id) => {
  room.innerHTML = id;
  roomId = id;
});

// play again event
socket.on("play-again", () => {
  const wantToPlay = confirm("Opponent wants to play again?");
  if (wantToPlay) {
    resetBoard();
  }else{
    socket.emit('disconnect', roomId, username);
  }
});

// user(opponent) connected
socket.on("user-connected", (users) => {
  if (users.length === 2) {
    togglePlayerStatus("connected and playing");
    togglePlayerSign();
    togglePlayer();
  } else {
    togglePlayerStatus("not available");
    toggleCreator(true);
    togglePlayerSign();
  }
});
