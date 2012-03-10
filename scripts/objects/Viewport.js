function Viewport(g, x, y, width, height) {
    this.g = g;
    this.viewX = x;
    this.viewY = y;
    this.width = width;
    this.height = height;
    this.scaleX = g.canvas.width / width;
    this.scaleY = g.canvas.height / height;
    
    // Viewport Methods
    this.update = function(entity) {
	this.width = g.canvas.width;
	this.height = g.canvas.height;
	this.viewX = entity.location.x - Math.floor(this.width * this.scaleX / 2);
	this.viewY = entity.location.y - Math.floor(this.height * this.scaleY / 2);
    };
    this.updateLocation = function(x, y) {
	this.viewX = x;
	this.viewY = y;
    };
    this.updateSize = function(width, height) {
	this.width = width;
	this.height = height;
	this.updateScale();
    };
    this.updateCanvasSize = function(width, height) {
	this.g.canvas.width = width;
	this.g.canvas.height = height;
	this.updateScale();
    };
    this.screenLocationE = function(entity) {
	return this.screenLocation(entity.location.x, entity.location.y);
    };
    this.worldLocationE = function(entity) {
	return this.worldLocation(entity.location.x, entity.location.y);
    };
    this.screenLocation = function(worldX, worldY) {
	return { x: worldX - this.viewX, y: worldY - this.viewY};
    };
    this.worldLocation = function(screenX, screenY) {
	return {x: this.viewX + screenX, y: this.viewY + screenY};
    };
    this.containsCoords = function(x, y, buffer) {
	if (buffer == undefined)
	    buffer = 0;
	return x + buffer > this.viewX &&
	    y + buffer > this.viewY &&
	    x - buffer < this.viewX + this.width &&
	    y - buffer < this.viewY + this.height;
    };
    this.containsEntity = function(entity) {
	return this.containsCoords(entity.location.x, entity.location.y, entity.graphics.size / 2);
    };
	
    this.updateScale = function() {
	this.scaleX = g.canvas.width / width;
	this.scaleY = g.canvas.height / height;
    };
    
    //UI
    this.UI = {
	drawFrame: function(x, y, width, height, entity) {
	    var health = entity.health.current / entity.health.max;
	    var resource = entity.resource.current / entity.resource.max;
	    
	    //Background
	    g.fillStyle = "rgb(0,0,0)";
	    g.fillRect(x, y, width, height);
	    g.fillStyle = "rgb(255,255,255)";
	    
	    // Name
	    this.setFontSize(10);
	    g.textAlign = "left";
	    g.textBaseline = "top";
	    g.fillText(entity.name, x + 2, y);

	    // Health Bar
	    y += 14;
	    height -= 14;
	    g.fillStyle = "rgb(" + 
		parseInt(255 - (255.0 * health)) + "," + 
		parseInt(255.0 * health) + 
		",0)";
	    g.fillRect(
		x + 2, 
		y + 2, 
		Math.ceil(parseFloat(width - 4) * health), 
		(height / 2) - 4
	    );
	    
	    // Mana Bar
	    g.fillStyle = "rgb(50,50,255)";
	    g.fillRect(
		x + 2, 
		y + (height / 2) + 1, 
		Math.ceil(parseFloat(width - 4) * resource), 
		(height / 2) - 4
	    );
	},
	drawDebug: function(x, y) {
	    setFontSize(12);
	    g.fillStyle = "rgb(255,255,255)";
	    g.fillText("X: " + player.location.x + ",  Y: " + player.location.y, x, y);
	    g.fillText("Tile: " + map.getTile(player.location.x, player.location.y), x, y + 10);
	    g.fillText("FPS: " + Math.ceil(1000 / time) + " / " + fps, x, y +20);
	    
	    viewport.g.fillText("Abilities:", x, y + 50);
	    var count = 0;
	    for (var i in spells) {
		var spell = spells[i];
		if (player.target != null && spell.range <= player.distance(player.target)) {
		    viewport.g.fillStyle = "rgb(100,100,100)";
		} else if (player.resource.current < spell.cost) {
		    viewport.g.fillStyle = "rgb(0,0,255)";
		} else if (gameTime - spell.lastCast < spell.cooldown){
		    viewport.g.fillText("" + Math.round((spell.cooldown - (gameTime - spell.lastCast)) / 1000), x + 10, y + (count * 10) + 60);
		    viewport.g.fillStyle = "rgb(255,0,0)";
		} else {
		    viewport.g.fillStyle = "rgb(0,255,0)";
		}
		viewport.g.fillText(i, x + 30, y + (count * 10) + 60);
		count++;
	    }
	},
	drawSpellBar: function(x, y, width, height, spells) {
	    var count = 0;
	    for (var k in spells) {
		count++;
	    }
	    x -= (count * width) / 2;
	    for (var i in spells) {
		var spell =  spells[i];
		var lw = 5;
		g.lineWidth = lw;
		g.fillStyle = "rgb(150,255,150)";
		g.fillRect(x, y, width, height);
		g.strokeStyle = "rgb(0,0,0)";
		g.strokeRect(x, y, width, height);
		g.drawImage(spell.icon, x + lw, y + lw, width - (lw * 2), height - (lw * 2));
				
		if (player.target != null && spell.range <= player.distance(player.target)) { // Out of range
		    g.fillStyle = "rgba(255,0,0,0.5)";	
		    g.fillRect(x, y, width, height);
		} else if (player.resource.current < spell.cost) { // Not enough resource
		    g.fillStyle = "rgba(0,0,255,0.5)";
		    g.fillRect(x, y, width, height);
		} else if (gameTime - spell.lastCast < spell.cooldown){ // On cooldown
		    g.fillStyle = "rgba(100,100,100,0.5)";
		    g.fillRect(x, y, width, height);
		}
		if (gameTime - spell.lastCast < spell.cooldown) {
		    g.fillStyle = "rgb(255,255,255)";
		    this.setFontSize(40);
		    g.textAlign = "center";
		    g.textBaseline = "middle";
		    g.fillText(
			"" + Math.ceil((spell.cooldown - (gameTime - spell.lastCast)) / 1000), 
			x + (width / 2), 
			y + (height / 2)
		    );
		}
		
		x += width;
	    }
	},
	setFontSize: function(size) {
	    g.font = size + "pt Calibri";
	}
    };
}
