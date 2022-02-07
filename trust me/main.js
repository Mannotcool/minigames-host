$(() => {
    
var rooms = [];
var index;

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


    socket.on("updatePlayers", (data, roomCode) => {
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
});

    
    let username = "";
    let lives;
    io.on("connection", socket => {
    //generates the letters for guessing
    const createLetterButtons = () => {
        $("#letters").html("");
        const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
						"l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y",
						"z"
        ];
        letters.forEach(letter => $('#letters').append(`<button type="button"
				id="${letter}" class="letter" value="${letter}"> ${letter} </button>`));
    };


    //Event Listeners ==========================================================

    $('#letters').on("click", ".letter", function() {
        letter = $(this).val();
        socket.emit("clicked letter", letter);
    });

    $('#leave-chat').click(() => {
        socket.emit("leave game");
    });

    $('#message-box').submit((e) => {
        e.preventDefault();
        let textMessage = $('#text-message').val();

        //if theres a message entered
        if (textMessage != "") {
            socket.emit('chatroom message', username, textMessage);
            //clears message box
            $('#text-message').val('');
        }
        return false;
    });

		$('#button-container').on("click", "#start-game", () => {
        socket.emit('get word');
    });

    $('#button-container').on("click", "#play-again", () => {
        socket.emit('play again');
    });

    //Socket Listeners =========================================================

    socket.on('welcome new user', (newUser) => {
        let message = (newUser === username) ? `Welcome to the chat ${newUser}!`
            : `${newUser} has entered the chat. Please welcome them!`;
        $('#messages').append($('<li>').text(message));
    });

    socket.on('list users', (users) => {
        $('#users').html("");
        $('#userCount').html(`Total users: ${Object.keys(users).length}`);
        for (let id in users) {
            $('#users').append(`<li> ${users[id]} </li>`);
        }
    });

    socket.on('set username', () => {
        while (username === "" || username === null) {
            username = prompt("Please enter a username");
            if (username) {
                socket.emit('add username', username);
            }
        }
    });

		socket.on('set word', () => {
			let word = "";
			while (word === "" || word === null) {
					word = prompt("You were chosen as the game master! Please enter a word for your friends to guess");
					if (word) {
							socket.emit('start game', word);
					}
			}
		});

    socket.on('update lives', (lives) => {
        $("#lives").html(`Lives: ${lives}`);
    });

    socket.on('guessed word', (guessedWord) => {
        $("#guessed-word").html(guessedWord);
    });

    socket.on('game result', (result) => {
        $("#result").html(`You ${result}`);
				//disable letters after game is over
        $(".letter").prop("disabled", true);
				$('#button-container').html("<button id='play-again' class='button'>Play Again</button>")
    });

    socket.on('generate letter buttons', (allGuesses, gameMaster) => {
        createLetterButtons();

				//only users that are not the game master can make guesses
				if(socket.io.engine.id != gameMaster){
					allGuesses.forEach((letter) => {
							$(`#${letter}`).prop("disabled", true);
							$(`#${letter}`).addClass("guessed");
					});
				}
				else{
					$('.letter').prop("disabled", true);
					$(`.letter`).addClass("disabled");
				}
    });

    socket.on('disable letter', (letter) => {
        $(`#${letter}`).prop("disabled", true);
        $(`#${letter}`).addClass("guessed");
    });

		socket.on('disable guessing', () => {
				$('.letter').prop("disabled", true);
		});

    socket.on('send chatroom message', (message) => {
        $('#messages').append($('<li class="message">').text(message));
        const messageArea = document.getElementById("messages");
        messageArea.scrollTop = messageArea.scrollHeight;
    });

    socket.on('leave game', (disconnectUser) => {
        let message = "";
				if(disconnectUser === username){
					message = "You have left the chat.";
				  $(".letter").prop("disabled", true);
				}
				else{
					message = `${disconnectUser} has left the chat.`;
				}
        $('#messages').append($('<li>').text(message));
    });

		socket.on('full game', () => {
        alert("Sorry this game has reached max capacity. Please try again later!");
    });

		socket.on('clear', () => {
				$('#guessed-word').html("");
				$('#result').html("");
		});

		socket.on('show start game button', () => {
        $("#button-container").html("<button id='start-game' class='button'>Start Game </button>");
    });

		socket.on('hide button', () => {
				$('#button-container').html("");
        });
    }); 
});