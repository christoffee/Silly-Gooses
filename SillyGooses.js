window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function animloop(){
  requestAnimFrame(animloop);
  render();
})();

function render() {
    if(context){
      context.clearRect(0,0,canvasWidth,canvasHeight);
      drawBackground();
      drawPond();
      drawSillyGooses();
      rescuedGeese();
      drawFox();
      drawDuck();
      gameText();
      if(menu){
        showMenu();
      }
    }
}

var canvas, context,toggle, togglePul = true,grassSize,
  spaceDown = false,
  menu = true,
  pulsate = 0,
  gooseLives = 3,
  gooseMove = 0,
  goosePosition = [],
  duckOut = 70,
  mousePosX = 100,
  mousePosY = 100,
  rescues = 0,
  gooseRescues = 0,
  gooseRescuesMove = 0,
  laserBeam = false,
  foxMove = 1,
  foxPosition = [],
  breadCrumbsArr = [],
  lastPosArr = [100,100],
  grassArr = [],
  gooseArr = []
  gooseRange = [[50,350,100,550],[50,950,100,150],[630,950,100,550],[50,950,450,550]];

function init() {
   canvasWidth = 1000; 
   canvasHeight = 600;

   createBackgound();
   createSillyGooses();

   canvas = document.createElement( 'canvas' );
   canvas.width = canvasWidth;
   canvas.height = canvasHeight;

   
    window.addEventListener( "keydown", doKeyDown, true);
    window.addEventListener( "keyup", doKeyUp, true);

   canvasXCenter = canvasWidth/ 2;
   canvasyCenter = canvasHeight / 2;

   context = canvas.getContext( '2d' );
   context.fillStyle = "rgb(117,153,90)";
   context.rect(0, 0, canvasWidth, canvasHeight);
   context.fill();

   document.body.appendChild( canvas );
}

function createBackgound () {
   for (i = 0; i <= 2000; i++) {
      var grass = [];
      // Get random positions for grasss.
      var x = Math.floor(Math.random() * (canvasWidth - 1))
      var y = Math.floor(Math.random() * (canvasHeight - 1))
      toggle = !toggle;

      grassSize = toggle ? 3 : 5;
      grassColour = toggle ? 'rgb(0,104,55)' :  'rgb(100,204,55)';

      grass.push(x,y,grassSize,grassColour);

      grassArr.push(grass);
   }
}

function createSillyGooses () {

  for (var arr in gooseRange) {
      for (var i = 0; i < 3; i++) {
         var gooses = [];
        // Get random positions for grasss.
        //var x = Math.floor(Math.random() * (canvasWidth - canvasWidth / 10));
        var x = getRandomInt(gooseRange[arr][0],gooseRange[arr][1]);
        var y = getRandomInt(gooseRange[arr][2],gooseRange[arr][3]);
        var r = getRandomInt(0,360);

        gooses.push(x,y,r,false);
        gooseArr.push(gooses);
      }
   }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

  var cx = (Math.sin( foxMove )) + canvasWidth / 2,
    cy = (Math.cos( foxMove ))+ canvasHeight / 2,
    x = 150,
    y = 0,
    r = -(foxMove),
    w = 20,
      h = 30;

  context.save();

  context.fillStyle = "rgb(117,0,0)";
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
    foxMove+=rescues/112;
    gooseRescuesMove+=0.01;
  }
  
}

function doKeyDown (e) {
  switch(e.keyCode){
  //Left Arrow
  case 37:
    if(!spaceDown && duckOut <= 80){
      gooseMove -= 0.08;
    }
    break;
  //right arrow
  case 39:
    if(!spaceDown && duckOut <= 80){
      gooseMove += 0.08;
    }
    break;
  //space bar
  case 32:
    if(menu){
      menu = false;
    }
    if(!menu && duckOut <= 80){
      spaceDown = true;
      rescues++;
      gooseRescues++;
    }
    break;
  case 80:
    menu = true;
    break;
  case 76:
    laserBeam = !laserBeam;
    break
  }
}

function doKeyUp (e) {
    switch(e.keyCode)
    {
    //space bar
    case 32:
    spaceDown = false;
      break;
    }
}

function drawDuck () {
  if(!spaceDown && duckOut > 70){
    duckOut-= 5;
  }

  if(spaceDown && duckOut < 500){
    duckOut+= 5;
  }

  var w = 20,
    h = 40,
    cx = (Math.sin( gooseMove) ) + canvasWidth / 2,
    cy = (Math.cos( gooseMove) ) + canvasHeight / 2,
    x = duckOut,
    y = -20,
    r = gooseMove;

    goosePosition = [x,cy];
  context.save();

  context.fillStyle = "rgb(253,253,253)";
  context.translate(cx, cy);
  context.rotate(r); 
  context.fillRect(x, y, w, h);

  
  //butt
  context.fillStyle = "rgb(240,240,240)";
  context.fillRect(x-5, y+5, w+10, h-10);
  //neck
  context.fillStyle = "rgb(253,253,253)";
  context.fillRect(x-5, y+15, w+30, h-30);

  context.fillStyle = "rgb(240,240,240)";
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
  console.log(goosePosition);
}


