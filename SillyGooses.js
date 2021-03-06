/*global window */
window.requestAnimFrame = (function() {
    "use strict";
    return window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function(callback) { window.setTimeout(callback, 1000 / 60); };
}());

var canvas, context, canvasWidth, canvasHeight, canvasXCenter, canvasYCenter,
    togglePul = true,
    spaceDown = false,
    gameover = false,
    menu = true,
    pulsate = 0,
    puddlePulsate = 0,
    gooseMove = 0,
    goosePosition = [],
    SillyGooseMaxPosition = [450, 450, 450, 350, 350, 270, 270, 270, 270, 270, 270, 270, 450, 450, 450, 450, 450, 450, 270, 270, 210, 210, 210, 210, 210, 210, 210, 350, 450, 450],
    duckOut = 40,
    rescues = 0,
    gooseRescues = 0,
    gooseRescuesMove = 0,
    waterSaved = 0,
    grassArr = [],
    elementArr = [],
    segements = [],
    puddleCollected = false,
    left = false,
    right = false,
    notGoose = false,
    takeaway = -30,
    menuAlpha = 1,
    dirtSaved = 0,
    level = 1,
    waterlevel = 129,
    alert = false;

function gameReset() {
    "use strict";
    menu = false;
    notGoose = false;
    waterlevel = 129;
    waterSaved = 0;
    dirtSaved = 0;
    gameover = false;
}

function doKeyDown(e) {
    "use strict";
    switch (e.keyCode) {
    //Left Arrow
    case 37:
        if (!gameover && !menu) {
            left = true;
        }
        break;
    //right arrow
    case 39:
        if (!gameover && !menu) {
            right = true;
        }
        break;
    //space bar
    case 32:
        if (!menu && !gameover) {
            if (duckOut <= 80) {
                gooseRescues += 1;
                spaceDown = true;
            }
        }
        if (menu) {
            menu = !menu;
        }
        break;
    // P
    case 80:
        menu = !menu;
        break;
    // enter
    case 13:
        if (gameover) {
            gameReset();
        }
        break;
    default:
        break;
    }
}

function doKeyUp(e) {
    "use strict";
    switch (e.keyCode) {
    case 37:
        left = false;
        break;
    case 39:
        right = false;
        break;
    case 32:
        spaceDown = false;
        break;
    }
}

function createBackgound() {
    "use strict";
    var i, grass, grassSize, x, y, toggle;
    for (i = 0; i <= 2000; i += 1) {
        grass = [];
        x = Math.floor(Math.random() * (canvasWidth - 1));
        y = Math.floor(Math.random() * (canvasHeight - 1));

        toggle = !toggle;
        grassSize = toggle ? 3 : 5;

        grass.push(x, y, grassSize);
        grassArr.push(grass);
    }
}

function getRandomInt(min, max) {
    "use strict";
    var exists, number, i;
    do {
        exists = false;
        number = Math.floor(Math.random() * (max - min + 1)) + min;
        if (number === 0) {
            number += 1;
        }
        if (elementArr[0]) {
            for (i = 0; i < elementArr.length; i += 1) {
                if (number === elementArr[i][1]) {
                    exists = true;
                    break;
                }
            }
        }
    } while (exists);
    return number;
}

function getRandomGooseInt(min, max) {
    "use strict";
    var number, range = max - min + 1;
    range = range / 20;
    number = Math.floor(Math.random() * range);
    return (number * 20) + min;
}

function createPuddles() {
    "use strict";
    var i, puddle, randomSeg, x, elementLevel;
    for (i = 0; i < 6; i += 1) {
        puddle = [];
        randomSeg = getRandomInt(0, 29);
        x = getRandomGooseInt(200, SillyGooseMaxPosition[randomSeg]);
        elementLevel = getRandomInt(5, 25);

        puddle.push(x, randomSeg, elementLevel);
        elementArr.push(puddle);
    }
}

function getSegements() {
    "use strict";
    var i, radians, segment;
    for (i = 0; i <= 29; i += 1) {
        radians = (i / 15 * Math.PI);
        segment = [];

        segment.push(radians, false);
        segements.push(segment);
    }
}

function init() {
    "use strict";
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
    createPuddles();
    getSegements();
}

