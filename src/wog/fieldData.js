// Private ------------------------------------------------------------------------------------

var _ = require('../libs/underscore');
var Point = require('./Point.js');
var castingArea = {};
var fieldArea = {};

// Public -------------------------------------------------------------------------------------

var _public = {};

/*	formatCombatScreen(deviceHeight, deviceWidth, screenRatio, radiusFactor, arcColor,
		circleColor, pinColor, rectColor, pinWidth)
	Should be called when the app is loaded and any time the bounds of the device change. Calculates
	the field and casting area.
	- deviceHeight (int): Height of the device screen.
	- deviceWidth (int): Width of the device screen.
	- radiusFactor (int): The radius based off of device width of the center circle. 2 - Half, etc
	- screenRatio (int): The height of the casting area. 1 = Entire Screen, 2 - Half, 3 - Third, etc
*/
_public.formatCombatScreen = function(deviceHeight, deviceWidth, radiusFactor, screenRatio) {
	var arc, adj, opp;
	
	castingArea.boundingHeight = deviceHeight/screenRatio;
	castingArea.deviceWidth = deviceWidth;
	castingArea.halfBounding = castingArea.boundingHeight/2;
	castingArea.diameter = deviceWidth/radiusFactor;
	castingArea.graphics = {
		center: new Point(deviceWidth/2, deviceHeight-castingArea.halfBounding),
		topLeft: new Point((deviceWidth/2)+(deviceWidth/-2), (deviceHeight-castingArea.halfBounding)-castingArea.halfBounding),
		topRight: new Point((deviceWidth/2)+(deviceWidth/2), (deviceHeight-castingArea.halfBounding)-castingArea.halfBounding),
		bottomLeft: new Point((deviceWidth/2)+(deviceWidth/-2), (deviceHeight-castingArea.halfBounding)+castingArea.halfBounding),
		bottomRight: new Point((deviceWidth/2)+(deviceWidth/2), (deviceHeight-castingArea.halfBounding)+castingArea.halfBounding)
	};
	castingArea.graphing = {
		center: new Point(0, 0),
		topLeft: new Point(deviceWidth/-2, castingArea.halfBounding),
		topRight: new Point(deviceWidth/2, castingArea.halfBounding),
		bottomLeft: new Point(deviceWidth/-2, -castingArea.halfBounding),
		bottomRight: new Point(deviceWidth/2, -castingArea.halfBounding)
	};
	castingArea.arc = Math.atan((castingArea.halfBounding-1)/(deviceWidth/2-1));
	castingArea.adj = Math.cos(castingArea.arc)*(deviceWidth/radiusFactor/2);
	castingArea.opp = Math.sin(castingArea.arc)*(deviceWidth/radiusFactor/2);

	fieldArea.boundingHeight = deviceHeight-(deviceHeight/screenRatio);
	fieldArea.deviceHeight = deviceHeight;
	fieldArea.thirdBounding = fieldArea.boundingHeight/3;
};

_public.getCastingArea = function() {
	return castingArea;
}

_public.getFieldArea = function() {
	return fieldArea;
}

module.exports = _public;