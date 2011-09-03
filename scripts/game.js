/*
 * Castle
 * Written By: Ryan Mendivil
 * 
 * 
 * 
 * Credits:
 * jQuery Javascript library - http://jquery.com/
 * OGA Community Tileset: Nature - http://opengameart.org
 * 
 * 
 */


// Graphics
var g = null;
var width, heigth;
var gameLoop = null;
var fps = 20;
var gameTime = new Date().getTime();
var lastTime = gameTime;

// Data
loadCount = 0;

// Map
var map = {};

// Spells
var spells = {};

// Player
var player = {};
player.size = 30;
player.health = 100;
player.maxHealth = 100;
player.mana = 100;
player.maxMana = 100;
player.target = null;
player.color = name;

// Movement
player.moveHorz = 0;
player.moveVert = 0;
player.speed = 100;

// UI
player.dead = false;

// Style
var font = "sans";
var fontsize = 16;

function startGame() {
	g = document.getElementById('gameDisplay').getContext('2d');
	$(window).keydown(keyDown_event);
	$(window).keyup(keyUp_event);
	$(window).keypress(keyPress_event);
	width = g.canvas.width;
	height = g.canvas.height;
	player.type = "player";
	player.x = Math.floor(width / 2);
	player.y = Math.floor(height / 2);
	loadContent();
}

function loadContent() {
	console.log("Loading Content...");
	
	var mapName = "data/map.xml";
	var spellsName = "data/spells.xml";
	
	Loader.startLoad();
	
	console.log("\t'" + mapName + "' ");
	Loader.itemStart();
	$.get(mapName, function(data) {
		map = Loader.generateMap(data);
		player.x = map.spawn.x;
		player.y = map.spawn.y;
		Loader.itemEnd();
	});
	
	
	Loader.itemStart();
	$.get(spellsName, function(data) {
		console.log("Loading Spells...");
		$(data).find("spell").each(function(num, data) {
			var spell = Loader.generateSpell(data);
			spells[spell.name] = spell;
			console.log("\t" + spell.name + ": " + spell.damage);
		});
		Loader.itemEnd();
	});
	
	Loader.endLoad();
}

function runGame() {
	mapLines = $.trim(map.data).split("\n");
	sendMessage(player.x + "," + player.y);
	gameLoop = setInterval(updateGame, 1000/fps);
	console.log("Game Started");
}

function updateGame() {
	gameTime = new Date().getTime();
	var changeTime = gameTime - lastTime;
	lastTime = gameTime;
	movePlayer(changeTime);
	drawMap();
	drawUnits();
	drawUI(changeTime);
}

function keyDown_event(event) {
	switch (event.which) {
		case 37: // Left
			player.moveHorz -= player.moveHorz < 0 ? 0 : 1;
		break;
		case 39: // Right
			player.moveHorz += player.moveHorz > 0 ? 0 : 1;
		break;
		case 38: // Up
			player.moveVert -= player.moveVert < 0 ? 0 : 1;
		break;
		case 40: // Down
			player.moveVert += player.moveVert > 0 ? 0 : 1;
		break;
	}
}

function keyUp_event(event) {
	switch (event.which) {
		case 37: // Left
			player.moveHorz += player.moveHorz > 0 ? 0 : 1;
		break;
		case 39: // Right
			player.moveHorz -= player.moveHorz < 0 ? 0 : 1;
		break;
		case 38: // Up
			player.moveVert += player.moveVert > 0 ? 0 : 1;
		break;
		case 40: // Down
			player.moveVert -= player.moveVert < 0 ? 0 : 1;
		break;
	}
}

function keyPress_event(event) {
	switch (event.which) {
		case 49: // 1
			cast("shoot");
		break;
		case 50: // 2
			cast("punch");
		break;
		
	}
}

