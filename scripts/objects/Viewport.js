function Viewport(g, x, y, width, height) {
	this.g = g;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.update = function(entity) {
		this.x = entity.location.x - Math.floor(this.width / 2);
		this.y = entity.location.y - Math.floor(this.height / 2);
	};
	this.updateLocation = function(x, y) {
		this.x = x;
		this.y = y;
	};
	this.updateSize = function(width, height) {
		this.width = width;
		this.height = height;
	};
	this.contains = function(entity) {
		return entity.location.x + (entity.stats.size / 2) > this.x &&
			   entity.location.y + (entity.stats.size / 2) > this.y &&
			   entity.location.x - (entity.stats.size / 2) < this.x + this.width &&
			   entity.location.y - (entity.stats.size / 2) < this.y + this.height;
	};
}