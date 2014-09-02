
/*global window */
window.requestAnimFrame = (function() {
    "use strict";
    return window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function(callback) { window.setTimeout(callback, 1000 / 60); };
}());

var canvas, context, toggle, canvasWidth, canvasHeight, canvasXCenter, canvasYCenter,
    togglePul = true,
    spaceDown = false,
    gameover = false,
    menu = true,
    pulsate = 0,
    gooseLives = 3,
    gooseMove = 0,
    goosePosition = [],
    SillyGooseMaxPosition = [450, 450, 450, 350, 350, 270, 270, 270, 270, 270, 270, 270, 450, 450, 450, 450, 450, 450, 270, 270, 210, 210, 210, 210, 210, 210, 210, 350, 450, 450],
    duckOut = 70,
    rescues = 0,
    gooseRescues = 0,
    gooseRescuesMove = 0,
    successRate = 0,
    laserBeam = false,
    foxMove = 0,
    foxPosition = [],
    breadCrumbsArr = [],
    lastPosArr = [100, 100],
    grassArr = [],
    gooseArr = [],
    segements = [],
    motherGHasBaby = false,
    takeaway = -30,
    gooseDied = false,
    menuAlpha = 1
    score= 0;

function doKeyDown(e) {
    switch (e.keyCode) {
    //Left Arrow
    case 37:
        if (!spaceDown && duckOut <= 80) {
            gooseMove -= 1;
            if (gooseMove === -1) {
                gooseMove = 29;
            }
        }
        break;
    //right arrow
    case 39:
        if (!spaceDown && duckOut <= 80) {
            gooseMove += 1;
            if (gooseMove === 30) {
                gooseMove = 0;
            }
        }
        break;
    //space bar
    case 32:
        if (!menu && duckOut <= 80) {
            gooseRescues += 1;
            spaceDown = true;
        }
        break;
    // P
    case 80:
        menu = !menu;
        break;
    // L
    case 76:
        laserBeam = !laserBeam;
        break;
    default:
        break;
    }
}

function doKeyUp(e) {
    switch (e.keyCode) {
        //space bar
    case 32:
        spaceDown = false;
        break;
    }
}

function createBackgound() {
    var i, grass, grassColour, grassSize, x, y;
    for (i = 0; i <= 2000; i += 1) {
        grass = [];
        x = Math.floor(Math.random() * (canvasWidth - 1));
        y = Math.floor(Math.random() * (canvasHeight - 1));

        toggle = !toggle;
        grassSize = toggle ? 3 : 5;
        grassColour = toggle ? 'rgb(0,104,55)' : 'rgb(100,204,55)';

        grass.push(x, y, grassSize, grassColour);
        grassArr.push(grass);
    }
}

function getRandomInt(min, max) {
        do {
            var exists = false,
                number = Math.floor(Math.random() * (max - min + 1)) + min;
            if(number === 0){
              number += 1;
            }

            if (gooseArr[0]) {
              for (var i = 0; i < gooseArr.length; i++) {
                  if(number == gooseArr[i][1]){
                      exists = true;
                      break;
                  }
              }
            }            
        }while(exists);
    return number;
}

function getRandomGooseInt(min, max) {

    var range = max - min + 1;
      range = range / 10,
      number = Math.floor(Math.random() * (range));
    
    return (number * 10) + min;
}

function createSillyGooses() {
    var i, gooses, randomSeg, x;
    for (i = 0; i < 6; i += 1) {
        gooses = [];
        randomSeg = getRandomInt(0,29);
        x = getRandomGooseInt(200,SillyGooseMaxPosition[randomSeg]);

        gooses.push(x,randomSeg);
        gooseArr.push(gooses);
    }
}

function getSegements () {
    for (var i = 0; i <= 29; i++) {
        var radians = (i / 15 * Math.PI),
            segment = [];

        segment.push(radians, false);
        segements.push(segment); 
    };
}

function init() {
    /*global document: false */
    canvasWidth = 1000;
    canvasHeight = 600;
    canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context = canvas.getContext('2d');
    context.fillStyle = "rgb(117,153,90)";
    context.rect(0, 0, canvasWidth, canvasHeight);
    context.fill();

    document.body.appendChild(canvas);

    window.addEventListener("keydown", doKeyDown, true);
    window.addEventListener("keyup", doKeyUp, true);

    canvasXCenter = canvasWidth / 2;
    canvasYCenter = canvasHeight / 2;

    createBackgound();
    createSillyGooses();
    getSegements();
}



