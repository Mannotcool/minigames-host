// on document ready with jquery
$(document).ready(function() {
    // hide loading move
    $("#loading-move").hide();
});



const socket = io.connect('http://localhost:3000');
var myID;

const main = document.getElementById('main');

// check if the url contains a code
var url = window.location.href;
var code = url.split('?code=').pop();

var nakedurl = location.protocol + '//' + location.host + location.pathname;


if (code == nakedurl) {
    var code = Math.floor(100000 + Math.random() * 900000);
    window.location.href = nakedurl+"?code="+code;
} else {
    if (code.length != 6 || isNaN(code)) {
        window.location.href = nakedurl;
    }
}

var inviteurl = document.getElementById("inviteurl");         
inviteurl.value = "http://127.0.0.1:5500/tictactoe.html?code=" + code;                 

socket.on("connect", () => {
    socket.on("sendID", clientID => {
        myID = clientID;
    });
    
    socket.emit("roomQuery", code, 1); //1 other player allowed (host is counted seperately from the rest of the players)

    socket.on("roomFull", full => {
        if (full) {
            alert("Room is full!");
            window.location.href = "/tictactoe.html";
        }
    });


    socket.on("roomQueryResp", data => {


        socket.emit("getRoomInfo", code);
        socket.on("roomInfo", info => {
            if (info[2] == undefined) roomHost();
            if (info[2] != undefined) roomClient();
        });

        function roomHost() {
            var testInterval = setInterval(() => {
                socket.on("playerJoin", () => {
                    clearInterval(testInterval);
                    exitLoop();
                });
            }, 500);


            // Function called whenever user tab on any box
            function exitLoop() {
                // jquery on ready
                $(document).ready(function () {
                    $('#blur-box').removeAttr("style");
                    $('#loading-screen').empty();
                });
                console.log('test');
                //set host player to x
                flag = 1;
                roomCode = code;

                awaitGameUpdate(socket);

                document.getElementById("b1").onclick = function() { myfunc_3("b1", socket, code, myID);myfunc(socket); };
                document.getElementById("b2").onclick = function() { myfunc_3("b2", socket, code, myID);myfunc(socket); };
                document.getElementById("b3").onclick = function() { myfunc_3("b3", socket, code, myID);myfunc(socket); };
                document.getElementById("b4").onclick = function() { myfunc_3("b4", socket, code, myID);myfunc(socket); };
                document.getElementById("b5").onclick = function() { myfunc_3("b5", socket, code, myID);myfunc(socket); };
                document.getElementById("b6").onclick = function() { myfunc_3("b6", socket, code, myID);myfunc(socket); };
                document.getElementById("b7").onclick = function() { myfunc_3("b7", socket, code, myID);myfunc(socket); };
                document.getElementById("b8").onclick = function() { myfunc_3("b8", socket, code, myID);myfunc(socket); };
                document.getElementById("b9").onclick = function() { myfunc_3("b9", socket, code, myID);myfunc(socket); };
            }
        }

        function roomClient() {
            $(document).ready(function () {
                    $('#blur-box').removeAttr("style");
                    $('#loading-screen').empty();
            });

            //set client player to 0
            flag = 0;
            roomCode = code;
            
            awaitGameUpdate(socket);
            $("#loading-move").hide();

            document.getElementById("b1").onclick = function() { myfunc_3("b1", socket, code, myID);myfunc(socket); };
            document.getElementById("b2").onclick = function() { myfunc_3("b2", socket, code, myID);myfunc(socket); };
            document.getElementById("b3").onclick = function() { myfunc_3("b3", socket, code, myID);myfunc(socket); };
            document.getElementById("b4").onclick = function() { myfunc_3("b4", socket, code, myID);myfunc(socket); };
            document.getElementById("b5").onclick = function() { myfunc_3("b5", socket, code, myID);myfunc(socket); };
            document.getElementById("b6").onclick = function() { myfunc_3("b6", socket, code, myID);myfunc(socket); };
            document.getElementById("b7").onclick = function() { myfunc_3("b7", socket, code, myID);myfunc(socket); };
            document.getElementById("b8").onclick = function() { myfunc_3("b8", socket, code, myID);myfunc(socket); };
            document.getElementById("b9").onclick = function() { myfunc_3("b9", socket, code, myID);myfunc(socket); };
        }
    });
});





