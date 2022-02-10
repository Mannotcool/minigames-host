const io = require("socket.io")(3000, {
    //set this so cors doesnt block connection to the server
    cors: {
        origin: ['http://127.0.0.1:5500']
    }
});



var rooms = [];

console.log("Server started");

io.on("connection", socket => {
    socket.on("roomQuery", (code, maxPlayers) => {
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i][0] == code) {
                var index;

                if (rooms[i][1] == undefined) {
                    if (rooms[i][2] != undefined) {
                        if (rooms[i][2].length >= maxPlayers) {
                            //true if room is full
                            io.to(socket.id).emit("roomFull", true);
                            return;
                        }
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
                

                if (rooms[index][1] == undefined) {
                    rooms[index][1] = socket.id;
                } else {
                    if (rooms[index][2] == undefined) {
                        rooms[index][2] = [socket.id];
                    } else {
                        rooms[index][2].push(socket.id);
                    }
                }

                //alert host that a player has joined
                var host = rooms[index][1];
                io.to(host).emit("playerJoin", socket.id);

                //send back query response
                io.to(socket.id).emit('roomQueryResp');
                console.log("Client "+socket.id+" joined room "+code);
                return;
            }
        }

        //if the room doesnt exist, create it
        io.to(socket.id).emit('roomQueryResp');
        socket.join(code);
        rooms.push([code, socket.id]);
        console.log("Client "+socket.id+" created room "+code);
    });

    socket.on("disconnect", () => {
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i][2] != undefined) {
                for (var j = 0; j < rooms[i][2].length; j++) {
                    if (rooms[i][2][j] == socket.id) {
                        //alert host that a player has left
                        var host = rooms[i][1];
                        io.to(host).emit("playerLeave", socket.id);

                        console.log("Client "+socket.id+" left room "+rooms[i][0]);
                        rooms[i][2].splice(j, 1);
                        break;
                    }
                }
            }

            if (rooms[i][1] == socket.id) {
                rooms[i][1] = undefined;
                console.log("Host left room "+rooms[i][0]); 
            }
            // If there is no players and/or host, remove the room.
            if (rooms[i][1] == undefined && (rooms[i][2] == undefined || rooms[i][2].length == 0)) {
                console.log("Someone with the id "+socket.id+" destroyed room "+rooms[i][0]);
                rooms.splice(i, 1);
                return;
            }
            console.log(rooms);
        }
    });


    socket.on("updatePlayers", (data, roomCode) => {
        var roomIndex;

        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i][0] == roomCode) roomIndex = i;
        }

        if (data[2] == 1) {
            io.to(rooms[roomIndex][1]).emit("updateWait");
        } else if (data[2] == 0) {
            io.to(rooms[roomIndex][2][0]).emit("updateWait");
        }
        io.to(roomCode).emit("update", data);
    });

    socket.on("getRoomInfo", roomCode => {
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i][0] == roomCode) {
                io.to(socket.id).emit("roomInfo", rooms[i]);
            }
        }
    });

    socket.on("playerWin", (xOro, room) => {
        io.to(room).emit("playerWon", xOro);
    });


    //this code is complete chaos. im too tired to fix it right now.
    socket.on("updateReplay", room => {
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i][0] == room) {
                console.log(rooms[i][2]);
                
                if (rooms[i][3] == undefined) {
                    rooms[i][3] = [socket.id];
                } else {
                    if (rooms[i][3].includes(socket.id) == false) {
                        rooms[i][3].push(socket.id);
                    }
                }

                if (rooms[i][3].length > 1) {
                    const newcode = Math.floor(100000 + Math.random() * 900000);
                    console.log(newcode);
                    io.to(room).emit("reload", newcode);
                    // wait 500 ms then send the replay
                    setTimeout(() => {
                        io.to(room).emit("reload", newcode);
                        clearTimeout();
                    }, 2000);
                }
                return;
            }
        }
    });
});