function drawSegment() {
    "use strict";
    var x = 0, y = 0, w = 200, h = 1, i, r;
    for (i = 0; i < segements.length; i += 1) {
        r = segements[i][0];
        context.save();
        context.translate(canvasXCenter, canvasYCenter);
        context.rotate(r);
        context.fillStyle = "rgb(252,238,33)";
        context.beginPath();
        context.fillRect(x, y, w, h);
        context.closePath();
        context.fill();
        context.restore();
    }
}

function notification(x, y, r, elementLevel) {
    "use strict";
    context.save();
    context.translate(canvasXCenter, canvasYCenter);
    context.rotate(r);
    context.beginPath();
    context.arc(x, y, elementLevel+10, 0, 2 * Math.PI, false);
    context.fillStyle = "rgba(203,0,0,0.7)";
    context.fill();
    context.beginPath();
    context.arc(x, y, (elementLevel + 13), 0, 2 * Math.PI, false);
    context.fillStyle = "rgba(203,0,0,0.7)";
    context.fill();
    context.restore();

    context.save();
    context.translate(canvasXCenter, canvasYCenter);
    context.rotate(r);
    context.font = elementLevel + "px Calibri";
    context.fillStyle = "rgba(203,200,200,0.7)";
    context.textAlign="center";
    context.textBaseline = 'middle';
    context.fillText("Switch!", x, y);
    context.restore();
}

function puddle(x, y, r, elementLevel) {
    "use strict";
    context.save();
    context.translate(canvasXCenter, canvasYCenter);
    context.rotate(r);
    context.beginPath();
    context.arc(x, y, elementLevel, 0, 2 * Math.PI, false);
    context.fillStyle = 'rgba(0,126,128,0.5)';
    context.fill();
    context.beginPath();
    context.arc(x, y, (elementLevel + 3), 0, 2 * Math.PI, false);
    context.fillStyle = 'rgba(0,126,128,0.5)';
    context.fill();
    context.restore();
}

function dirt(x, y, r, elementLevel) {
    "use strict";
    context.save();
    context.translate(canvasXCenter, canvasYCenter);
    context.rotate(r);
    context.fillStyle = 'rgba(110,85,56,0.7)';
    context.beginPath();
    context.fillRect(x - 5, y - 10, elementLevel, elementLevel);
    context.fill();
    context.beginPath();
    context.fillRect(x, y, elementLevel + 5, elementLevel + 5);
    context.fill();
    context.beginPath();
    context.fillRect(x - 5, y, elementLevel + 7, elementLevel + 7);
    context.fill();
    context.beginPath();
    context.fillRect(x - 3, y + 10, elementLevel - 5, elementLevel - 5);
    context.fill();
    context.beginPath();
    context.fillRect(x - 15, y - 5, elementLevel + 5, elementLevel + 5);
    context.fill();
    context.restore();
}

function drawElement() {
    "use strict";
    var y = 0, i, r, x, elementLevel;
    for (i = 0; i < elementArr.length; i += 1) {
        r = segements[elementArr[i][1]][0];
        x = elementArr[i][0];
        elementLevel = elementArr[i][2];
        if (i === elementArr.length - 1) {
            alert = false;
            if (!notGoose && waterlevel < 80) {
                notification(x, y, r, elementLevel);
                alert = true;
            } else if (notGoose && waterlevel > 120) {
                notification(x, y, r, elementLevel);
                alert = true;
            }
        } else {
            if (notGoose) {
                dirt(x, y, r, elementLevel);
            } else {
                puddle(x, y, r, elementLevel);
            }
        }
    }
}

function updateElement() {
    "use strict";
    var randomSeg, i, x, elementLevel;

    for (i = 0; i < elementArr.length; i += 1) {
        x = elementArr[i][0];
        elementLevel = elementArr[i][2];

        if (elementLevel > 3) {
            elementLevel -= 0.1;
            elementArr[i][2] = elementLevel;
        } else {
            randomSeg = getRandomInt(0, 29);
            x = getRandomGooseInt(200, SillyGooseMaxPosition[randomSeg]);
            elementArr[i][0] = x;
            elementArr[i][1] = randomSeg;
            elementArr[i][2] = getRandomInt(5, 25);
        }
    }
}

