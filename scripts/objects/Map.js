function Map(tileSize, tileImg, spawn, data, NPCs) {
	this.tileSize = tileSize;
	this.tileImg = tileImg;
	this.spawn = spawn;
	this.data = data;
	this.NPCs = NPCs;
	this.width = data[0].length * tileSize;
	this.height = data.length * tileSize;
	
	this.draw = function(viewport) {
		for (var x = 0;x <= viewport.g.canvas.width + this.tileSize;x += this.tileSize) {
			for (var y = 0;y <= viewport.g.canvas.height + this.tileSize;y += this.tileSize) {
				var tile = this.getTile(x + viewport.x, y + viewport.y);
				var tx = (tile * this.tileSize) % tileImg.width;
				var ty = Math.floor((tile * this.tileSize) / tileImg.width) * this.tileSize;
				var finalX = x - (viewport.x > 0 ? viewport.x % this.tileSize : this.tileSize + (viewport.x % this.tileSize));
				var finalY = y - (viewport.y > 0 ? viewport.y % this.tileSize : this.tileSize + (viewport.y % this.tileSize));
				viewport.g.drawImage(tileImg, tx, ty, this.tileSize, this.tileSize, 
									finalX, finalY, this.tileSize, this.tileSize);
				//viewport.g.fillStyle = "rgb(255,255,255)";
				//viewport.g.fillText(tile, finalX + 5, finalY + 10);
			}
		}
	};
	
	this.getTile = function(x, y) {
		return (x >= this.width || y >= this.height || x < 0 || y < 0) ? 0 : parseInt(this.data[Math.floor(y / this.tileSize) ][Math.floor(x / this.tileSize)]);
	};
	
	
}