function drawSegment () {
    var x = 0,
        y = 0,
        w = 200,
        h = 1;

    for (var arr in segements) {
        for (var i = 0; i < segements[arr].length; i++) {
            var r = segements[arr][0];

            context.save();
            context.translate(canvasXCenter, canvasYCenter);
            context.rotate(r);
            context.fillStyle = "rgb(252,238,33)";
            context.beginPath();
            context.fillRect(x,y, w, h);
            context.closePath();
            context.fill();
            context.restore();
        }
    }
}

function drawSillyGooses () {
    var y = -5,
        w = 20,
        h = 15;

    for (var i = 0; i < gooseArr.length; i++) {
        var r = segements[ gooseArr[i][1] ][0],
            x = gooseArr[i][0];

        context.save();
        context.translate(canvasXCenter, canvasYCenter);
        context.rotate(r);
        context.fillStyle = "rgba(252,238,33,0.8)";
        context.beginPath();
        context.fillRect(x,y, w, h);
        context.fillRect(x+3,y-5, w-6, h+10);
        context.fillRect(x+6,y-12, w-12, h);
        context.fillStyle = "rgb(252,128,33)";
        context.fillRect(x+8,y-16, w-16, h-6);
        context.closePath();
        context.fill();
        context.restore();
    }
}




function drawBackground() {
   context.fillStyle = "rgb(117,153,90)";
   context.rect(0, 0, canvasWidth, canvasHeight);
   context.fill();
   for (var arr in grassArr) {
      for (var i = 0; i < grassArr[arr].length; i++) {
         // Draw an individual star.
         context.fillStyle = grassArr[arr][3];
         context.beginPath();
         context.rect(grassArr[arr][0], grassArr[arr][1], grassArr[arr][2]/8, grassArr[arr][2]);
         context.closePath();
         context.fill();
      }
   }
}


function drawFox () {

//TODO:hit detection 
  var cx = (Math.sin( foxMove )) + canvasXCenter,
    cy = (Math.cos( foxMove ))+ canvasYCenter,
    x = 150,
    y = 0,
    r = -(foxMove),
    w = 20,
      h = 30;

  context.save();

  context.fillStyle = "rgba(117,0,0,0.8)";
  context.beginPath();
  context.translate(cx,cy);
  context.rotate(r);
  context.fillRect(x, y, w, h);
  context.fillRect(x-1.5, y+20+(pulsate/2), w+3, h-20);
  context.fillRect(x-1.5, y-5-(pulsate/2), w+3, h-20);
  context.fillRect(x+5, y-10, w-10, h-25);
  context.fillRect(x+6, y-14, w-12, h-25);
  context.fillRect(x+7, y+10-pulsate, w-14, h);
  context.fillStyle = "rgb(250,250,250)";
  context.fillRect(x+6, y+40-pulsate, w-12, h-20);
  context.fillStyle = "rgb(2,2,2)";
  context.fillRect(x+7.5, y-18, w-15, h-26);

  context.closePath();
  context.restore();

  
  if(!menu){
    foxMove+=(score+1)/70;
    gooseRescuesMove+=0.01;
  }
  
}