function drawBackground() {
    "use strict";
    var i;
    context.save();
    context.fillStyle = "rgb(100,155,83)";
    context.rect(0, 0, canvasWidth, canvasHeight);
    context.fill();
    context.fillStyle = "rgb(50,205,0)";
    for (i = 0; i < grassArr.length; i += 1) {
        // Draw an individual star.
        context.beginPath();
        context.rect(grassArr[i][0], grassArr[i][1], grassArr[i][2] / 8, grassArr[i][2]);
        context.closePath();
        context.fill();
    }
    context.restore();
}
function updateSilly() {
    "use strict";

    if (!spaceDown && duckOut <= 40) {
        if (puddleCollected) {
            rescues += 1;
            puddleCollected = false;
        }
    }
    if (right && !spaceDown && duckOut <= 80) {
        gooseMove += 1;
        if (gooseMove === 30) {
            gooseMove = 0;
        }
    }
    if (left && !spaceDown && duckOut <= 80) {
        gooseMove -= 1;
        if (gooseMove === -1) {
            gooseMove = 29;
        }
    }
    if (!spaceDown && duckOut > 40) {
        duckOut -= 20;
    }
    if (puddleCollected) {
        spaceDown = false;
    }
    if (spaceDown && duckOut < 500) {
        duckOut += 20;
    }
}

function goose(x, y, w, h, cx, cy, pulsate, r) {
    "use strict";
    context.save();
    context.fillStyle = "rgba(253,253,253,0.8)";
    context.translate(cx, cy);
    context.rotate(r);
    context.fillRect(x, y, w, h);
    context.fillRect(x - 5, y + 5, w + 10, h - 10);
    context.fillRect(x - 5, y + 15, w + 30, h - 30);
    context.fillRect(x - 5, y + 5, w - 5, h - 10);
    if (spaceDown) {
        context.fillStyle = "rgb(253,253,253)";
        context.fillRect(x, y + pulsate, w - 3, h);
        context.fillRect(x, y - pulsate, w - 3, h);
        context.fillRect(x - pulsate * 2, y + 10, w - 5, h - 20);
    }
    context.fillStyle = "rgb(253,203,0)";
    context.fillRect(x + 45, y + 17, w - 10, h - 34);
    context.restore();
}

function moose(x, y, w, h, cx, cy, r) {
    "use strict";
    context.save();
    context.fillStyle = "rgba(72,48,48,0.9)";
    context.translate(cx, cy);
    context.rotate(r);
    context.fillRect(x - 10, y, w, h);
    context.fillRect(x + 40, y + 10, w - 45, h - 20);
    context.fillRect(x + 45, y + 8, w - 35, h - 16);
    context.fillStyle = "rgba(230,248,48,0.9)";
    context.fillRect(x + 45, y + 18, w - 47, h - 10);
    context.fillRect(x + 45, y + 30, w - 36, h - 27);
    context.fillRect(x + 45, y + 22, w - 40, h - 27);
    context.fillRect(x + 45, y - 8, w - 47, h - 10);
    context.fillRect(x + 45, y - 4, w - 36, h - 27);
    context.fillRect(x + 45, y + 4, w - 40, h - 27);
    context.restore();
}

function drawSilly() {
    "use strict";
    var w, h, y, cx = canvasXCenter, cy = canvasYCenter, x = duckOut, r = (gooseMove / 15 * Math.PI);

    goosePosition = [gooseMove, x];
    if (notGoose) {
        w = 50;
        h = 30;
        y = -13;
        moose(x, y, w, h, cx, cy, r);
    } else {
        w = 20;
        h = 40;
        y = -19;
        goose(x, y, w, h, cx, cy, pulsate, r);
    }
}

function drawPond() {
    "use strict";
    context.save();
    context.beginPath();
    context.arc(canvasXCenter, canvasYCenter, (1.13 * waterlevel), 0, 2 * Math.PI, false);
    context.fillStyle = 'rgba(73,56,49,0.3)';
    context.fill();
    context.beginPath();
    context.arc(canvasXCenter, canvasYCenter, (1.1 * waterlevel), 0, 2 * Math.PI, false);
    context.fillStyle = 'rgba(73,56,49,0.5)';
    context.fill();
    context.beginPath();
    context.arc(canvasXCenter, canvasYCenter, (0.8 * waterlevel) + pulsate, 0, 2 * Math.PI, false);
    context.fillStyle = 'rgba(0,126,128,0.5)';
    context.fill();
    context.beginPath();
    context.arc(canvasXCenter, canvasYCenter, (0.9 * waterlevel) + pulsate, 0, 2 * Math.PI, false);
    context.fillStyle = 'rgba(0,126,128,0.5)';
    context.fill();
    context.beginPath();
    context.arc(canvasXCenter, canvasYCenter, (1.04 * waterlevel) - pulsate, 0, 2 * Math.PI, false);
    context.fillStyle = 'rgba(0,126,128,0.5)';
    context.fill();
    context.restore();
    if (togglePul) {
        pulsate += 0.2;
        puddlePulsate += 0.02;
    } else {
        pulsate -= 0.2;
        puddlePulsate -= 0.02;
    }
    if (pulsate >= 3) {
        togglePul = false;
    }
    if (pulsate <= 0) {
        togglePul = true;
    }
}