function movePlayer(time) {
	var len = Math.sqrt((player.moveHorz * player.moveHorz) + (player.moveVert * player.moveVert));
	if (len > 0 && !player.dead) {
		var moveX = (player.moveHorz / len) * (player.speed * time / 1000);
		var moveY = (player.moveVert / len) * (player.speed * time / 1000);
		var playerXTile = getTile(Math.ceil((player.x + moveX) / map.tileSize), Math.ceil(player.y / map.tileSize));
		var playerYTile = getTile(Math.ceil(player.x / map.tileSize), Math.ceil((player.y + moveY) / map.tileSize));
		var playerTile = getTile(Math.ceil(player.x / map.tileSize), Math.ceil(player.y / map.tileSize));
		if (!tileCollision(playerXTile) || tileCollision(playerTile)) {
			player.x += moveX;
		}
		if (!tileCollision(playerYTile) || tileCollision(playerTile)) {
			player.y += moveY;
		}
		if (!tileCollision(playerXTile) || !tileCollision(playerYTile)) {
			var params = {
				x: player.x,
				y: player.y
			}
			sendMessage("move",params);
		}
	}
}

function drawMap() {
	var midX = player.x - (width / 2);
	var midY = player.y - (height / 2); 	
	var offX = midX > 0 ? Math.floor(midX / map.tileSize) : Math.ceil(midX / map.tileSize);
	var offY = midY > 0 ? Math.floor(midY / map.tileSize) : Math.ceil(midY / map.tileSize);
	for (var x = 0;x <= Math.ceil(width/map.tileSize) + 1;x++) {
		for (var y = 0;y <= Math.ceil(height/map.tileSize) + 1;y++) {
			var tile = getTile(x + offX, y + offY);
			var tx = (tile * map.tileSize) % map.tileImg.width;
			var ty = Math.floor((tile * map.tileSize) / map.tileImg.width) * map.tileSize;
			var finalX = (x * map.tileSize) - (midX % map.tileSize) - map.tileSize;
			var finalY = (y * map.tileSize) - (midY % map.tileSize) - map.tileSize;
			g.drawImage(map.tileImg, tx, ty, map.tileSize, map.tileSize, 
						finalX, finalY, map.tileSize, map.tileSize);
		}
	}
}

function getTile(x,y) {
	return (x >= map.data[0].length || y >= map.data.length || x < 0 || y < 0) ? 0 : parseInt(map.data[y][x]);
}

function tileCollision(tile) {
	return tile == 2;
}

function drawUnits() {
	/*for (var i in players) {
		var x = players[i].pos.x;
		var y = players[i].pos.y;
		//drawUnit(x, y, i);
	}*/
	
	for (var i in map.NPCs) {
		drawUnit(map.NPCs[i]);
	}
	
	drawUnit(player);
}

function drawUnit(unit) {
	if (Math.abs(unit.x - player.x) < (width / 2) + (player.size / 2) && 
		Math.abs(unit.y - player.y) < (height / 2) + (player.size / 2)) {
		
		var health = unit.health / unit.maxHealth;
		var resource = unit.mana / unit.maxMana;
		
		// Unit
		g.fillStyle = getFill(unit.color);
		g.fillRect((width / 2) - (unit.size / 2) - (player.x - unit.x), (height / 2) - (unit.size / 2) - (player.y - unit.y), unit.size, unit.size);
		
		// Bars
		// Background
		g.fillStyle = "rgb(0,0,0)";
		g.fillRect((width / 2) - (unit.size / 2) - (player.x - unit.x), (height / 2) - (unit.size / 2) - (player.y - unit.y) - 12, unit.size, 10);
		// Health
		g.fillStyle = "rgb(" + parseInt(255 - (255.0 * health)) + "," + parseInt(255.0 * health) + ",0)";
		g.fillRect((width / 2) - (unit.size / 2) - (player.x - unit.x) + 1, (height / 2) - (unit.size / 2) - (player.y - unit.y) - 11, Math.ceil(parseFloat(unit.size - 2) * health), 5);
		// Resource
		g.fillStyle = "rgb(0,0,255)";
		g.fillRect((width / 2) - (unit.size / 2) - (player.x - unit.x) + 1, (height / 2) - (unit.size / 2) - (player.y - unit.y) - 5, Math.ceil(parseFloat(unit.size - 2) * resource), 2);
	}
}