function drawDuck () {
  if(!spaceDown && duckOut <= 80){
      if(motherGHasBaby){
        rescues++;
        score++;
        motherGHasBaby= false;
      }

    }
  if(gooseDied && duckOut <= 70){
      gooseDied = false;
    }

  if(!spaceDown && duckOut > 70){
    duckOut-= 10;
  }

  if(motherGHasBaby || gooseDied){
    spaceDown=false;
  }

  if(spaceDown && duckOut < 500){
    
    duckOut+= 10;
  }

  var w = 20,
    h = 40,
    cx = canvasXCenter,
    cy = canvasYCenter,
    x = duckOut,
    y = -19,
    r = (gooseMove / 15 * Math.PI);

    goosePosition = [gooseMove,x];
  context.save();

  if(gooseDied){
    context.fillStyle = "rgba(253,30,30,0.8)";
  }else{
    context.fillStyle = "rgba(253,253,253,0.8)";
  }
  context.translate(cx, cy);
  context.rotate(r); 
  context.fillRect(x, y, w, h);

  
  //butt
  //context.fillStyle = "rgb(240,240,240)";
  context.fillRect(x-5, y+5, w+10, h-10);
  //neck
  context.fillRect(x-5, y+15, w+30, h-30);
  context.fillRect(x-5, y+5, w-5, h-10);
  //wings
  if(spaceDown){
    context.fillStyle = "rgb(253,253,253)";
    context.fillRect(x, y+pulsate*1, w-3, h);
    context.fillRect(x, y-pulsate*1, w-3, h);
    context.fillRect(x-pulsate*2, y+10, w-5, h-20);
  }

  if(laserBeam){
    context.fillStyle = "rgb(255,0,0)";
    context.fillRect(x+40, y+16, w+430, h-39);
    context.fillRect(x+40, y+22, w+430, h-39);
  }
  //beak
  context.fillStyle = "rgb(253,203,0)";
  context.fillRect(x+45, y+17, w-10, h-34);

  context.restore();
  checkGooseHit();
}


function drawPond () {
  context.save();
  context.beginPath();
  context.arc(canvasXCenter, canvasYCenter, 113, 0, 2 * Math.PI, false);
  context.fillStyle = 'rgba(73,56,49,0.3)';
  context.fill();

  context.beginPath();
  context.arc(canvasXCenter, canvasYCenter, 110, 0, 2 * Math.PI, false);
  context.fillStyle = 'rgba(73,56,49,0.5)';
  context.fill();

  context.beginPath();
  context.arc(canvasXCenter, canvasYCenter, 80 + pulsate, 0, 2 * Math.PI, false);
  context.fillStyle = 'rgba(0,126,128,0.5)';
  context.fill();
  
  context.beginPath();
  context.arc(canvasXCenter, canvasYCenter, 90 + pulsate, 0, 2 * Math.PI, false);
  context.fillStyle = 'rgba(0,126,128,0.5)';
  context.fill();

  context.beginPath();
  context.arc(canvasXCenter, canvasYCenter, 104 - pulsate, 0, 2 * Math.PI, false);
  context.fillStyle = 'rgba(0,126,128,0.5)';
  context.fill();
context.restore();
  
  if (togglePul) {
    pulsate += 0.2
  }else{
    pulsate -= 0.2;
  }
  

  if(pulsate >= 7){
    togglePul = false;
  }

  if(pulsate <= 0){
    togglePul = true;
  }
}


function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return [evt.clientX - rect.left, evt.clientY - rect.top];
  
}

function showMenu () {
  context.save();
  
  context.beginPath();
  
  context.fillStyle = "rgba(73,56,49,0.8)";
  context.fillRect(200,100, 600, 400);
  context.fillStyle = "rgba(73,56,49,0.5)";
  context.fillRect(196,96, 4, 408);
  context.fillRect(800,96, 4, 408);
  context.fillRect(200,96, 600, 4);
  context.fillRect(200,500, 600, 4);
  context.closePath();
  context.fill();

  context.restore();
}

function showHowToPlay () {
  showMenu(false);

  context.save();

  context.fillStyle = "rgb(253,203,0)";
  context.textAlign = 'center';
  context.font="40px Calibri";
  context.fillText("How to play",canvasXCenter,150);
  context.fillStyle = "rgb(239,218,171)";
  context.font="20px Calibri";
  context.fillText("The baby gooses have left the safety of the pond to go and explore",canvasXCenter,180);
  context.fillText("and have failed to realise the hungry fox looking for lunch!",canvasXCenter,210);
  context.fillText("...Silly gooses!",canvasXCenter,240);
  context.fillText("Help mother goose get her baby gooses back to the safety of the pond.",canvasXCenter,270);
  context.fillText("Use the left and right arrow keys to navigate mother goose.",canvasXCenter,330);
  context.fillText("Then HOLD the SPACEBAR to launch a rescue and P for pause.",canvasXCenter,360);
  context.fillStyle = "rgb(239,70,70)";
  context.fillText("Press P to start!",canvasXCenter,420);

  context.restore();
}

