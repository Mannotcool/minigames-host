$(function() {
  let maxWrong = '6';

// check if the url contains a code
var url = window.location.href;
var code = url.split('?code=').pop();
            
var nakedurl = location.protocol + '//' + location.host + location.pathname;

            
  if (code == nakedurl) {
      var code = Math.floor(100000 + Math.random() * 900000)
      window.location.href = nakedurl+"?code="+code;
    } else {
      if (code.length != 6 || isNaN(code)) {
            window.location.href = nakedurl;
    }
  }
  const socket = io.connect('http://localhost:3000');
  socket.on("connect", () => {
    console.log(code);
    
    socket.emit('roomQuery', code, 10);

    socket.on("roomFull", data => {
        if (data == true) {
            alert("The room you are trying to join is full");
            window.location.href = "index.html";
        }
    });

    socket.on('roomQueryResp', data => {
          var inviteurl = document.getElementById("inviteurl");
                            
            inviteurl.value = "http://127.0.0.1:5500/hangman.html?code=" + code;


            var amountOfPlayers = [];
            
            var title = document.createElement("h1");
            title.innerText = "Welcome to lobby "+code+"! Please wait for the game to start.";
            document.body.appendChild(title);

            let socket = io();
            let username = "";
            let lives;
            

            const createLetterButtons = () => {
              $("#letters").html("");
              const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
                  "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y",
                  "z"
              ];
              letters.forEach(letter => $('#keyboard').append(`<button type="button"
              id="${letter}" class="letter" value="${letter}"> ${letter} </button>`));
            };

            $('#letters').on("click", ".letter", function() {
              letter = $(this).val();
              socket.emit("clicked letter", letter);
            });

            $('#button-container').on("click", "#start-game", () => {
              socket.emit('get word');
            });

            $('#button-container').on("click", "#play-again", () => {
              socket.emit('play again');
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

            socket.on('update lives', (mistakes) => {
              $("#lives").html(`Lives: ${mistakes}`);
              updateHangmanPicture()
              guessedWord();
              checkIfGameWon();
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
              mistakes++;
              updateMistakes();
              checkIfGameLost();
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

            function handleGuess(chosenLetter) {
              guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;
              document.getElementById(chosenLetter).setAttribute('disabled', true);

              if (answer.indexOf(chosenLetter) >= 0) {
                guessedWord();
                checkIfGameWon();
              } else if (answer.indexOf(chosenLetter) === -1) {
                mistakes++;
                updateMistakes();
                checkIfGameLost();
                updateHangmanPicture();
              }
            }

            function updateHangmanPicture() {
              document.getElementById('hangmanPic').src = './assets/' + mistakes + '.png';
            }

            function checkIfGameWon() {
              if (wordStatus === answer) {
                document.getElementById('keyboard').innerHTML = 'You Won!!!';
              }
            }

            function checkIfGameLost() {
              if (mistakes === maxWrong) {
                document.getElementById('wordSpotlight').innerHTML = 'The answer was: ' + answer;
                document.getElementById('keyboard').innerHTML = 'You Lost!!!';
              }
            }

            function guessedWord() {
              wordStatus = answer.split('').map(letter => (guessed.indexOf(letter) >= 0 ? letter : " _ ")).join('');

              document.getElementById('wordSpotlight').innerHTML = wordStatus;
            }

            function updateMistakes() {
              document.getElementById('mistakes').innerHTML = mistakes;
            }

            function reset() {
              mistakes = 0;
              guessed = [];
              document.getElementById('hangmanPic').src = './assets/0.png';

              randomWord();
              guessedWord();
              updateMistakes();
              generateButtons();
            }

            document.getElementById('maxWrong').innerHTML = maxWrong;

            generateButtons();
            guessedWord();



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
                      answer
                  }
              }
            });

              socket.on('update lives', (lives) => {
                  updateMistakes();
                  checkIfGameLost();
                  updateHangmanPicture();
              });

              socket.on('guessed word', (guessedWord) => {
                guessedWord();
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
});