function getMousePos(canvas, evt) {
    "use strict";
    var rect = canvas.getBoundingClientRect();
    return [evt.clientX - rect.left, evt.clientY - rect.top];
}

function showMenu() {
    "use strict";
    context.save();
    context.beginPath();
    context.fillStyle = "rgba(73,56,49,0.8)";
    context.fillRect(200, 100, 600, 400);
    context.fillStyle = "rgba(73,56,49,0.5)";
    context.fillRect(196, 96, 4, 408);
    context.fillRect(800, 96, 4, 408);
    context.fillRect(200, 96, 600, 4);
    context.fillRect(200, 500, 600, 4);
    context.closePath();
    context.fill();
    context.restore();
}

function showHowToPlay() {
    "use strict";
    showMenu();
    context.save();
    context.fillStyle = "rgb(253,203,0)";
    context.textAlign = 'center';
    context.font = "40px Calibri";
    context.fillText("How to play", canvasXCenter, 150);
    context.fillStyle = "rgb(239,218,171)";
    context.font = "20px Calibri";
    context.fillText("Silly Moose and Goose dont know they're causing each other trouble.", canvasXCenter, 180);
    context.fillText("Silly Moose want to get rid of the pond so he can eat more grass!", canvasXCenter, 210);
    context.fillText("But Silly Goose want a bigger pond!", canvasXCenter, 240);
    context.fillText("For the goose the pond is draining, for the moose it is overflowing.", canvasXCenter, 270);
    context.fillText("When you are Silly Goose, collect water for points.", canvasXCenter, 300);
    context.fillText("When you are Silly Moose, collect earth for points.", canvasXCenter, 330);
    context.fillText("Change to goose/moose by collecting the red 'Switch!' element.", canvasXCenter, 360);
    context.fillText("Use left and right arrows to move.", canvasXCenter, 420);
    context.fillText("HOLD spacebar until you hit the element to collect it.", canvasXCenter, 450);
    context.fillStyle = "rgb(239,70,70)";
    context.fillText("Press spacebar to start!", canvasXCenter, 480);
    context.restore();
}

function gameOver() {
    "use strict";
    showMenu();
    context.save();
    context.fillStyle = "rgb(253,203,0)";
    context.textAlign = 'center';
    context.font = "40px Calibri";
    context.fillText("Game Over", canvasXCenter, 150);
    context.fillStyle = "rgb(239,218,171)";
    context.font = "20px Calibri";
    context.fillText("Well done you have collected " + waterSaved + "L of water", canvasXCenter, 210);
    context.fillText("and collected " + dirtSaved + "KG of earth... giving you a score of", canvasXCenter, 240);
    context.fillStyle = "rgb(239,0,0)";
    context.font = "30px Calibri";
    context.fillText(waterSaved + dirtSaved, canvasXCenter, 270);
    context.fillStyle = "rgb(239,218,171)";
    context.font = "20px Calibri";
    if (waterlevel < 70) {
        context.fillText("... but sadly a goose lost its home :(", canvasXCenter, 300);
    } else {
        context.fillText("... but sadly a moose lost its home :(", canvasXCenter, 300);
    }
    context.fillText("Press ENTER to play again.", canvasXCenter, 450);
    context.restore();
}

function increaseWaterlevel(elementLevel) {
    "use strict";
    if (notGoose) {
        waterlevel -= elementLevel;
        dirtSaved += elementLevel;
    } else {
        waterlevel += elementLevel;
        waterSaved += elementLevel;
    }
}

function checkSillyHit() {
    "use strict";
    var randomSeg, x, i;
    if (goosePosition[0]) {
        //check to see if has baby geese
        for (i = 0; i < elementArr.length; i += 1) {
            if (goosePosition[0] === elementArr[i][1]) {
                if (goosePosition[1] === elementArr[i][0]) {
                    if ((i === 5 && waterlevel < 70 && !notGoose) || (i === 5 && waterlevel > 130 && notGoose)) {
                        notGoose = !notGoose;
                    }
                    increaseWaterlevel(elementArr[i][2] / 10);
                    randomSeg = getRandomInt(0, 29);
                    x = getRandomGooseInt(200, SillyGooseMaxPosition[randomSeg]);
                    elementArr[i][0] = x;
                    elementArr[i][1] = randomSeg;
                    elementArr[i][2] = getRandomInt(5, 25);
                    puddleCollected = true;
                }
                break;
            }
        }
    }
}