function gameOver () {
  showMenu();

  context.save();

  context.fillStyle = "rgb(253,203,0)";
  context.textAlign = 'center';
  context.font="40px Calibri";
  context.fillText("Game Over",canvasXCenter,150);
  context.fillStyle = "rgb(239,218,171)";
  context.font="20px Calibri";
  if(score === 0){
    context.fillText("Oh No! All the baby gooses are now the foxes lunch!",canvasXCenter,210);
  }else{
    context.fillText("Well done you have saved " + score + " silly gooses.",canvasXCenter,210);
  }

  context.restore();
}

function rescuedGeese () {
  

    for (var i = 0; i < rescues; i++) {
      var cx = (Math.sin( gooseRescuesMove + i )) + canvasXCenter,
        cy = (Math.cos( gooseRescuesMove + i ))+ canvasHeight / 2,
        x = 45,
        y = i*3,
        r = -(gooseRescuesMove + i),
        w = 20,
        h = 15;

      context.save();
      context.translate(cx, cy);
      context.rotate(r);
      context.fillStyle = "rgba(252,238,33,0.8)";
      context.beginPath();
      context.fillRect(x,y, w, h);
      context.fillRect(x+3,y-5, w-6, h+10);
      context.fillRect(x+6,y-12, w-12, h);
      context.fillStyle = "rgb(252,128,33)";
      context.fillRect(x+8,y-16, w-16, h-6);
      context.closePath();
      context.fill();
      context.restore();
    };
    
}

function checkGooseHit () {
  if(goosePosition[0]){
  //check to see if has baby geese
    for (var i = 0; i < gooseArr.length; i++) {
      if(goosePosition[0] == gooseArr[i][1]){
        if (goosePosition[1] == gooseArr[i][0]) {
          gooseArr.splice(i,1);
          motherGHasBaby = true;
        }
        break;
      }
    }
  //check if fox has lunch
  var csd = 29 -  ( Math.floor((foxMove / Math.PI)* 15) % 30 );
  //console.log('duck',goosePosition[1]);
    if(goosePosition[0] <= csd + 2 &&  goosePosition[0] >= csd - 1){
        if(goosePosition[1] >= 125 && goosePosition[1] <= 175 && !gooseDied){
          gooseDied = true;
          gooseLives--;
        }
          
    }
  }
  
}

function gameText () {
  successRate = Math.ceil((rescues/gooseRescues) *100) || 0;

  context.save();
  
  context.beginPath();
  context.fillStyle = "rgba(73,56,49,0.8)";
  context.fillRect(0, 0, 1000, 70);
  context.fillRect(0, 70, 10, 520);
  context.fillRect(990, 70, 10, 520);
  context.fillRect(0, 590, 1000, 10);

  context.fillStyle = "rgba(73,56,49,0.5)";
  context.fillRect(10, 70, 980, 4);
  context.fillRect(10, 74, 4, 516);
  context.fillRect(986, 74, 4, 516);
  context.fillRect(14, 586, 972, 4);
  context.fillRect(860, 550, 126, 36);
  
  context.font="15px Calibri";
  context.fillStyle = "rgb(250,250,250)";
  context.fillText("christoffee.com",880,575);
  
  context.closePath();
  context.fill();
  context.fillStyle = "rgb(253,203,0)";

  context.font="40px Calibri";
  context.fillText("Silly Gooses",20,50);

  context.font="20px Calibri";
  context.fillStyle = "rgb(239,218,171)";
  context.fillText("Rescues Launch: " + gooseRescues ,250,45);
  context.fillText("Success Rate: " + successRate + "%",650,45);
  context.fillStyle = "rgb(239,218,0)";
  context.fillText("Gooses Rescued: " + score ,450,45);
  context.fillText("Lives Left: " + gooseLives ,850,45);

  context.restore();
}

function render() {
    if (context) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground();
        drawPond();
        drawSillyGooses();
        rescuedGeese();
        drawFox();
        drawDuck();
        gameText();
        if(menu) {
            showHowToPlay();
        }
        if(gooseLives === 0){
          gameover = true;
        }
        if(gameover && !motherGHasBaby) {
          gameOver();
        }
        if(rescues === 6 && !motherGHasBaby){
          rescues = 0;
          createSillyGooses();
        }
        //drawSegment();
    }
}

(function animloop() {
  requestAnimFrame(animloop);
    render();
}());      
