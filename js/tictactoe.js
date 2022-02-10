//this is to set player to either x or 0
var flag;
var xTurn = 1;
var oTurn = 0;
var roomCode;

function myfunc(socket) {
    // Setting DOM to all boxes or input field
    var b1, b2, b3, b4, b5, b6, b7, b8, b9;
    b1 = document.getElementById("b1").value;
    b2 = document.getElementById("b2").value;
    b3 = document.getElementById("b3").value;
    b4 = document.getElementById("b4").value;
    b5 = document.getElementById("b5").value;
    b6 = document.getElementById("b6").value;
    b7 = document.getElementById("b7").value;
    b8 = document.getElementById("b8").value;
    b9 = document.getElementById("b9").value;

    // Checking if Player X won or not and after
    // that disabled all the other fields
    if ((b1 == 'x' || b1 == 'X') && (b2 == 'x' ||
        b2 == 'X') && (b3 == 'x' || b3 == 'X')) {
            socket.emit("playerWin", "X", roomCode);
    }
    else if ((b1 == 'x' || b1 == 'X') && (b4 == 'x' ||
        b4 == 'X') && (b7 == 'x' || b7 == 'X')) {
            socket.emit("playerWin", "X", roomCode);
    }
    else if ((b7 == 'x' || b7 == 'X') && (b8 == 'x' ||
        b8 == 'X') && (b9 == 'x' || b9 == 'X')) {
            socket.emit("playerWin", "X", roomCode);
    }
    else if ((b3 == 'x' || b3 == 'X') && (b6 == 'x' ||
        b6 == 'X') && (b9 == 'x' || b9 == 'X')) {
            socket.emit("playerWin", "X", roomCode);
    }
    else if ((b1 == 'x' || b1 == 'X') && (b5 == 'x' ||
        b5 == 'X') && (b9 == 'x' || b9 == 'X')) {
            socket.emit("playerWin", "X", roomCode);
    }
    else if ((b3 == 'x' || b3 == 'X') && (b5 == 'x' ||
        b5 == 'X') && (b7 == 'x' || b7 == 'X')) {
            socket.emit("playerWin", "X", roomCode);
    }
    else if ((b2 == 'x' || b2 == 'X') && (b5 == 'x' ||
        b5 == 'X') && (b8 == 'x' || b8 == 'X')) {
            socket.emit("playerWin", "X", roomCode);
    }
    else if ((b4 == 'x' || b4 == 'X') && (b5 == 'x' ||
        b5 == 'X') && (b6 == 'x' || b6 == 'X')) {
            socket.emit("playerWin", "X", roomCode);
    }

    // Checking of Player X finish
    // Checking for Player 0 starts, Is player 0 won or
    // not and after that disabled all the other fields
    else if ((b1 == '0' || b1 == '0') && (b2 == '0' ||
        b2 == '0') && (b3 == '0' || b3 == '0')) {
            socket.emit("playerWin", "0", roomCode);
    }
    else if ((b1 == '0' || b1 == '0') && (b4 == '0' ||
        b4 == '0') && (b7 == '0' || b7 == '0')) {
            socket.emit("playerWin", "0", roomCode);
    }
    else if ((b7 == '0' || b7 == '0') && (b8 == '0' ||
        b8 == '0') && (b9 == '0' || b9 == '0')) {
            socket.emit("playerWin", "0", roomCode);
    }
    else if ((b3 == '0' || b3 == '0') && (b6 == '0' ||
        b6 == '0') && (b9 == '0' || b9 == '0')) {
            socket.emit("playerWin", "0", roomCode);
    }
    else if ((b1 == '0' || b1 == '0') && (b5 == '0' ||
        b5 == '0') && (b9 == '0' || b9 == '0')) {
            socket.emit("playerWin", "0", roomCode);
    }
    else if ((b3 == '0' || b3 == '0') && (b5 == '0' ||
        b5 == '0') && (b7 == '0' || b7 == '0')) {
            socket.emit("playerWin", "0", roomCode);
    }
    else if ((b2 == '0' || b2 == '0') && (b5 == '0' ||
        b5 == '0') && (b8 == '0' || b8 == '0')) {
            socket.emit("playerWin", "0", roomCode);
    }
    else if ((b4 == '0' || b4 == '0') && (b5 == '0' ||
        b5 == '0') && (b6 == '0' || b6 == '0')) {
        socket.emit("playerWin", "0", roomCode);
    }

    // Checking of Player 0 finish
    // Here, Checking about Tie
    else if ((b1 == 'X' || b1 == '0') && (b2 == 'X'
        || b2 == '0') && (b3 == 'X' || b3 == '0') &&
        (b4 == 'X' || b4 == '0') && (b5 == 'X' ||
        b5 == '0') && (b6 == 'X' || b6 == '0') &&
        (b7 == 'X' || b7 == '0') && (b8 == 'X' ||
        b8 == '0') && (b9 == 'X' || b9 == '0')) {
            socket.emit("playerWin", "tie", roomCode);
    }
    else {

        // Here, Printing Result
        if (flag == 1) {
            document.getElementById('print')
                .innerHTML = "Player X Turn";
        }
        else {
            document.getElementById('print')
                .innerHTML = "Player 0 Turn";
        }
    }
}

