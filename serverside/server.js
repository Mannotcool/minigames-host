const io = require("socket.io")(3000);

console.log("Server started");

io.on("connection", socket => {
    socket.on("join", code => {
        socket.join(code);
        console.log(`Client ${socket.id} joined room ${code}`);
    });
});