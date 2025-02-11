
const { v4: uuidv4 } = require('uuid');
const users = [];
const generateRandomName = () => {
	// TODO: Make sure at the random names are unique
	const adjectives = ["Swift", "Brave", "Clever", "Mighty", "Witty", "Logical", "Wide", "Strong", "Wealthy"];
	const animals = ["Tiger", "Falcon", "Panda", "Eagle", "Shark", "Cow", "Horse", "Zebra", "Cheetah"];
	return (
		adjectives[Math.floor(Math.random() * adjectives.length)] +
		animals[Math.floor(Math.random() * animals.length)]
	);
};


const addUser = ({ socketId, roomId }) => {
	if (!roomId) {
		 return { error: 'roomId is required' };
	}
	const id = uuidv4(); 
	const user = { socketId: socketId, id: id, name: generateRandomName(), roomId: roomId};
	users.push(user);
	return { user };
}

const getUser = (id) => {
	return users.find(user => user.id === id);
}
const getUserSocketId = (id) => {
	return users.find(user => user.socketId === id);
}

const removeUser = (id) => {
	const index = users.findIndex(user => user.id === id);

	if (index !== -1) {
		 return users.splice(index, 1)[0];
	}
}
const removeUserSocketId = (socketId) => {
	const index = users.findIndex(user => user.socketId === socketId);

	if (index !== -1) {
		 return users.splice(index, 1)[0];
	}
}
const getUsersInRoom = (roomId) => {
	return users.filter((user) => user.roomId === roomId);
};

module.exports = { addUser, getUser, removeUser, getUsersInRoom, getUserSocketId, removeUserSocketId};