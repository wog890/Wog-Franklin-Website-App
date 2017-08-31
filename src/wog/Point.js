module.exports = function(x, y) {
	this.x = x;
	this.y = y;

	this.distance = function(point) {	
		var a = this.x - point.x;
		var b = this.y - point.y;
		return Math.sqrt(Math.pow(a, 2)+Math.pow(b, 2));
	}
}