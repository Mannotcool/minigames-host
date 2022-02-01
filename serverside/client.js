//create a client that connects to the server with socket.io
const io = require("socket.io-client");
const socket = io.connect("http://localhost:3000");

socket.emit("join", "12345");