//this is to set player to either x or 0
const congratsMsgs = [
	["Please accept my heartiest congratulation on your promotion. I am so happy about your promotion. You are one step closer to your dream. Well done!"],
	["It’s impressive to see all your dreams are coming true. Good job! Congratulations on your big promotion. You worked hard, and you deserve it—my best wishes on your promotion."],
	["You just rose one step higher on the ladder that leads you to the ultimate success in life. Congratulations on your promotion!"],
	["May this promotion be the perfect inspiration for you to make an even bigger contribution to your company. Congratulations!"],
	["It’s a piece of happy news for all of us to know that you’re getting promoted. We all hope that you’ll make a leader someday. Congratulations!"],
	["You always bring positive energy to the office. Promoting you is one of the rightest decisions this company has ever made. Congratulations!"],
	["Dedication and hard work never remains unpaid. Your promotion is a classic example of that. I am very delighted. Congratulations!"],
	["I feel so overwhelmed by the joy of seeing you win the award. You made us all proud with this win. Congratulations!"],
	["I’m so happy that your talent and hard work had finally been rewarded. You really deserved this award more than anyone else!"],
	["You didn’t just take the award home with you. You have won the hearts of us with it. Congratulations to you for winning everything!"],
	["Congratulations to the most talented guy in the field. I’d also like to thank the award committee for finally finding the hidden gem in the box!"],
	["Deep inside my heart, I always knew that you are born to stand out; it does not matter how much bigger the crowd is. Congratulations on this big award. I am so proud of you."],
	["Well done. We are so proud of you for achieving this brilliant award. Your hard work paid off finally. Congratulations on this new venture."],
	["Congratulations dear. This award has added a new feather to your crown, and You truly deserved it in every way. Take a bow for such an amazing performance."],
	["It would have been an injustice if such a brilliant person like you wasn’t rewarded for all of his great contributions! Congratulations!"],
	["Many many congratulations on being graduated. This is just the beginning. You will shine brighter than you can think in the future. Keep it up!"],
	["You have finished gathering all the knowledge and tools that you need for the rest of your life. It’s time to apply them. Congratulations!"],
	["There’s no better way of completing graduation than with a distinction. Your hard work for all these years has been paid off. Congratulations!"],
	["Congratulations on passing this significant milestone. Nice work you have done, and I hope success will keep following you in the future. Great job, Mr/ Miss Graduate."],
	["Congratulation Graduate. Keep striving throughout your life because the sky is the only limit for you. All the best for the future, dear."],
	["You have prepared yourself well for the struggles of life. It’s time to set your aims high and start chasing them. Congratulations!"],
	["This is a day of great happiness for everyone including me. You’ve made us all proud. I wish you a successful life ahead. Congratulations!"],
	["You deserve this job and I am so happy for you! Congratulations and good luck"],
	["Congratulations on your new job! I am so happy to see you fulfilling all your dreams. You deserve this job, and I am so proud of you— best of luck for your bright future."],
	["May your new job opens a new door of opportunities in your life. Best wishes and good luck with your new job, a new career. Wishing you all the best in your career."],
	["Watching you chasing the best in life makes me so happy that I cannot describe. You deserve all the happiness in the world—best wishes for your new job."],
	["Congratulations! I wish you all the best in your dream job. I have seen you working hard for this position. You are suitable for the post. Keep up the great work."],
	["You’re one of the best employees in the office. I will surely miss your presence, but I am happy about your new job. You deserve the job as you worked hard for it. Congratulations!"],
	["Congratulations! All the sacrifices and sleepless nights have finally paid off. I am really happy for you."],
	["My heart is so pleased for you and your achievement in passing this exam. You proved that with determination and hard work, success could surely be achieved. Congratulations!"],
	["My heartfelt congratulations go to you for passing this exam. You are a well-deserved candidate, and I am truly happy for you. Keep going!"],
	["Your good results will open new doors of opportunities. May you have continued success and happiness. Enjoy what you do, and success will follow as before."],
	["May God bless you with more success in the coming exams. Congrats on passing this one. You were born to fly, and this exam was a simple milestone to make you fly higher."],
	["I was worried, but you made me proud anyway. Congratulations on passing the exam with good grades. You keep your winning streak, and it makes my heart fly. Best wishes."]
]

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

