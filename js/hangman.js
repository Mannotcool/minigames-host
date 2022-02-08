{ 
    var words = ["python", "java", "cobol", "javascript", "c", "assembly"];
    var whatWord;
    var correctGuesses = 0;
    var lives = 10;
    
    function loadGame() {
        whatWord = words[Math.round(Math.random() * words.length)];
        var wordDiv = document.getElementById("word");
        var wordh1;

        for (var i = 0; i < whatWord.length; i++) {
            wordh1 = document.createElement("h1");
            wordh1.id = "letter"+i;
            wordh1.innerText = "_";
            wordh1.style = "float: left; margin-left: 5px;";
            wordDiv.appendChild(wordh1);
        }
    }

    function chooseLetter(letter, h1ID) {
        var letter = letter.toLowerCase();
        var letterIndex;
        var startIndex = 0; //to check for more than one instance of a letter
        
        if (whatWord != -1) {
            for (var i = 0; i < whatWord.length; i++) {
                if ((letterIndex = whatWord.indexOf(letter, startIndex)) != -1) {
                    startIndex = letterIndex+1;
                    document.getElementById("letter"+letterIndex).innerText = letter;
                    correctGuesses++;
                    checkWin();
                    document.getElementById(h1ID).disabled = true;
                }
                
                if (letterIndex == -1 && startIndex <= 0) {
                    console.log(lives);
                    lives--;
                    if (lives == 0) {
                        alert("you lost. boo hoo");
                    }
                    return;
                }
            }
        }
    }

    function checkWin() {
        if (correctGuesses == whatWord.length && lives != 1) {
            alert("you won! you get bragging rights. nothing else. just bragging rights");
        }
    }
}