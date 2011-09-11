function Entity(name) {
	this.name = name;
	this.target = null;
	this.stats = {
		dead: false,
		health: new Stat(100, 1),
		resource: new Stat(100, 10)
	};
	this.graphics = {
		size: 30,
		color: name	
	};
	this.movement = {
		x: 0,
		y: 0,
		speed: 100
	};
	this.location = {
		x: 0,
		y: 0
	};
	
	// UI
	
	
	this.update = function(time, map) {
		// Movement
		var len = Math.sqrt(Math.pow(this.movement.x, 2) + Math.pow(this.movement.y, 2));
		if (len > 0 && !this.stats.dead) {
			var movementX = (this.movement.x / len) * (this.movement.speed * time / 1000);
			var movementY = (this.movement.y / len) * (this.movement.speed * time / 1000);
			var playerXTile = map.getTile(this.location.x + movementX, this.location.y);
			var playerYTile = map.getTile(this.location.x, this.location.y + movementY);
			var playerTile = map.getTile(this.location.x, this.location.y);
			if (!tileCollision(playerXTile) || tileCollision(playerTile)) {
				this.location.x += movementX;
			}
			if (!tileCollision(playerYTile) || tileCollision(playerTile)) {
				this.location.y += movementY;
			}
			if (!tileCollision(playerXTile) || !tileCollision(playerYTile)) {
				var params = {
					x: this.location.x,
					y: this.location.y
				};
				sendMessage("movement",params);
			}
		}
	};
	
	this.distance = function(entity) {
		return Math.sqrt(Math.pow(location.x - entity.location.x, 2) + Math.pow(location.y - location.y, 2));
	};
	
	this.cast = function (spell) {
		if (this.target == null)
			return 1;
		
		if (this.distance(this.target) <= spell.range && 
			gameTime - spell.lastCast >= spell.cooldown) 
		{
			modHealth(-spells[spellName].damage, map.NPCs[num]);
			spell.lastCast = gameTime;
		}
	};
	
	this.draw = function(viewport) {
		if (viewport.contains(this)) {
			
			var health = this.stats.health.current / this.stats.health.max;
			var resource = this.stats.resource.current / this.stats.resource.max;
			
			// this
			viewport.g.fillStyle = getFill(this.graphics.color);
			viewport.g.fillRect(this.location.x - viewport.x - (this.graphics.size / 2), this.location.y - viewport.y - (this.graphics.size / 2), this.graphics.size, this.graphics.size);
			
			// Bars
			// Background
			viewport.g.fillStyle = "rgb(0,0,0)";
			viewport.g.fillRect(this.location.x - viewport.x - (this.graphics.size / 2), this.location.y - viewport.y - (this.graphics.size / 2) - 12, this.graphics.size, 10);
			// Health
			viewport.g.fillStyle = "rgb(" + parseInt(255 - (255.0 * health)) + "," + parseInt(255.0 * health) + ",0)";
			viewport.g.fillRect(this.location.x - viewport.x - (this.graphics.size / 2) + 1, this.location.y - viewport.y - (this.graphics.size / 2) - 11, Math.ceil(parseFloat(this.graphics.size - 2) * health), 5);
			// Resource
			viewport.g.fillStyle = "rgb(0,0,255)";
			viewport.g.fillRect(this.location.x - viewport.x - (this.graphics.size / 2) + 1, this.location.y - viewport.y - (this.graphics.size / 2) - 5, Math.ceil(parseFloat(this.graphics.size - 2) * resource), 2);
		}
	};
}

function Stat(val, regen) {
	this.current = max;
	this.max = val;
	this.regen = regen;
	this.mod = function(value) {
		this.current -= value;
		if (this.current < 0)
			this.current = 0;
		if (this.current > this.max)
			this.current = this.max;
	};
	this.tick = function(time) {
		this.mod((time / 1000) * this.regen);
	};
}
