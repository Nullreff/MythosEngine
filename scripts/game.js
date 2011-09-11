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
var player = new Entity(name);
var viewport = null;
// Style
var font = "sans";
var fontsize = 16;

function startGame() {
	loadContent();
}

function loadContent() {
	console.log("Loading Content...");
	
	var mapName = "data/map.xml";
	var spellsName = "data/spells.xml";
	
	Loader.startLoad();
	console.log("Loading Maps...");
	console.log("\t'" + mapName + "' ");
	Loader.itemStart();
	$.get(mapName, function(data) {
		map = Loader.generateMap(data);
		player.location.x = map.spawn.x;
		player.location.y = map.spawn.y;
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
	var g = document.getElementById('gameDisplay').getContext('2d');
	viewport = new Viewport(g, player.location.x, player.location.y, g.canvas.width, g.canvas.height);
	$(window).keydown(keyDown_event);
	$(window).keyup(keyUp_event);
	$(window).keypress(keyPress_event);
	player.type = "player";
	
	mapLines = $.trim(map.data).split("\n");
	sendMessage(player.x + "," + player.y);
	gameLoop = setInterval(updateGame, 1000/fps);
	console.log("Game Started");
}

function updateGame() {
	gameTime = new Date().getTime();
	var changeTime = gameTime - lastTime;
	lastTime = gameTime;
	player.update(changeTime, map);
	viewport.update(player);
	map.draw(viewport);
	drawUnits();
	drawUI(changeTime);
}

function keyDown_event(event) {
	switch (event.which) {
		case 37: // Left
			player.movement.x -= player.movement.x < 0 ? 0 : 1;
		break;
		case 39: // Right
			player.movement.x += player.movement.x > 0 ? 0 : 1;
		break;
		case 38: // Up
			player.movement.y -= player.movement.y < 0 ? 0 : 1;
		break;
		case 40: // Down
			player.movement.y += player.movement.y > 0 ? 0 : 1;
		break;
	}
}

function keyUp_event(event) {
	switch (event.which) {
		case 37: // Left
			player.movement.x += player.movement.x > 0 ? 0 : 1;
		break;
		case 39: // Right
			player.movement.x -= player.movement.x < 0 ? 0 : 1;
		break;
		case 38: // Up
			player.movement.y += player.movement.y > 0 ? 0 : 1;
		break;
		case 40: // Down
			player.movement.y -= player.movement.y < 0 ? 0 : 1;
		break;
	}
}

function keyPress_event(event) {
	switch (event.which) {
		case 49: // 1
			player.cast("shoot");
		break;
		case 50: // 2
			player.cast("punch");
		break;
		
	}
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
		map.NPCs[i].draw(viewport);
	}
	
	player.draw(viewport);
}

function getFill(playerName) {
	var red = parseInt(playerName.substr(0,2)) * 2;
	var green = parseInt(playerName.substr(2,2)) * 2;
	var blue = parseInt(playerName.substr(4,2)) * 2;
	return "rgb(" +  red + "," + green + "," + blue + ")";
}

function drawUI(time) {
	viewport.g.fillStyle = "rgb(255,255,255)";
	viewport.g.fillText("X: " + player.location.x + ",  Y: " + player.location.y, 5,10);
	viewport.g.fillText("Tile: " + map.getTile(player.location.x, player.location.y), 5, 20);
	viewport.g.fillText("FPS: " + Math.ceil(1000 / time) + " / " + fps, 5, 30);
	viewport.g.fillText("Viewport: X: " + viewport.x + "   Y: " + viewport.y, 5, 40);
	if (player.dead) {
		viewport.g.fillText("You player.dead", (width / 2) - 20, height / 2);
	}
	viewport.g.fillText("Abilities:", 5, 100);
	var count = 0;
	for (var i in spells) {
		var spell = spells[i];
		if (gameTime - spell.lastCast >= spell.cooldown) {
			viewport.g.fillStyle = "rgb(0,255,0)";
		} else {
			viewport.g.fillStyle = "rgb(255,0,0)";
			viewport.g.fillText("" + Math.round((spell.cooldown - (gameTime - spell.lastCast)) / 1000), 15, count * 10 + 50);
		}
		viewport.g.fillText(i, 35, count * 10 + 110);
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

function modMana(value, target) {
	//var newMana = target.cost.mana + value;
	//if (newMan
}

function die(target) {
	target.dead = true;
	setTimeout(resetDeathNotice, target == player ? 2000 : 200, target);
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
