const io = require("socket.io")(3000, {
    //set this so cors doesnt block connection to the server
    cors: {
        origin: ['http://localhost:8080'],
    },
});

console.log("Server started");

function getActiveRooms() {
    console.log(io.sockets.adapter.rooms);
    return;
}

io.on("connection", socket => {
    socket.on("join", code => {
        socket.join(code);

        socket.emit("joined");

        io.to(socket.id).emit('joined');
        console.log(`Client ${socket.id} joined room ${code}`);
        console.log(getActiveRooms());
    });
});