function myfunc_3(id, socket, code) {
    
    if (flag == 1 && xTurn == 1) {
        document.getElementById(id).value = "X";
        document.getElementById(id).disabled = true;

        socket.emit("updatePlayers", ["X", id, 0, 1], code); //index 0 is for x or 0, index 1 is the id of the button, index 2 is for xTurn, index 3 is for oTurn
        $("#loading-move").show();

    } else if (flag == 0 && oTurn == 1) {
        document.getElementById(id).value = "0";
        document.getElementById(id).disabled = true;

        oTurn = 0;
        xTurn = 1;
        socket.emit("updatePlayers", ["0", id, 1, 0], code); //index 0 is for x or 0, index 1 is the id of the button, index 2 is for xTurn, index 3 is for oTurn
        $("#loading-move").show();

    } else {
        alert("hey buddy, it's not your turn");
    }
}

function awaitGameUpdate(socket) {
    var i = setInterval(function () {
        socket.on("updateWait", function() {
            setTimeout(function() {
                $("#loading-move").hide();
            }, 200);
        });

        socket.on("update", data => {
            console.log(data);
            document.getElementById(data[1]).value = data[0];
            document.getElementById(data[1]).disabled = true;
            xTurn = data[2];
            oTurn = data[3];

            
            socket.on("playerWon", xOro => {
                if (xOro == "X") {
                    clearInterval( i );
                    document.getElementById('print').innerHTML = "Player X won";
                    disableAll();
                    $("#loading-move").hide();
                    var myModal = document.getElementById('pXmodal');
                    var modal = bootstrap.Modal.getOrCreateInstance(myModal)
                    modal.show()
                    $('#blur-box').attr("style", "filter: blur(4px); pointer-events: none; opacity: 0.4;");
                    document.getElementById('reset').disabled = false;
                    
                } else if (xOro == "0") {
                    clearInterval ( i );
                    $("#loading-move").hide();
                    // add attr to blur box
                    $('#blur-box').attr("style", "filter: blur(4px); pointer-events: none; opacity: 0.4;");
                    var myModal = document.getElementById('p0modal');
                    var modal = bootstrap.Modal.getOrCreateInstance(myModal)
                    modal.show()

                   
                    document.getElementById('print').innerHTML = "Player 0 won";
                    disableAll();
                    //remove the disabled attribute of the reset button
                    document.getElementById('reset').disabled = false;
                    
                    
                    
                } else if (xOro == "tie") {
                    clearInterval ( i );
                    $("#loading-move").hide();
                    // add attr to blur box
                    $('#blur-box').attr("style", "filter: blur(4px); pointer-events: none; opacity: 0.4;");
                    var myModal = document.getElementById('tiemodal');
                    var modal = bootstrap.Modal.getOrCreateInstance(myModal)
                    modal.show()

                   
                    document.getElementById('print').innerHTML = "Player 0 won";
                    disableAll();
                    //remove the disabled attribute of the reset button
                    document.getElementById('reset').disabled = false;
                    
                } else {
                    return;
                }
            });
        });
    }, 500);
}

function votePlayAgain(socket) {
    socket.emit("updateReplay", 1, code);
    setInterval(function() {
        socket.on("reload", function() {
            alert("reloading");
            window.location.href = nakedurl;
        });

        socket.on("leaveRoom", function() {
            window.location.href = "/index.html";
        });
    }, 500);
}

function voteNo(socket) {
    socket.emit("updateReplay", 0, code);
    setInterval(function() {
        socket.on("reload", function() {
            alert("reloading...");
            window.location.href = nakedurl;
        });

        socket.on("leaveRoom", function() {
            window.location.href = "/index.html";
        });
    }, 500);
}
