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

const users = {};
let guessedLetters;
let allGuesses;
let lives;
let word = "";
let gameMaster = "";
let guessedWord;
let gameStarted = false;
let userCount;
let result = "";

const loadGame = () => {
	io.to('Game Room').emit('list users', users);
	io.to('Game Room').emit('generate letter buttons', allGuesses, gameMaster);
	io.to('Game Room').emit('guessed word', guessedWord);
	io.to('Game Room').emit('update lives', lives);
	if(result!="") io.emit('game result', result);
}

const resetGame = () => {
    //resets game values
    guessedLetters = [];
    allGuesses = [];
    lives = 6;
	result = "";
	gameMaster = "";
    word = "";
};

const getWord = () => {
		//hide start game / play again button
		io.to('Game Room').emit('hide button');

		//assigns random game master from connected users
		const userKeys = Object.keys(users);
		gameMaster = userKeys[Math.floor(Math.random() * userKeys.length)];

		//gets word from game master
		io.to(gameMaster).emit('set word');
};

const checkGuess = (letter) => {
    //if the letter is guessed correctly
    if (word.toLowerCase().includes(letter)) {
        guessedLetters.push(letter);

        //Updates guessed word with guessed letter
        guessedWord = word.toLowerCase().split("").map(letter => guessedLetters.includes(letter) ? letter : "_ ");
        io.emit('guessed word', guessedWord);

        if (word === guessedWord.join("")) {
            io.emit('guessed word', guessedWord);
						result = "won! :)";
            io.emit('game result', result);
        }
    } else {
        lives--;
        io.to('Game Room').emit('update lives', lives);
        if (lives <= 0) {
            io.emit('guessed word', guessedWord);
						result = "lost :(";
            io.emit('game result', result);
        }
    }
};

const checkEnoughPlayers = () => {
		userCount = Object.keys(users).length;
		//if there is more than 1 player, show start game button
		if (userCount > 1) io.to('Game Room').emit('show start game button');
}


resetGame();

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
                userCount = Object.keys(users).length;

                io.to('Game Room').emit('set username');
            
                if (gameStarted) loadGame();
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

    

    socket.on('clicked letter', (letter) => {
        allGuesses.push(letter);
        io.to('Game Room').emit('disable letter', letter);
        checkGuess(letter);
    });

    
    socket.on('get word', () => {
        getWord();
    });

    socket.on('start game', (chosenWord) => {
        word = chosenWord;
        gameStarted = true;

        //replaces word with blanks
        guessedWord = word.replace(/[^ ]/g, '_ ');

        loadGame();
    });



    socket.on('add username', (username) => {
        //adds username to list of users
        users[socket.id] = username;
        io.to('Game Room').emit("welcome new user", username);
        //updates list of usernames
        io.to('Game Room').emit('list users', users);
        if (gameStarted === false) checkEnoughPlayers();
    });

    socket.on('chatroom message', (username, message) => {
        io.to('Game Room').emit('send chatroom message', `${username}: ${message}`);
    });

    socket.on('get word', () => {
        getWord();
    });

    socket.on('start game', (chosenWord) => {
        word = chosenWord;
        gameStarted = true;

        //replaces word with blanks
        guessedWord = word.replace(/[^ ]/g, '_ ');

        loadGame();
    });

    socket.on('clicked letter', (letter) => {
        allGuesses.push(letter);
        io.to('Game Room').emit('disable letter', letter);
        checkGuess(letter);
    });

            const disconnectUser = () => {
                    let disconnectedUser = users[socket.id];

                    if (disconnectedUser !== undefined) {
                            console.log(`${disconnectedUser} has disconnected`);

                            //deletes from list of users
                            delete users[socket.id];

                            //updates list of users
                            io.to('Game Room').emit('list users', users);

                            io.to('Game Room').emit('leave game', disconnectedUser);

                            //check if enough players to play game
                            userCount = Object.keys(users).length;

            console.log(userCount);
            console.log(gameMaster);
            console.log()

            //if game master leaves before choosing a word for the game, new game master is assigned
            if(userCount > 1 && socket.id===gameMaster && word === ""){
              getWord();
            }

                            //hide start game button if less than 2 players
                            if(userCount < 2) io.to('Game Room').emit('hide button');

                            //reset game if no players connected
                            if (userCount < 1){
                                gameStarted = false;
                                resetGame();
                            }

                    }
            };

    socket.on('leave game', () => {
        disconnectUser();
        socket.leave('Game Room');

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

    socket.on("disconnect", () => {
        disconnectUser();
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
            socket.on('play again', () => {
                resetGame();
                            loadGame();
                            io.to('Game Room').emit('disable guessing');
                            io.to('Game Room').emit('clear');
                            getWord();
            });
        }  
    
    });


});
