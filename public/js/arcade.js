$('body').css({'overflow':'hidden'});
$(document).bind('scroll',function () { 
    window.scrollTo(0,0); 
  });

var lives =2;
var paused = false;
var bones = 49; //score

var scoreBoard = document.getElementById("bones");
var canvas = document.getElementById("myCan"); //variable to use later cache
var ctx = canvas.getContext("2d"); //variable to store the 2D rendering context - tool to paint on the canvas

//timers
var hippoTimer;
var drawPacTimer;
var pauseHippoMoveTimer;
var startTime;
var hipStayTimer;

//variable for starting position and current position
var x = canvas.width/2 +30; //sutro
var y = canvas.height-50; 
var tigerX=100;
var tigerY= 5;
var bearX = 50;
var bearY = 10;
var hippoX;
var hippoY;
var hippoStartingPoints =[];
var hipNum;

//size of animals
var sutroWidth = 41;
var sutroHeight = 49;
var tigerWidth = 30;
var tigerHeight = 65;
var bearWidth = 56;
var bearHeight = 57;
var hippoWidth = 98;
var hippoHeight = 62;

//variables for moving Sutro
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

//staring direction/speed of enemies
var hDX = 5.8;
var bDX = 2.5;
var bDY = 0;
var tDX =1.5;
var tDY =0;

//variables for the bones
var ballColumnCount = 7;
var ballRowCount = 7;
var ballWidth = 70;
var ballHeight = 43;
var ballPaddingX = 65;
var ballPaddingY = 35;
var ballOffsetTop = 15; 
var ballOffsetleft = 10;
var balls=[]; //array to store balls
//parameters for the walls
var wallColumnCount = 4;
var wallRowCount = 7;
var wallWidth = 200;
var wallHeight = 3;
var wallPadding = 75;
var wallOffsetTop= 75;
var walls=[]; //array to store walls
//parameters for intersections
var interColumnCount = 3;
var interRowCount = 8;
var interRadius = 3;
var intersections =[];
var lastHitIntersection; //for bear
//parameters for side intersections for Tiger and bear
var sideColumnCount = 2;
var sideRowCount = 8;
var sideRadius = 3;
var sideInts =[];



//drawing sutro
function sutro(){
  ctx.drawImage(document.getElementById('sutroMaja'), 0, 0, 191, 204, x,y, sutroWidth, sutroHeight);
}

function tiger(){
  ctx.drawImage(document.getElementById('tigerSource'), 0, 0, 146,353, tigerX,tigerY, tigerWidth, tigerHeight);
}

function bear(){
  ctx.drawImage(document.getElementById('bearSource'), 5,5, 380,395, bearX, bearY, bearWidth, bearHeight);
}

function hippo(){
  ctx.drawImage(document.getElementById('hippoSource'), 0,0, 363, 268, hippoX, hippoY, hippoWidth, hippoHeight);
}

//Making Sutro Move - Event listeners for keydown and keyup on the controler
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
    else if(e.keyCode == 38) {
        upPressed = true;
    }
    else if(e.keyCode == 40) {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
    else if(e.keyCode == 38) {
        upPressed = false;
    }
    else if(e.keyCode == 40) {
        downPressed = false;
    }
}



//creating the array of bones and setting them as objects to store their x y coordinates and status
for (var c=0; c< ballColumnCount; c++){
  balls[c] =[];
  for (var r =0; r < ballRowCount; r++){
    balls[c][r]= { x:0, y:0, status:1};
  }
}

