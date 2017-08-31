// Private ------------------------------------------------------------------------------------

var _ = require('../libs/underscore');
var Point = require('./Point.js');
var spellField = require('./spellField.js');
var spells = require('../libs/spellAPI.js');

var canvasBox;
var canvasPath;
var casting = false;
var castingBox;
var castingError = false;
var castingPath;
var manaBar;
var pattern = [];
var prevPointerPos = null;
var updateDistance = 5;

/*  castSpell()
    Called after a pattern has been drawn by the user.
*/
function castSpell() {
  if (pattern.length > 0 && manaBar.get('selection') === 100) {
    var spell = spells.getSpell(pattern);
    if (spell.element !== spells.elements.RANDOM) {
      spellField.addInformation('You cast: ' + spells.getSpell(pattern).name + '!', '#16DEDE');
    }
    else {
      spellField.addInformation('Your spell failed to do anything', '#DE1616');
    }
    manaBar.set('selection', 0);
    restoreManaBar(30, 10);
  }
  else if (manaBar.get('selection') < 100) {
    spellField.addInformation('You mana has not refilled', '#DE1616');
  }
  pattern = [];
  prevPointerPos = null;
  window.setTimeout(
    function() {
      casting = false;
      castingPath.clearRect(0, 0, tabris.device.get('screenWidth'), tabris.device.get('screenHeight'));
    }, 100
  );
}

/*  getQuadrant(pointerPos)
    Finds out which quadrant the pointer is located in.
    - pointerPos (Point): X and Y coordinates of the pointer with (0, 0) being the center circle.
    - RETURN (Int): Number of the quadrant pointer is located in.
*/
function getQuadrant(pointerPos) {
  switch(pointerPos.x < 0) {
    case true:
      switch(pointerPos.y < 0) {
        case true: return 3;
        case false: return 4;
      }
    break;
    case false:
      switch(pointerPos.y < 0) {
        case true: return 2;
        case false: return 1;
      }
    break;
  }
}

/*  handleLocation(pointerLocation)
    Handles the location of the pointer. Only allows propogation if the pointer has
    entered a new quadrant.
    - pointerLocation (Int): Quadrant location of the pointer.
*/
function handleLocation(pointerLocation) {
  if (pattern.length === 0 || pointerLocation !== pattern[pattern.length-1]) {
    pattern.push(pointerLocation);
  }
}

/*  handleSpellInput(x, y)
    Called each time the user touches or moves inside the casting area. Will only
    allow propogation if the user has moved further than the update distance.
    - x (Int): X value of the pointer on the device screen.
    - y (Int): Y value of the pointer on the device screen.
    - castingArea (Object): Required information provided from main screen.
*/
function handleSpellInput(x, y, castingArea) {
  var touchPos;

  function generatePointerPos() {
    var x2, y2;

    switch(castingArea.graphics.center.x > x) {
      case true: x2 = -(castingArea.graphics.center.x - x); break;
      case false: x2 = x - castingArea.graphics.center.x; break;
    }
    switch(castingArea.graphics.center.y > y) {
      case true: y2 = castingArea.graphics.center.y - y; break;
      case false: y2 = -(y - castingArea.graphics.center.y); break;
    }
    return new Point(x2, y2);
  }

  if (y > castingArea.graphics.topLeft.y) {
    touchPos = generatePointerPos();
    if (prevPointerPos == null) {
      handleLocation(locatePointerLocation(touchPos, castingArea));
      prevPointerPos = new Point(x, y);
    }
    else if (prevPointerPos.distance(new Point(x, y)) > updateDistance) {
      handleLocation(locatePointerLocation(touchPos, castingArea));
      castingPath.lineWidth = 10;
      castingPath.lineCap = 'round';
      castingPath.strokeStyle = '#6FB557';
      castingPath.beginPath();
      castingPath.moveTo(prevPointerPos.x, prevPointerPos.y);
      castingPath.lineTo(x, y);
      castingPath.stroke();
      castingPath.closePath();
      prevPointerPos = new Point(x, y);
    }
  }
  else if (pattern.length > 0) {
    castingError = true;
    castSpell();
  }
}

/*  locatePointerLocation(pointerPos, castingArea)
    Finds which area the pointer is in based off of its quadrant location and location around the nearest pin.
    - pointerPos (Point): X and Y coordinates based off of the device screen.
    - castingArea (Object): Required information provided by main.
    - RETURN (Int): Returns the area the pointer is located in. 1 - Upper, 2 - Right, 3 - Lower, 4 - Left, 0 - Center
*/
function locatePointerLocation(pointerPos, castingArea) {

  function getPinSide(slopeModifier, topOpt, bottomOpt) {
    var pinY = (castingArea.graphing.topRight.y/castingArea.graphing.topRight.x*slopeModifier)*pointerPos.x;
    switch(pinY < pointerPos.y) {
      case true: return topOpt;
      case false: return bottomOpt;
    }
  }

  if (pointerPos.distance(new Point(0, 0)) < castingArea.diameter/2) {
    return 0;
  }
  else {
    switch(getQuadrant(pointerPos)) {
      case 1: return getPinSide(1, 1, 2);
      case 2: return getPinSide(-1, 2, 3);
      case 3: return getPinSide(1, 4, 3);
      case 4: return getPinSide(-1, 1, 4);
    }
  }
}

