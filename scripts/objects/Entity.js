function Entity(name) {
	this.name = name;
	this.target = null;
	this.dead = false;
	this.health = new Stat(100, 1);
	this.resource = new Stat(100, 2);
	this.stats = {
		
	};
	this.graphics = {
		size: 30,
		color: randomColor()
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
		// Death
		if (this.health.current <= 0 && !this.dead)
			this.die();
			
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
		
		// Stats
		this.health.tick(time);
		this.resource.tick(time);
		
	};
	
	this.distance = function(entity) {
		return Math.sqrt(Math.pow(this.location.x - entity.location.x, 2) + Math.pow(this.location.y - entity.location.y, 2));
	};
	
	this.contains = function(x, y) {
		return (x > this.location.x - (this.graphics.size / 2)) && 
		   (y > this.location.y - (this.graphics.size / 2)) &&
		   (x < this.location.x + (this.graphics.size / 2)) &&
		   (y < this.location.y + (this.graphics.size / 2));
	};
	
	this.draw = function(viewport, selected) {
		if (viewport.containsEntity(this)) {
			
			var health = this.health.current / this.health.max;
			var resource = this.resource.current / this.resource.max;
			var baseX = this.location.x - viewport.viewX - (this.graphics.size / 2);
			var baseY = this.location.y - viewport.viewY - (this.graphics.size / 2);
			
			// this
			viewport.g.fillStyle = this.graphics.color;
			viewport.g.fillRect(baseX, baseY, this.graphics.size, this.graphics.size);
			
			// Bars
			// Background
			viewport.g.fillStyle = "rgb(0,0,0)";
			viewport.g.fillRect(baseX, baseY - 12, this.graphics.size, 10);
			// Health
			viewport.g.fillStyle = "rgb(" + parseInt(255 - (255.0 * health)) + "," + parseInt(255.0 * health) + ",0)";
			viewport.g.fillRect(baseX + 1, baseY - 11, Math.ceil(parseFloat(this.graphics.size - 2) * health), 5);
			// Resource
			viewport.g.fillStyle = "rgb(50,50,255)";
			viewport.g.fillRect(baseX + 1, baseY - 5, Math.ceil(parseFloat(this.graphics.size - 2) * resource), 2);
			// Selected
			if (selected) {
				viewport.g.strokeStyle = "rgb(255,100,0)";
				viewport.g.lineWidth = 1;
				viewport.g.strokeRect(baseX - 2, baseY - 2, this.graphics.size + 4, this.graphics.size + 4);
			}
		}
	};
	
	this.die = function() {
		this.dead = true;
		setTimeout(resetDeathNotice, this == player ? 2000 : 200, this);
		
		function resetDeathNotice(target) {
			console.log("Respawned");
			target.dead = false;
			if (target.type == "player") {
				target.location.x = map.spawn.x;
				target.location.y = map.spawn.y;
			} else if (target.type == "npc") {
				var loc = getRandomLoc(true);
				target.location.x = loc.x;
				target.location.y = loc.y;
			}
			target.health.current = target.health.max;
		}
	};
	
	
}



function Stat(val, regen) {
	this.current = val;
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
		this.passedTime += time;
		if (this.passedTime >= this.maxTime) {
			this.mod(-(this.passedTime / this.maxTime));
			this.passedTime = this.passedTime % this.maxTime;
		}
	};
	
	this.maxTime = 1000 / regen;
	this.passedTime = 0;
}