//actually looping through to create the bones
function drawBall(){
  for(var c=0; c<ballColumnCount; c++) {
    for(var r=0; r<ballRowCount; r++) {
      if (balls[c][r].status ==1){
        var ballX = (c*(ballWidth+ballPaddingX)+ballOffsetleft);
        var ballY = (r*(ballHeight+ballPaddingY)+ballOffsetTop);
        balls[c][r].x = ballX;
        balls[c][r].y = ballY;
        ctx.drawImage(document.getElementById('boneSource'),35,25,500,350,ballX, ballY, ballWidth, ballHeight);
      }
    }
  }
}

 function collisionBall(){
   for(var c=0; c<ballColumnCount; c++) {
     for(var r=0; r<ballRowCount; r++) {
         var b = balls[c][r];
         if (x+sutroWidth > b.x && x < b.x+ballWidth && y+sutroHeight > b.y && y < b.y+ballHeight && b.status) { //if the ball is inside the wall; added b.status so it will only update the score if the status was 1
            b.status=0;
            bones --; //updating the bones variable
            bonesRemaining(); //updating the board
            win();
         }
     }
   }
}

//looping through rows and columns to create new walls

for (var c=0; c<wallColumnCount; c++){
  walls[c] =[];
  for (var r =0; r <wallRowCount; r++){
    walls[c][r]= { x:0, y:0};
  }
}


function drawWall(){
  for(var c=0; c<wallColumnCount; c++) {
    for(var r=0; r<wallRowCount; r++) {
        var wallX = (c*(wallWidth+wallPadding));
        var wallY = (r*(wallHeight+wallPadding)+wallOffsetTop);
        walls[c][r].x = wallX;
        walls[c][r].y = wallY;
        ctx.beginPath();
        ctx.rect(wallX, wallY, wallWidth, wallHeight);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }
  }
}

//checking if sutro hit the wall
function collisionWall(){
  for(var c=0; c<wallColumnCount; c++) {
    for(var r=0; r<wallRowCount; r++) {
        var w = walls[c][r];
        if (x+sutroWidth > w.x && x < w.x+wallWidth && y+sutroHeight > w.y && y < w.y+wallHeight) { //added sutro's width and height accordingly so he cannot enter the wall
           return true; 
        }
    }
  }
}


//looping through to create the starting points for the hippo off of the walls positions; needs to be after drawWall function
function setHippoStartingPoints(){
  for (var i = 0; i < walls[3].length; i++){
    var yHipStart = walls[3][i].y - (wallPadding);
    var xHipStart = canvas.width - hippoWidth + 75;
    hippoStartingPoints[i] = {x: xHipStart, y: yHipStart};
  }
}


function hippoGo(){
  clearInterval(hippoTimer);
  setHippoStartingPoints(); //setting the starting points
  hipNum = Math.ceil((Math.random()*7));
  hippoX = hippoStartingPoints[hipNum].x; //placing hippo at the start
  hippoY = hippoStartingPoints[hipNum].y;
  hipStayTimer = setTimeout(hippoStay, 600);  
}

function hippoStay(){
  hippoTimer = setInterval(hippoMove, 10); //moving the hippo 
}
//function to move the hippo
function hippoMove(){
  hippoX -= hDX;
}

//looping through to create intersections for the bear and tiger
for (var c=0; c<interColumnCount; c++){
  intersections[c] =[];
  for (var r =0; r <interRowCount; r++){
    intersections[c][r]= { x:0, y:0};
  }
}

