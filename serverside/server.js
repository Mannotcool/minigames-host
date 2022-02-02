const io = require("socket.io")(3000, {
    //set this so cors doesnt block connection to the server
    cors: {
        origin: ['http://localhost:8080'],
    },
});

console.log("Server started");

io.on("connection", socket => {
    socket.on("join", code => {
        socket.join(code);
        socket.broadcast.to(socket.id).emit('joined', code);
        console.log(`Client ${socket.id} joined room ${code}`);
    });
});