// Function to reset game
function myfunc_2() {
    location.reload();
    document.getElementById("b1").value = '';
    document.getElementById("b2").value = '';
    document.getElementById("b3").value = '';
    document.getElementById("b4").value = '';
    document.getElementById("b5").value = '';
    document.getElementById("b6").value = '';
    document.getElementById("b7").value = '';
    document.getElementById("b8").value = '';
    document.getElementById("b9").value = '';
}

//disable all because yes
function disableAll() {
    document.getElementById("b1").disabled = true;
    document.getElementById("b2").disabled = true;
    document.getElementById("b3").disabled = true;
    document.getElementById("b4").disabled = true;
    document.getElementById("b5").disabled = true;
    document.getElementById("b6").disabled = true;
    document.getElementById("b7").disabled = true;
    document.getElementById("b8").disabled = true;
    document.getElementById("b9").disabled = true;
}

// Here onwards, functions check turn of the player
// and put accordingly value X or 0

//SET FLAG TO 1 FOR PLAYER X, 0 FOR PLAYER 0. DO THIS IN tictactoe.html (based on if player is host (X) or client (0))

function myfunc_3(id, socket, code, myID) {
    
    if (flag == 1 && xTurn == 1) {
        document.getElementById(id).value = "X";
        document.getElementById(id).disabled = true;

        socket.emit("updatePlayers", ["X", id, 0, 1, myID], code); //index 0 is for x or 0, index 1 is the id of the button, index 2 is for xTurn, index 3 is for oTurn. myID is for this client's id (update player move)
        $("#loading-move").show();

    } else if (flag == 0 && oTurn == 1) {
        document.getElementById(id).value = "0";
        document.getElementById(id).disabled = true;

        oTurn = 0;
        xTurn = 1;
        socket.emit("updatePlayers", ["0", id, 1, 0, myID], code); //index 0 is for x or 0, index 1 is the id of the button, index 2 is for xTurn, index 3 is for oTurn
        $("#loading-move").show();

    } else {
        alert("hey buddy, it's not your turn");
    }
}

function awaitGameUpdate(socket) {
    var i = setInterval(function () {
        socket.on("update", data => {
            console.log(data);
            document.getElementById(data[1]).value = data[0];
            document.getElementById(data[1]).disabled = true;
            xTurn = data[2];
            oTurn = data[3];

            socket.on("updateWait", function() {
                setTimeout(function() {
                $("#loading-move").hide();
                console.log("my turn uwu?");
                }, 200);
            });

            
            socket.on("playerWon", xOro => {
                if (xOro == "X") {
                    clearInterval( i );
                    document.getElementById('print').innerHTML = "Playbter X won";
                    disableAll();
                    window.alert('Player X won');
                    document.getElementById('reset').disabled = false;
                    
                } else if (xOro == "0") {
                    clearInterval ( i );
                    document.getElementById('print').innerHTML = "Player 0 won";
                    disableAll();
                    window.alert('Player 0 won');
                    //remove the disabled attribute of the reset button
                    document.getElementById('reset').disabled = false;
                    
                    
                    
                } else if (xOro == "tie") {
                    clearInterval( i );
                    document.getElementById('print').innerHTML = "Match Tie";
                    disableAll();
                    window.alert('Match Tie');
                    document.getElementById('reset').disabled = false;
                    
                } else {
                    return;
                }
            });
        });
    }, 500);
}
