const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var path = require("path");

//list of users in the chat
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

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

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
    lives = 7;
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

//Server socket connection listener
io.on('connection', (socket) => {
    userCount = Object.keys(users).length;

    //Game limited to 3 players
    if (userCount >= 3) {
        io.to(socket.id).emit('full game');
        io.sockets.sockets[socket.id].disconnect();
    } else {
        socket.join('Game Room');
        console.log('A user connected');

        io.to('Game Room').emit('set username');

        if (gameStarted) loadGame();

        //Socket listeners =====================================================

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
        });

        //handling built-in disconnect event
        socket.on('disconnect', () => {
            disconnectUser();
        });


        socket.on('play again', () => {
            resetGame();
						loadGame();
						io.to('Game Room').emit('disable guessing');
						io.to('Game Room').emit('clear');
						getWord();
        });
    }
}); //end of socket server listener

http.listen(process.env.PORT || 3000, () => {
    console.log("Waiting for visitors");
});