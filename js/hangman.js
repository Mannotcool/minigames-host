$(() => {
var programming_languages = [
	"python",
	"javascript",
	"mongodb",
	"json",
	"java",
	"html",
	"css",
	"c",
	"csharp",
	"golang",
	"kotlin",
	"php",
	"sql",
	"ruby"
]

let answer = '';
let maxWrong = 6;
let mistakes = 0;
let guessed = [];
let wordStatus = null;

function generateButtons() {
  let buttonsHTML = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter =>
    `
      <button
        class="btn btn-lg btn-primary m-2"
        id='` + letter + `'
        onClick="handleGuess('` + letter + `')"
      >
        ` + letter + `
      </button>
    `).join('');

  document.getElementById('keyboard').innerHTML = buttonsHTML;
}

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

let username = "";

// socket.on('set username', () => {
//     while (username === "" || username === null) {
//         username = prompt("Please enter a username");
//         if (username) {
//             socket.emit('add username', username);
//          }
//      }
// });

// socket.on('set word', () => {
//   let word = "";
//   while (word === "" || word === null) {
//       word = prompt("You were chosen as the game master! Please enter a word for your friends to guess");
//       if (word) {
//           socket.emit('start game', word);
//           answer
//       }
//   }
//  });

//   socket.on('update lives', (lives) => {
//       updateMistakes();
//       checkIfGameLost();
//       updateHangmanPicture();
//   });

//   socket.on('guessed word', (guessedWord) => {
//     guessedWord();
//   });

//   socket.on('game result', (result) => {
//       $("#result").html(`You ${result}`);
//       //disable letters after game is over
//       $(".letter").prop("disabled", true);
//       $('#button-container').html("<button id='play-again' class='button'>Play Again</button>")
//   });

//   socket.on('generate letter buttons', (allGuesses, gameMaster) => {
//       createLetterButtons();

//       //only users that are not the game master can make guesses
//       if(socket.io.engine.id != gameMaster){
//         allGuesses.forEach((letter) => {
//             $(`#${letter}`).prop("disabled", true);
//             $(`#${letter}`).addClass("guessed");
//         });
//       }
//       else{
//         $('.letter').prop("disabled", true);
//         $(`.letter`).addClass("disabled");
//       }
//   });

//   socket.on('disable letter', (letter) => {
//       $(`#${letter}`).prop("disabled", true);
//       $(`#${letter}`).addClass("guessed");
//   });

//   socket.on('disable guessing', () => {
//       $('.letter').prop("disabled", true);
//   });

//   socket.on('send chatroom message', (message) => {
//       $('#messages').append($('<li class="message">').text(message));
//       const messageArea = document.getElementById("messages");
//       messageArea.scrollTop = messageArea.scrollHeight;
//   });

//   socket.on('leave game', (disconnectUser) => {
//       let message = "";
//       if(disconnectUser === username){
//         message = "You have left the chat.";
//         $(".letter").prop("disabled", true);
//       }
//       else{
//         message = `${disconnectUser} has left the chat.`;
//       }
//       $('#messages').append($('<li>').text(message));
//   });

//   socket.on('full game', () => {
//       alert("Sorry this game has reached max capacity. Please try again later!");
//   });

//   socket.on('clear', () => {
//       $('#guessed-word').html("");
//       $('#result').html("");
//   });

//   socket.on('show start game button', () => {
//       $("#button-container").html("<button id='start-game' class='button'>Start Game </button>");
//   });

//   socket.on('hide button', () => {
//       $('#button-container').html("");
//   });
});
