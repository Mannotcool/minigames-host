const io = require("socket.io")(3000, {
    //set this so cors doesnt block connection to the server
    cors: {
        origin: ['http://127.0.0.1:5500']
    }
});



var rooms = [];
var index;
var iTemp; //stupid local variables >:(

console.log("Server started");

io.on("connection", socket => {
    socket.on("roomQuery", (code, maxPlayers) => {
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i][0] == code) {

                if (rooms[i][2] != undefined) {
                    if (rooms[i][2].length >= maxPlayers) {
                        //true if room is full
                        io.to(socket.id).emit("roomFull", true);
                        return;
                    }
                }

        
                //false if room is joinable
                io.to(socket.id).emit("roomFull", false);

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

                //alert host that a player has joined
                var host = rooms[index][1];
                io.to(host).emit("playerJoin", socket.id);

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
                        //alert host that a player has left
                        var host = rooms[i][1];
                        io.to(host).emit("playerLeave", socket.id);

                        console.log("Client "+socket.id+" left room "+rooms[i][0]);
                        rooms[i][2].splice(j, 1);
                        return;
                    }
                }
            }
        }
    });


    socket.on("sendData", (data, roomNum) => {
        io.to(roomNum).broadcast.emit("recvData", data);
    });
});