/*  restoreManaBar(delay, increment)
    Auto loop that will bring the mana bar back to 100
    - delay (int): Time to delay in milliseconds.
    - increment (int): Amount to increment after each delay.
*/
function restoreManaBar(delay, increment) {
  window.setTimeout(
    function() {
      manaBar.set('selection', manaBar.get('selection') + increment);
      if (manaBar.get('selection') < 100) {
        restoreManaBar(delay, increment);
      }
    }, delay
  );
}

// Public -------------------------------------------------------------------------------------

var _public = {};

/*  drawCastingArea(castingArea)
    Creates the area the user draws spells in.
    - castingArea (object): Required device data for drawing the screen.
    - page (tabris.Page): Required page for casting area to be added to.
    - arcColor (hex): Color of the center circle and rectangle border.
    - circleColor (hex): Color of the center circle background.
    - pinColor (hex): Color of the pins.
    - rectColor (hex): Color of rectangle background.
    - pinWidth (int): Line width of the pins, circle border, and rectangle border.
*/
_public.drawCastingArea = function(castingArea, page, arcColor, circleColor, pinColor, rectColor, pinWidth) {
  var graphics;

  function drawPins() {
    castingBox.beginPath();
    castingBox.strokeStyle = pinColor;
    castingBox.lineWidth = pinWidth;
    castingBox.moveTo(castingArea.graphics.center.x+castingArea.adj, castingArea.graphics.center.y-castingArea.opp);
    castingBox.lineTo(castingArea.graphics.topRight.x, castingArea.graphics.topRight.y);
    castingBox.moveTo(castingArea.graphics.center.x+castingArea.adj, castingArea.graphics.center.y+castingArea.opp);
    castingBox.lineTo(castingArea.graphics.bottomRight.x, castingArea.graphics.bottomRight.y);
    castingBox.moveTo(castingArea.graphics.center.x-castingArea.adj, castingArea.graphics.center.y-castingArea.opp);
    castingBox.lineTo(castingArea.graphics.topLeft.x, castingArea.graphics.topLeft.y);
    castingBox.moveTo(castingArea.graphics.center.x-castingArea.adj, castingArea.graphics.center.y+castingArea.opp);
    castingBox.lineTo(castingArea.graphics.bottomLeft.x, castingArea.graphics.bottomLeft.y);
    castingBox.stroke();
    castingBox.closePath();
  }

  function drawCastingBox() {
    castingBox.beginPath();
    castingBox.fillStyle = rectColor;
    castingBox.fillRect(castingArea.graphics.topLeft.x, castingArea.graphics.topLeft.y, castingArea.deviceWidth, castingArea.boundingHeight);
    castingBox.closePath();
    castingBox.beginPath();
    castingBox.lineWidth = pinWidth;
    castingBox.fillStyle = circleColor;
    castingBox.strokeStyle = arcColor;
    castingBox.arc(castingArea.graphics.center.x, castingArea.graphics.center.y, castingArea.diameter/2, 0, 2*Math.PI, false);
    castingBox.stroke();
    castingBox.fill();
    castingBox.closePath();
    castingBox.beginPath();
    castingBox.lineWidth = pinWidth;
    castingBox.moveTo(castingArea.graphics.topLeft.x, castingArea.graphics.topLeft.y-(.5*pinWidth));
    castingBox.lineTo(castingArea.graphics.topRight.x, castingArea.graphics.topRight.y-(.5*pinWidth));
    castingBox.stroke();
    castingBox.closePath();
  }

  _canvasBox = new tabris.Canvas({
    layoutData: {left: 0, top: 0, right: 0, bottom: 0}
  }).on('change:bounds', function(canvas, bounds) {
    castingBox = canvas.getContext('2d', bounds.width, bounds.height);
    drawCastingBox();
    drawPins();
  }).on('touchstart', function(widget, event) {
    if (!casting) {
      casting = true;
      castingError = false;
      handleSpellInput(event.touches[0].x, event.touches[0].y, castingArea);
    }
  }).on('touchmove', function(widget, event) {
    if (!castingError) {
      handleSpellInput(event.touches[0].x, event.touches[0].y, castingArea);
    }
  }).on('touchend', function(widget, event) {
    if (!castingError) {
      castSpell();
    }
  }).appendTo(page);

  _canvasPath = new tabris.Canvas({
    layoutData: {left: 0, top: 0, right: 0, bottom: 0}
  }).on('change:bounds', function(canvas, bounds) {
    castingPath = canvas.getContext('2d', bounds.width, bounds.height);
  }).appendTo(page);

  manaBar = new tabris.ProgressBar({
    textColor: '#16DEDE',
    layoutData: {right: 10},
    selection: 100
  }).appendTo(page);
};

module.exports = _public;