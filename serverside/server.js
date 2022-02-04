const io = require("socket.io")(3000, {
    //set this so cors doesnt block connection to the server
    cors: {
        origin: ['http://127.0.0.1:5500']
    }
});



var rooms = [];

console.log("Server started");

io.on("connection", socket => {
    socket.on("roomQuery", code => {
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i][0] == code) {
                //true if room exists then join. else false and create room for client
                socket.join(code);
                io.to(socket.id).emit('roomQueryResp', true);
                console.log("Client "+socket.id+" joined room "+code);
                return;
            }
        }

        io.to(socket.id).emit('roomQueryResp', false);
        socket.join(code);
        rooms.push([code, socket.id]);
        console.log("Client "+socket.id+" created room "+code);
    });

    socket.on("disconnect", () => {
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i][1] == socket.id) {
                io.socketsLeave(rooms[i][0]);
                console.log("Client "+socket.id+" destroyed room "+rooms[i][0]);
                rooms.splice(i, 1);
                return;
            }
        }

        console.log("Client "+socket.id+" disconnected");
    });
});