function drawPond (argument) {
  context.save();
  context.beginPath();
  context.arc(canvasWidth/2, canvasHeight/2, 113, 0, 2 * Math.PI, false);
  context.fillStyle = 'rgba(73,56,49,0.3)';
  context.fill();

  context.beginPath();
  context.arc(canvasWidth/2, canvasHeight/2, 110, 0, 2 * Math.PI, false);
  context.fillStyle = 'rgba(73,56,49,0.5)';
  context.fill();

  context.beginPath();
  context.arc(canvasWidth/2, canvasHeight/2, 80 + pulsate, 0, 2 * Math.PI, false);
  context.fillStyle = 'rgba(0,126,128,0.5)';
  context.fill();
  
  context.beginPath();
  context.arc(canvasWidth/2, canvasHeight/2, 90 + pulsate, 0, 2 * Math.PI, false);
  context.fillStyle = 'rgba(0,126,128,0.5)';
  context.fill();

  context.beginPath();
  context.arc(canvasWidth/2, canvasHeight/2, 104 - pulsate, 0, 2 * Math.PI, false);
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

function drawSillyGooses (argument) {

   for (var arr in gooseArr) {
      for (var i = 0; i < gooseArr[arr].length; i++) {
        var cx = gooseArr[arr][0],
          cy = gooseArr[arr][1],
          r = gooseArr[arr][2],
          x = 0,
          y = 0,
          w = 20,
          h = 15;

          context.save();
          context.translate(cx, cy);
          context.rotate(r-(pulsate*2) * Math.PI/180);
          context.fillStyle = "rgb(252,238,33)";
          context.beginPath();
          context.fillRect(x,y, w, h);
          context.fillRect(x+3,y-5, w-6, h+10);
          context.fillStyle = "rgb(222,208,33)";
          context.fillRect(x+6,y-12, w-12, h);

          context.fillStyle = "rgb(252,128,33)";
          context.fillRect(x+8,y-16, w-16, h-6);

          context.closePath();
          context.fill();
          context.restore();


      }
   }
}
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return [evt.clientX - rect.left, evt.clientY - rect.top];
  
}

function showMenu () {
  context.save();
  context.fillStyle = "rgba(73,56,49,0.5)";
  context.beginPath();
  context.rect(200,100, 600, 400);
  context.closePath();
  context.fill();

  context.fillStyle = "rgb(253,203,0)";
  context.textAlign = 'center';
  context.font="40px Calibri";
  context.fillText("How to play",canvasWidth/2,150);
  context.fillStyle = "rgb(239,218,171)";
  context.font="20px Calibri";
  context.fillText("The baby geese have left the safety of the pond to go and explore",canvasWidth/2,180);
  context.fillText("and have failed to realise the hungry fox looking for lunch!",canvasWidth/2,210);
  context.fillText("...Silly gooses!",canvasWidth/2,240);
  context.fillText("Help mother goose get her baby geese back to the safety of the pond.",canvasWidth/2,270);
  context.fillText("Use the left and right arrow keys to navigate mother goose.",canvasWidth/2,330);
  context.fillText("Then use the SPACEBAR to launch a rescue.",canvasWidth/2,360);
  context.fillText("Press the SPACEBAR to start and P for pause.",canvasWidth/2,390);
  context.fillText("...and L for laser beam vision... for acuracy.",canvasWidth/2,420);

  context.fillStyle = "rgb(253,203,0)";
  context.font="15px Calibri";
  context.fillText("Note: Yes I know its 'geese' and not 'gooses'. I just wanted a 'Silly Goose' game.",canvasWidth/2,450);

  context.restore();
}

function rescuedGeese () {
  

    for (var i = 0; i < rescues; i++) {
      var cx = (Math.sin( gooseRescuesMove + i )) + canvasWidth / 2,
        cy = (Math.cos( gooseRescuesMove + i ))+ canvasHeight / 2,
        x = 45,
        y = i*3,
        r = -(gooseRescuesMove + i),
        w = 20,
        h = 15;

      context.save();
      context.translate(cx, cy);
      context.rotate(r);
      context.fillStyle = "rgb(252,238,33)";
      context.beginPath();
      context.fillRect(x,y, w, h);
      context.fillRect(x+3,y-5, w-6, h+10);
      context.fillStyle = "rgb(222,208,33)";
      context.fillRect(x+6,y-12, w-12, h);
      context.fillStyle = "rgb(252,128,33)";
      context.fillRect(x+8,y-16, w-16, h-6);
      context.closePath();
      context.fill();
      context.restore();
    };
    
}

function checkGooseHit () {
  // body...
}

function gameText () {
  context.save();
  context.fillStyle = "rgba(73,56,49,0.5)";
  context.beginPath();
  context.rect(0, 0, 1000, 70);
  context.rect(0, 50, 10, 600);
  context.rect(990, 50, 10, 600);
  context.rect(0, 590, 1000, 10);

  context.rect(860, 550, 140, 50);
  
  context.closePath();
  context.fill();
  context.fillStyle = "rgb(253,203,0)";

  context.font="40px Calibri";
  context.fillText("Silly Gooses",20,50);

  context.font="20px Calibri";
  context.fillStyle = "rgb(239,218,171)";
  context.fillText("Rescues Launch: " + rescues ,250,45);
  context.fillText("Success Rate: " + gooseLives ,650,45);
  context.fillStyle = "rgb(239,218,0)";
  context.fillText("Gooses Rescued: " + rescues ,450,45);
  context.fillText("Lives Left: " + gooseLives ,850,45);

  context.font="15px Calibri";
  context.fillStyle = "rgb(250,250,250)";
  context.fillText("christoffee.com",875,580);


  context.restore();
}

      
