const express = require("express");
const cors = require("cors");
const { GameState } = require("./game");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(3000);
const { v4: uuidv4 } = require("uuid");
const {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
  getUserSocketId,
  removeUserSocketId,
} = require("./users");

app.use(cors());

const rooms = {};

function createRoom(roomId) {
  rooms[roomId] = { state: new GameState(), u1: undefined, u2: undefined };
}

// room just stores one gameObject

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("create", () => {
    let user = getUserSocketId(socket.id);
    if (user) {
      socket.leave(user.roomId);
    }
    removeUserSocketId(socket.id);
    roomId = uuidv4().replace(/-/g, "").slice(0, 10);
    socket.join(roomId);
    createRoom(roomId);
    rooms[roomId].u1 = socket.id;
    addUser({ socketId: socket.id, roomId: roomId });
    rooms[roomId].state.player1name = getUserSocketId(socket.id).name;
		rooms[roomId].state.roomId = roomId;
    io.in(roomId).emit("gameState", rooms[roomId].state);
  });

  socket.on("join", (roomId) => {
		let user = getUserSocketId(socket.id);
    if (user) {
      socket.leave(user.roomId);
    }
    removeUserSocketId(socket.id);

		if (!(roomId in rooms)) {
			return;
		}

		socket.join(roomId);
		rooms[roomId].u2 = socket.id;
		addUser({ socketId: socket.id, roomId: roomId });
		rooms[roomId].state.player2name = getUserSocketId(socket.id).name;
		io.in(roomId).emit("gameState", rooms[roomId].state);
	});

  socket.on("makeMove", (tileSpot) => {
    console.log(tileSpot);
    let user = getUserSocketId(socket.id);
    if (user == undefined) {
      return;
    }
    let roomId = user.roomId;

    const currUser =
      rooms[roomId].state.turn == 1 ? rooms[roomId].u1 : rooms[roomId].u2;
		if (user.socketId != currUser) {
			console.log("not this users turn!!");
			io.in(roomId).emit("gameState", rooms[roomId].state);
			return;
		}
    console.log(rooms[roomId].state.makeMove(tileSpot));

    io.in(roomId).emit("gameState", rooms[roomId].state);
  });
});