function gameText() {
    "use strict";
    waterSaved = Math.floor(waterSaved);
    dirtSaved = Math.floor(dirtSaved);
    context.save();
    context.beginPath();
    context.fillStyle = "rgba(73,56,49,0.8)";
    context.fillRect(0, 0, 1000, 70);
    context.fillRect(0, 70, 10, 520);
    context.fillRect(990, 70, 10, 520);
    context.fillRect(0, 590, 1000, 10);
    if (alert) {
        context.fillStyle = "rgba(203,0,0,0.8)";
    } else {
        context.fillStyle = "rgba(73,56,49,0.5)";
    }
    context.fillRect(10, 70, 980, 4);
    context.fillRect(10, 74, 4, 516);
    context.fillRect(986, 74, 4, 516);
    context.fillRect(14, 586, 972, 4);
    context.fillRect(14, 550, 846, 4);
    context.fillRect(860, 550, 126, 36);
    context.fillStyle = "rgba(73,56,49,0.3)";
    context.fillRect(14, 554, 846, 32);
    context.font = "15px Calibri";
    context.fillStyle = "rgb(250,250,250)";
    context.fillText("christoffee.com", 880, 575);
    context.closePath();
    context.fill();
    context.fillStyle = "rgb(253,203,0)";
    context.font = "40px Calibri";
    if (notGoose) {
        context.fillText("Silly Moose", 20, 40);
        context.fillStyle = "rgb(239,218,171)";
        context.font = "12px Calibri";
        context.fillText("and Goose.", 138, 58);
    } else {
        context.fillText("Silly Goose", 20, 40);
        context.fillStyle = "rgb(239,218,171)";
        context.font = "12px Calibri";
        context.fillText("and Moose.", 138, 58);
    }
    context.font = "20px Calibri";
    context.fillStyle = "rgb(239,218,171)";
    context.fillText("Water Collected: " + waterSaved + "L", 650, 45);
    context.fillStyle = "rgb(239,218,0)";
    context.fillText("Dirt Collected: " + dirtSaved + "KG", 450, 45);
    if (notGoose) {
        context.fillStyle = 'rgb(110,85,56)';
        context.font = "25px Calibri";
        context.fillText("Earth", 850, 45);
    } else {
        context.fillStyle = 'rgb(0,126,128)';
        context.font = "25px Calibri";
        context.fillText("Water", 850, 45);
    }
    context.restore();
}

function drawWaterLevel() {
    "use strict";
    context.save();
    if (waterlevel < 70 || waterlevel > 129) {
        context.fillStyle = "rgba(103,6,9,0.6)";
    } else {
        context.fillStyle = 'rgba(0,126,128,0.7)';
    }
    context.translate(10, 554);
    context.fillRect(4, 0, (waterlevel - 50) * 8.47, 32);
    context.fillStyle = 'rgba(250,0,0,0.7)';
    context.fillRect(172, 0, 4, 32);
    context.fillRect(678, 0, 4, 32);
    context.restore();
}

function updateWaterLevel() {
    "use strict";
    if (!menu && waterlevel > 50 && waterlevel < 150) {
        if (notGoose) {
            waterlevel += (0.1 + (dirtSaved / 70));
        } else {
            waterlevel -= (0.1 + (waterSaved / 70));
        }
    }
}

function render() {
    "use strict";
    if (context) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground();
        drawPond();
        drawElement();
        drawSilly();
        drawWaterLevel();
        gameText();
        if (menu) {
            showHowToPlay();
        }
        if (waterlevel <= 50 || waterlevel >= 150) {
            gameover = true;
        }
        if (gameover) {
            gameOver();
        }
        //drawSegment();
    }
}

function timestamp() {
    "use strict";
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

var now, dt = 0, last = timestamp(), step = 1 / 25;

function update() {
    "use strict";
    updateWaterLevel();
    updateSilly();
    updateElement();
    checkSillyHit();
}

function frame() {
    "use strict";
    now = timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while (dt > step) {
        dt = dt - step;
        update(step);
    }
    render(dt);
    last = now;
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
