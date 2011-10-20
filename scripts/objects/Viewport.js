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
	this.screenLocationE = function(entity) {
		return this.screenLocation(entity.location.x, entity.location.y);
	};
	this.worldLocationE = function(entity) {
		return this.worldLocation(entity.location.x, entity.location.y);
	};
	this.screenLocation = function(worldX, worldY) {
		if (!this.containsCoords(x, y))
			return null;
		else
			return { x: worldX - this.x, y: worldY - this.y};
	};
	this.worldLocation = function(screenX, screenY) {
		return {x: this.x + screenX, y: this.y + screenY};
	};
	this.containsCoords = function(x, y, buffer) {
		if (buffer == undefined)
			buffer = 0;
		return x + buffer > this.x &&
		   y + buffer > this.y &&
		   x - buffer < this.x + this.width &&
		   y - buffer < this.y + this.height;
	};
	this.containsEntity = function(entity) {
		return this.containsCoords(entity.location.x, entity.location.y, entity.graphics.size / 2);
	};
	
	
}