const view = document.getElementById("view");
const ctx = view.getContext("2d");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("hiscore");

const PI = Math.PI;

var score = 0;
var highScore = 0;
var map = new Array(50);
for(var i = 0; i < 50; ++i) {
    map[i] = new Array(50);
}
var pos = [5,25];
var dir = [1,0];
var apple = [35,25];
map[pos[0]][pos[1]] = 1;
var commandQueue = [];
var command = 0;
var playing = true;

function reset() {
    for(var x = 0; x < 50; ++x) {
        for(var y = 0; y < 50; ++y) {
            map[x][y] = 0;
        }
    }
    score = 0;
    pos = [5,25];
    map[pos[0]][pos[1]] = 1;
    commandQueue = [];
    dir = [1,0];
    command = 0;
    apple = [35,25];
    playing = true;
}

function move() {
    var x = pos[0] + dir[0];
    var y = pos[1] + dir[1];
    if(x < 0 || x > 49 || y < 0 || y > 49 || map[x][y] > 0)
        playing = document.getElementById("gameOver").hidden = false;
    else {
        if(x == apple[0] && y == apple[1]) {
            score++;
            scoreDisplay.textContent = "Score: " + score;
            if(score > highScore) {
                highScore = score;
                highScoreDisplay.textContent = "High Score: " + highScore;
            }
            apple[0] = Math.floor(Math.random()*50);
            apple[1] = Math.floor(Math.random()*50);
        }
        else {
            for(var xx = 0; xx < 50; ++xx) {
                for(var yy = 0; yy < 50; ++yy) {
                    if(map[xx][yy] > 0)
                        map[xx][yy]--;
                }
            }
        }
        pos[0] = x;
        pos[1] = y;
        map[x][y] = score + 1;
    }
}
ctx.fillStyle = "white";
function draw() {
    ctx.clearRect(0,0,600,600);
    for(var x = 0; x < 50; ++x) {
        for(var y = 0; y < 50; ++y) {
            if(map[x][y] > 0) {
                ctx.fillStyle = "rgb(" + eval(Math.sin((map[x][y] / (score+1))*PI)*127 + 127) + ", " + eval(Math.cos((map[x][y] / (score+1))*PI)*127 + 127) + ", " + eval(Math.cos((map[x][y] / (score+1))*PI + 3)*127 + 127) + ")";
                ctx.fillRect(x*12, y*12, 12, 12);
            }
            else if(x == apple[0] && y == apple[1]) {
                ctx.fillStyle = "red";
                ctx.fillRect(x*12 + 1, y*12 + 1, 10, 10);
            }
        }
    }
    if(command >= 0) {
        switch(commandQueue[command]) {
            case 'ArrowUp':
                if(dir[1] == 0) {
                    dir[1] = -1;
                    dir[0] = 0;
                }
                break;
            case 'ArrowDown':
                if(dir[1] == 0) {
                    dir[1] = 1;
                    dir[0] = 0;
                }
                break;
            case 'ArrowRight':
                if(dir[0] == 0) {
                    dir[0] = 1;
                    dir[1] = 0;
                }
                break;
            case 'ArrowLeft':
                if(dir[0] == 0) {
                    dir[0] = -1;
                    dir[1] = 0;
                }
                break;
        }
        command--;
    }
}

document.addEventListener("keydown", function(event) {
    var key = event.key;
    if(key == 'ArrowUp' || key == 'ArrowDown' || key == 'ArrowLeft' || key == 'ArrowRight') {
        commandQueue.push("");
        for(var i = commandQueue.length - 1; i > 0; --i)
            commandQueue[i] = commandQueue[i-1];
        commandQueue[0] = event.key;
        command++;
    }
    else if(key == ' ' && !playing) {
        reset();
        document.getElementById("gameOver").hidden = true;
    }
});
function update() {
    if(playing) {
        move();
    }
    draw();
}
var interval = setInterval(update, 20);
