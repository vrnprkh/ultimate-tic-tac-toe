
const io = require('socket.io')(3000)


const rooms = [];
// room has user1
// user2,
// and gameobject

io.on('connection', socket => {
	console.log(socket.id)

	socket.on('create', () => {
		
	});
})