function getFill(playerName) {
	var red = parseInt(playerName.substr(0,2)) * 2;
	var green = parseInt(playerName.substr(2,2)) * 2;
	var blue = parseInt(playerName.substr(4,2)) * 2;
	return "rgb(" +  red + "," + green + "," + blue + ")";
}

function drawUI(time) {
	g.fillStyle = "rgb(255,255,255)";
	g.fillText("X: " + player.x + ",  Y: " + player.y, 5,10);
	g.fillText("Tile: " + getTile(Math.ceil(player.x / map.tileSize), Math.ceil(player.y / map.tileSize)), 5, 20);
	g.fillText("FPS: " + Math.ceil(1000 / time) + " / " + fps, 5, 30);
	if (player.dead) {
		g.fillText("You player.dead", (width / 2) - 20, height / 2);
	}
	g.fillText("Abilities:", 5, 40);
	var count = 0;
	for (var i in spells) {
		var spell = spells[i];
		if (gameTime - spell.lastCast >= spell.cooldown) {
			g.fillStyle = "rgb(0,255,0)";
		} else {
			g.fillStyle = "rgb(255,0,0)";
			g.fillText("" + Math.round((spell.cooldown - (gameTime - spell.lastCast)) / 1000), 15, count * 10 + 50);
		}
		g.fillText(i, 35, count * 10 + 50);
		count++;
	}
	
}

function getTarget(range) {
	var currDist = range;
	var num = -1;
	for (var i in map.NPCs) {
		var dist = Math.sqrt(Math.pow(map.NPCs[i].x - player.x, 2) + Math.pow(map.NPCs[i].y - player.y, 2));
		if (dist < currDist) {
			currDist = dist;
			num = i;
		}
	}
	return num;
}

function cast(spellName) {
	var spell = spells[spellName];
	var num = getTarget(spell.range);
	if (num != -1 && 
		gameTime - spell.lastCast >= spell.cooldown) 
	{
		modHealth(-spells[spellName].damage, map.NPCs[num]);
		spell.lastCast = gameTime;
	}
}

function modAttr(value, target) {
	var newHealth = target.health + value;
	if (newHealth > target.maxHealth) {
		target.health = target.maxHealth;
	} else if (newHealth <= 0 && !target.dead) {
		target.health = 0;
		die(target);
	} else if (newHealth <= 0) {
		target.health = 0;
	} else {
		target.health = newHealth;
	}
}

function modMana(value, target) {
	var newMana = target.cost.mana + value;
	//if (newMan
}

function die(target) {
	target.dead = true;
	var temp = setTimeout(resetDeathNotice, target == player ? 2000 : 200, target);
}

function resetDeathNotice(target) {
	console.log("Respawned");
	target.dead = false;
	if (target.type == "player") {
		target.x = map.spawn.x;
		target.y = map.spawn.y;
	} else if (target.type == "npc") {
		var loc = getRandomLoc(true);
		target.x = loc.x;
		target.y = loc.y;
	}
	target.health = target.maxHealth;
}

function getRandomLoc(checkCol) {
	var val = {
		x: Math.floor(Math.random() * map.tileSize * map.data[0].length),
		y: Math.floor(Math.random() * map.tileSize * map.data.length)
	};
	while (tileCollision(getTile(val.x, val.y)) && checkCol) {
		val.x = Math.floor(Math.random() * map.tileSize * map.data[0].length);
		val.y = Math.floor(Math.random() * map.tileSize * map.data.length);
	}
	return val;
}
