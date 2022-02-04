const io = require("socket.io")(3000, {
    //set this so cors doesnt block connection to the server
    cors: {
        origin: ['http://127.0.0.1:5500']
    }
});



var rooms = [];
var index;

console.log("Server started");

io.on("connection", socket => {
    socket.on("roomQuery", code => {
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i][0] == code) {
                //true if room exists then join. else false and create room for client
                socket.join(code);

                //find index of current room code and add another client to the array
                for (var i = 0; i < rooms.length; i++) {
                    if (rooms[i][0] == code) index = i;
                }
                
                if (rooms[index][2] == undefined) {
                    rooms[index][2] = [socket.id];
                } else {
                    rooms[index][2].push(socket.id);
                }
                console.log(rooms);

                //alert host that a player has joined
                io.to(code).emit("playerJoin");

                //send back query response
                io.to(socket.id).emit('roomQueryResp', true);
                console.log("Client "+socket.id+" joined room "+code);
                return;
            }
        }

        //if the room doesnt exist, create it
        io.to(socket.id).emit('roomQueryResp', false);
        socket.join(code);
        rooms.push([code, socket.id]);
        console.log("Client "+socket.id+" created room "+code);
    });

    socket.on("disconnect", () => {
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i][1] == socket.id) {
                console.log("Client "+socket.id+" destroyed room "+rooms[i][0]);
                rooms.splice(i, 1);
                return;
            }

            if (rooms[i][2] != undefined) {
                for (var j = 0; j < rooms[i][2].length; j++) {
                    if (rooms[i][2][j] == socket.id) {
                        console.log("Client "+socket.id+" left room "+rooms[i][0]);
                        rooms[i][2].splice(j, 1);
                        return;
                    }
                }
            }
        }
    });

    socket.on("sendData", code => {
        var localIndex;
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i][0] == code) localIndex = i;
        }
        io.to(code).emit("sentData", rooms[localIndex]);
        console.log(rooms[localIndex]);
    });
});
