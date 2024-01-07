

var board;
var boardWidth = 700;
var boardHeight = 700;
var context;

var birdWidth = 34; 
var birdHeight = 24;
var birdX = boardWidth/8;
var birdY = boardHeight/2;
var birdImg;

var bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}


var pipeArray = [];
var pipeWidth = 64; 
var pipeHeight = 512;
var pipeX = boardWidth;
var pipeY = 0;
var placePipesInterval = 1500;

var topPipeImg;
var bottomPipeImg;


var velocityX = -1; 
var velocityY = -3; 
var velocityYvar = velocityY 
var gravity = 0.1;

var gameOver = false;
var score = 0;
var highScore = 0; 
var locked = false;


var gameoverAudio = new Audio('gameover.mp3')
var spawnAudio = new Audio("spawn.mp3")
var waterAudio = new Audio("water.mp3")
var flapAudio = new Audio("flap.mp3")
var scoreAudio = new Audio("score.mp3")


window.onload = function() {
    
}


function gameStart (){
    
    this.toggleScreen('start-screen', false )
    this.toggleScreen('board', true)
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); 

    birdImg = new Image();
    birdImg.src = "./flapperendegevogelte.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, placePipesInterval); 
    document.addEventListener("keydown", moveBird);
    spawnAudio.play();
}

function toggleScreen(id,toggle)
{
    var element = document.getElementById(id);
    var display = ( toggle ) ? 'block' : 'none';
    element.style.display= display;
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
   
    bird.y = Math.max(bird.y + velocityY, 0); 
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
        waterAudio.play();
        locked = true; 
        setTimeout( function(){ locked = false; },1000); 
    }

    
    for (var i = 0; i < pipeArray.length; i++) {
        var pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; 
            pipe.passed = true;
            scoreAudio.play();
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
            gameoverAudio.play()
            locked = true; 
            setTimeout( function(){ locked = false; },1000); 
        }
    }


    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); 
    }

    
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText("Score " + score, 5, 45);
    context.fillText("Highscore " + highScore, 5,85);

    if(score > highScore)
    {
        highScore = score
        
    }

    if (score < 1)
    {
        context.fillText("Ga zo ver mogelijk", 150, 300);
        context.fillText("Druk op spatie om te vliegen", 150, 350);
    }

    if (score >= 5 && score <10 )
    {
        velocityYvar = -3.5;
        placePipesInterval = 7000;
        context.fillText("Stage 2", 150, 300);
        
    }

    if (score >= 10)
    {
        velocityYvar = -4.75;
        placePipesInterval = 2000;
        context.fillText("Stage 3", 150, 300);
        
    }

    if (score === 0 )
    {
        velocityYvar = -3;
        
    }

    

    if (gameOver) {
        context.fillText("GAME OVER", 150, 150);
        context.fillText("Druk op spatie", 150, 200);

        if(score === highScore)
        {
            context.fillText("New Highscore!!!", 150,250)
        }
        
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    var randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    var openingSpace = board.height/4;

    var topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    var bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space") {

        if( locked ){
            return; 
        }
        
        else {
        
        velocityY = velocityYvar;
        flapAudio.play();

        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
      }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   
           a.x + a.width > b.x &&   
           a.y < b.y + b.height &&  
           a.y + a.height > b.y;    
}