function drawInter(){
  for(var c=0; c<interColumnCount; c++) {
    for(var r=0; r<interRowCount; r++) {
        var interX = ((c+1)* wallWidth + (wallPadding/2) + (wallPadding * c));
        var interY = (r*(wallHeight+wallPadding)+(wallOffsetTop/2));
        intersections[c][r].x = interX;
        intersections[c][r].y = interY;
        ctx.beginPath();
        ctx.arc(interX, interY, interRadius,0, Math.PI*2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }
  }
}

//looping through for sides for tiger and bear
for (var c=0; c<sideColumnCount; c++){
  sideInts[c] =[];
  for (var r =0; r <sideRowCount; r++){
    sideInts[c][r]= { x:0, y:0};
  }
}

function drawSideInts (){
  for(var c=0; c<sideColumnCount; c++) {
    for(var r=0; r<sideRowCount; r++) {
        var sideX = (40 + (c* (canvas.width - 70)));
        var sideY = (r*(wallHeight+wallPadding)+(wallOffsetTop/2));
        sideInts[c][r].x = sideX;
        sideInts[c][r].y = sideY;
        ctx.beginPath();
        ctx.arc(sideX, sideY, sideRadius,0, Math.PI*2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }
  }
}

function bearCollisionInter(){
  for(var c=0; c<interColumnCount; c++) {
    for(var r=0; r< interRowCount; r++) {
        var iB = intersections[c][r];
        if (bearX+ (bearWidth * .6) > iB.x && bearX + (bearWidth * .4) < iB.x+interRadius && bearY+(bearHeight * .6) > iB.y && bearY+(bearHeight * .4) < iB.y+interRadius && lastHitIntersection !== iB) {
            lastHitIntersection = intersections[c][r]; //storing so he wont change direction on the same intersection over and over
            bearNextDirection();
        }
    }
  }
}

function bearNextDirection(){
  var num = Math.random();//random number choosing the direction
  if (lastHitIntersection === intersections[0][0] || lastHitIntersection == intersections[1][0] || lastHitIntersection == intersections[2][0]){
    bDX = 0; //if he hits any of the top intersections, go down
    bDY = 2.7;
  } else if (lastHitIntersection === intersections[0][7] || lastHitIntersection == intersections[1][7] || lastHitIntersection == intersections[2][7]){
    bDX =0; //if he hits any of the bottom intersections, go up
    bDY = -2.6;
  }else {
    if (num < .25){
      bDX = 3.7;
      bDY = 0; 
    } else if (num < .5){
      bDX = -4.0;
      bDY = 0; 
    } else if (num < .75){
      bDX = 0;
      bDY = 3.9; 
    } else {
      bDX = 0;
      bDY = -3.8; 
    }
  }
}

function bearCollisionSide(){
  for(var c=0; c<sideColumnCount; c++) {
    for(var r=0; r< sideRowCount; r++) {
        var i = sideInts[c][r];
        if (bearX+bearWidth > i.x && bearX < i.x+interRadius && bearY+bearHeight > i.y && bearY < i.y+interRadius) {
            bearTurnAround();
        }
    }
  }
}

function bearTurnAround(){
  bDX = -bDX;
};

function bearMove(){
  bearX += bDX;
  bearY += bDY;
}

//--------------

function tigerCollisionInter(){
  for(var c=0; c<interColumnCount; c++) {
    for(var r=0; r< interRowCount; r++) {
        var i = intersections[c][r];
        if (tigerX+ (tigerWidth * .60) > i.x && tigerX + (tigerWidth * .40) < i.x+interRadius && tigerY+ (tigerHeight *.60) > i.y && tigerY +tigerHeight * .40 < i.y+interRadius) {
            nextDirection();
        }
    }
  }
}


function tigerCollisionSide(){
  for(var c=0; c<sideColumnCount; c++) {
    for(var r=0; r< sideRowCount; r++) {
        var i = sideInts[c][r];
        if (tigerX+tigerWidth > i.x && tigerX < i.x+interRadius && tigerY+tigerHeight > i.y && tigerY < i.y+interRadius) {
            turnAround();
        }
    }
  }
}

function turnAround(){
  tDX = -tDX;
};

function nextDirection(){
  if (Math.abs(tigerX -x) > Math.abs(tigerY - y)){
    if (tigerX > x){
      tDX = -1.4;
      tDY = 0;
    } else if (tigerX < x){
     tDX = 1.3;
     tDY = 0;
    }
  }
  else {
    if (tigerY > y){
      tDY = -1.5;
      tDX = 0;
    } else if (tigerY < y){
      tDY = 1.2;
      tDX = 0;
    }
  }
}


function tigerMove(){
  tigerX += tDX;
  tigerY += tDY;
}

function bonesRemaining(){
  scoreBoard.innerText = ("Bones Left: " + parseInt(bones));
}

function livesRemaining(){
  $('#lives').text("Lives Remaining: " + parseInt(lives));
}

function timer() {
    var time = Date.now()-startTime;
    document.getElementById("timer").innerText = (time/1000).toFixed(0);
}



function sutroEaten(){
  if ((x+sutroWidth > tigerX && x < tigerX+tigerWidth && y+sutroHeight > tigerY && y < tigerY+tigerHeight)||(x+sutroWidth > bearX && x < bearX+bearWidth && y+sutroHeight > bearY && y < bearY+bearHeight) || (x+sutroWidth > hippoX && x < hippoX+hippoWidth && y+sutroHeight > hippoY && y < hippoY+hippoHeight)){
    lives--;
    livesRemaining();
      if(lives <0){
        $('canvas').css('display', 'none');
        $('#timer').css('display', 'none');
        $('#lost').css('display', 'inline-block');
        $('#pause').css('display', 'none');
        clearInterval(drawPacTimer);
        clearInterval(pauseHippoMoveTimer);
        clearInterval(hippoTimer);
        $('#lives').text('Noooooooooo');
      } else {
        hippoX = -100;
        hippoY = -100;
        paused = true;
        x = canvas.width/2 +30;
        y = canvas.height-50;
        tigerX = 140;
        tigerY =  10;
        clearInterval(drawPacTimer);
        clearInterval(pauseHippoMoveTimer);
        clearInterval(hippoTimer);
        $('#pause').text('Continue - Use Next Lift');
        tDX= 1;
        tDY= 0;
        bearX= 50;
        bearY= 10;
        bDX= 2;
        bDY= 0;
      }
  }
}

function win(){
  if (bones ===0){
    clearInterval(drawPacTimer);
    clearInterval(pauseHippoMoveTimer);
    clearInterval(hippoTimer);
    $('canvas').css('display', 'none');
    $('#timer').css('display', 'none');
    $('#pause').css('display', 'none');
    $('#win').css('display', 'inline-block');
  }
}


function dontGoInSides(){
  if(x > canvas.width- sutroWidth){
    x-=10; 
  } else if(x < 0){
    x+=10;
  } else if (y < 0){
    y+= 10;
  } else if(y > canvas.height) {
    y-=10;
  }
}




//function inside setInterval for the game; where most functions are called
function drawPac(){
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clearing the whole canvas for each interval
  sutro();
  drawWall();
  setHippoStartingPoints();
  drawBall();
  drawInter();
  drawSideInts();
  collisionBall();
  sutro();
  tiger();
  bear();
  hippo();
  timer();
  tigerCollisionInter();
  tigerCollisionSide();
  tigerMove();
  bearCollisionInter();
  bearCollisionSide();
  bearMove();
  sutroEaten();
  dontGoInSides();
  if(rightPressed && (x < canvas.width- sutroWidth)){
    if (collisionWall()){ //running code to see if the ball is inside the wall 
      x-=0;
    } else {
      x += 2.2;
    }
  } else if(leftPressed && (x > 0)) {
    if (collisionWall()){
      x+=0;
    } else{
      x -= 2.2;      
    }
  } else if (upPressed && (y > 0)){
    if (collisionWall()){
      y+=13;
    } else{
      y -= 2.2;
    }
  } else if(downPressed && (y < canvas.height- sutroHeight)) {
    if (collisionWall()){
      y-=13;
    } else {
    y += 2.2;
  }
  }
}


$('#pause').on('click', pauseGame);

function pauseGame(){
  if (!paused){
    clearInterval(drawPacTimer);
    clearInterval(pauseHippoMoveTimer);
    clearInterval(hippoTimer);
    $('#pause').text('Resume');
    hippoX = -100;
    hippoY = -100;
    paused = true;
  } else if (paused){
    drawPacTimer = setInterval(drawPac, 10);
    pauseHippoMoveTimer = setInterval(hippoGo, 4000);
     $('#pause').text('Pause');
    paused = false;
  }
}


//button to start the game
$("#start").on('click',function (){
   $("#slideUpBox").slideUp(2000,function(){
    $('canvas').css('display',"inline");
    $('p').css('display',"inline-block");
    $('#pause').css('display','inline-block');
    drawPacTimer = setInterval(drawPac, 10);
    pauseHippoMoveTimer = setInterval(hippoGo, 3500);
    startTime = Date.now();
   });
});





