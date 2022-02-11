{
    //global vars
    var whatWord;
    var correctGuesses = 0;
    var lives = 10;



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

        socket.emit('roomQuery', code, 10);

        socket.on("roomFull", data => {
            if (data == true) {
                alert("The room you are trying to join is full");
                window.location.href = "index.html";
            }
        });

        socket.on("roomQueryResp", () => {
            var main = document.getElementById("main");
            var startBtn = document.getElementById("startButton");
            var playerCount = document.getElementById("playerCount");
            var inviteurl = document.getElementById("inviteurl");
                    
            inviteurl.value = "http://127.0.0.1:5500/hangman.html?code=" + code;

            main.style.filter = "blur(5px)";
            var waiting = document.createElement("h1");
            waiting.innerText = "Waiting for other player to join...";
            waiting.id = "waiting";
            document.body.appendChild(waiting);

            socket.emit("getRoomInfo", code);
            socket.on("roomInfo", info => {
                if (info[2] == undefined) hostFunc();
                if (info[2] != undefined) clientFunc();
            });

            var players = [];
            var functionCalled = 0;
            function hostFunc() {
                var testInterval = setInterval(() => {
                    socket.on("playerJoin", clientSock => {
                        if (players.includes(clientSock) != true) {
                            players.push(clientSock);
                            playerCount.innerText = "Players: " + players.length + "/10";
                        }
                    });

                    socket.on("playerLeave", clientSock => {
                        if (players.includes(clientSock) == true) {
                            players.splice(players.indexOf(clientSock), 1);
                            playerCount.innerText = "Players: " + players.length + "/10";
                        }
                    });

                    startBtn.addEventListener("click", () => {
                        if (players.length > 0) {
                            clearInterval(testInterval); 

                            if (functionCalled == 0) {
                                exitFuncHost();
                            }
                        }
                    });
                    
                }, 500);

                function exitFuncHost() {
                    //i hate setInterval so much
                    functionCalled = 1;

                    //remove stuff to make room to remove more stuff
                    document.getElementById("delAll").innerHTML = "";
                    document.getElementById("waiting").remove();


                    var inputTitle = document.createElement("h1");
                    inputTitle.innerText = "Enter a word (The word must only contain letters from a-z. All other characters will be deleted):";

                    var textInput = document.createElement("input");
                    textInput.type = "text";
                    textInput.id = "textInput";
                    textInput.placeholder = "Choose a word";
                    document.getElementById("delAll").appendChild(textInput);

                    var submitBtn = document.createElement("button");
                    submitBtn.innerText = "Submit";
                    submitBtn.id = "submitBtn";
                    document.getElementById("delAll").appendChild(submitBtn);



                    document.getElementById("A").remove();
                    document.getElementById("B").remove();
                    document.getElementById("C").remove();
                    document.getElementById("D").remove();
                    document.getElementById("E").remove();
                    document.getElementById("F").remove();
                    document.getElementById("G").remove();
                    document.getElementById("H").remove();
                    document.getElementById("I").remove();
                    document.getElementById("J").remove();
                    document.getElementById("K").remove();
                    document.getElementById("L").remove();
                    document.getElementById("M").remove();
                    document.getElementById("N").remove();
                    document.getElementById("O").remove();
                    document.getElementById("P").remove();
                    document.getElementById("Q").remove();
                    document.getElementById("R").remove();
                    document.getElementById("S").remove();
                    document.getElementById("T").remove();
                    document.getElementById("U").remove();
                    document.getElementById("V").remove();
                    document.getElementById("W").remove();
                    document.getElementById("X").remove();
                    document.getElementById("Y").remove();
                    document.getElementById("Z").remove();
                    


                    document.getElementById("submitBtn").onclick = function() {
                        var chosenWord = document.getElementById("textInput").value;
                        if (chosenWord == "") {
                            alert("Please enter a word");
                        } else {
                            chosenWord = chosenWord.replace(/[^a-z]/gi, '');
                            whatWord = chosenWord.toLowerCase();
                            document.getElementById("delAll").remove();
                            main.style.filter = "none";

                            socket.emit("startGame", code, whatWord);
                            loadGame();
                        }
                    }
                }
            }

            function clientFunc() {
                document.getElementById("delAll").remove();


                document.getElementById("A").onclick = function() {chooseLetter("A", "A");};
                document.getElementById("B").onclick = function() {chooseLetter("B", "B");};
                document.getElementById("C").onclick = function() {chooseLetter("C", "C");};
                document.getElementById("D").onclick = function() {chooseLetter("D", "D");};
                document.getElementById("E").onclick = function() {chooseLetter("E", "E");};
                document.getElementById("F").onclick = function() {chooseLetter("F", "F");};
                document.getElementById("G").onclick = function() {chooseLetter("G", "G");};
                document.getElementById("H").onclick = function() {chooseLetter("H", "H");};
                document.getElementById("I").onclick = function() {chooseLetter("I", "I");};
                document.getElementById("J").onclick = function() {chooseLetter("J", "J");};
                document.getElementById("K").onclick = function() {chooseLetter("K", "K");};
                document.getElementById("L").onclick = function() {chooseLetter("L", "L");};
                document.getElementById("M").onclick = function() {chooseLetter("M", "M");};
                document.getElementById("N").onclick = function() {chooseLetter("N", "N");};
                document.getElementById("O").onclick = function() {chooseLetter("O", "O");};
                document.getElementById("P").onclick = function() {chooseLetter("P", "P");};
                document.getElementById("Q").onclick = function() {chooseLetter("Q", "Q");};
                document.getElementById("R").onclick = function() {chooseLetter("R", "R");};
                document.getElementById("S").onclick = function() {chooseLetter("S", "S");};
                document.getElementById("T").onclick = function() {chooseLetter("T", "T");};
                document.getElementById("U").onclick = function() {chooseLetter("U", "U");};
                document.getElementById("V").onclick = function() {chooseLetter("V", "V");};
                document.getElementById("W").onclick = function() {chooseLetter("W", "W");};
                document.getElementById("X").onclick = function() {chooseLetter("X", "X");};
                document.getElementById("Y").onclick = function() {chooseLetter("Y", "Y");};
                document.getElementById("Z").onclick = function() {chooseLetter("Z", "Z");};

                socket.on("gameStarted", word => {
                    document.getElementById("waiting").remove();
                    main.style.filter = "none";
                    whatWord = word;
                    loadGame();
                });
            }
        });
    });




    //decalre here so i dont have to move a ton of code. this is whole other level of laziness
    var checkForUpdate;

    
    function loadGame() {
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

                    //0 for word update
                    socket.emit("updatePlayers", [0, letter, correctGuesses, letterIndex, h1ID], code);
                }
                
                if (letterIndex == -1 && startIndex <= 0) {
                    console.log(lives);
                    lives--;
                    //1 for lives update
                    socket.emit("updatePlayers", [1, lives], code);
                    if (lives == 0) {
                        alert("you lost. boo hoo");
                        clearInterval(checkForUpdate);
                        done = 1;
                    }
                    return;
                }
            }
        }
    }

    var doneWin = 0;
    function checkWin() {
        if (correctGuesses == whatWord.length && lives > 0 && doneWin == 0) {
            alert("you won! you get bragging rights. nothing else. just bragging rights");
            clearInterval(checkForUpdate);
            doneWin = 1;
        }
    }

    var doneLives = 0;
    checkForUpdate = setInterval(function() {
        socket.on("update", data => {
            if (data[0] == 1) {
                lives = data[1];
                
                if (lives < 1 && doneLives == 0) {
                    doneLives = 1;
                    alert("you lost. boo hoo");
                    clearInterval(checkForUpdate);
                }
            } else if (data[0] == 0) {
                correctGuesses = data[2];

                checkWin();

                document.getElementById("letter"+data[3]).innerText = data[1];
                document.getElementById(data[4]).disabled = true;
            }
        });
    }, 500);

}

