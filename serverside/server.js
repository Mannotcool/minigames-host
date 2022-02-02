const io = require("socket.io")(3000, {
    //set this so cors doesnt block connection to the server
    cors: {
        origin: ['http://localhost:8080'],
    },
});

console.log("Server started");

var rooms = [];

io.on("connection", socket => {
    socket.on("roomQuery", code => {
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i][0] == code) {
                //true if room exists. else false
                socket.join(code);
                io.to(socket.id).emit('roomQueryResp', true);
                console.log("Client "+socket.id+" joined room "+code);
                return;
            }
        }
        io.to(socket.id).emit('roomQueryResp', false);
    });

    socket.on("roomCreate", code => {
        socket.join(code);
        rooms.push([code, socket.id]);
        console.log("Client "+socket.id+" created room "+code);
    });

    socket.on("disconnect", () => {
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i][1] == socket.id) {
                console.log("Client "+socket.id+" left room "+rooms[i][0]);
                rooms.splice(i, 1);
                return;
            }
        }

        console.log("Client "+socket.id+" disconnected");
    });
});
