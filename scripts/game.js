/*
 * Castle
 * Written By: Ryan Mendivil (Nullreff)
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

// Mouse State
var mouseState = {
	x: 0,
	y: 0,
	left: false,
	right: false,
	middle: false,
	inside: false
};

// Data
loadCount = 0;

// Map
var map = {};

// Spells
var spells = {};

// Player
var player = new Entity("Player");
var viewport = null;
// Style
var font = "sans";
var fontsize = 16;

function startGame() {
	loadContent(runGame);
}

function loadContent(callback) {
	console.log("Loading Content...");
	
	var mapName = "data/map.xml";
	var spellsName = "data/spells.xml";
	
	var loader = new Loader(callback);
	
	loader.startLoad();
	console.log("Loading Maps...");
	console.log("\t'" + mapName + "' ");
	loader.itemStart();
	$.get(mapName, function(data) {
		map = loader.generateMap(data);
		player.location.x = map.spawn.x;
		player.location.y = map.spawn.y;
		loader.itemEnd();
	});
	
	
	loader.itemStart();
	$.get(spellsName, function(data) {
		console.log("Loading Spells...");
		$(data).find("spell").each(function(num, data) {
			var spell = loader.loadSpell(data);
			spells[spell.name] = spell;
			console.log("\t" + spell.name + ": " + spell.damage);
		});
		loader.itemEnd();
	});
	
	loader.endLoad();
}

function runGame() {
	// Graphics
	var g = document.getElementById('gameDisplay').getContext('2d');
	viewport = new Viewport(g, player.location.x, player.location.y, g.canvas.width, g.canvas.height);
	
	// Events
	$(window).keydown(keyDown_event);
	$(window).keyup(keyUp_event);
	$(window).keypress(keyPress_event);
	$("#gameDisplay").mousemove(mouseMove_event);
	$("#gameDisplay").mousedown(mouseDown_event);
	$("#gameDisplay").mouseup(mouseUp_event);
	
	// Player Config
	player.type = "player";
	
	// Start Game
	gameLoop = setInterval(updateGame, 1000/fps);
	console.log("Game Started");
}

function updateGame() {
	gameTime = new Date().getTime();
	var changeTime = gameTime - lastTime;
	lastTime = gameTime;
	
	// Update
	player.update(changeTime, map);
	$(map.NPCs).each(function(num, data) {
		data.update(changeTime, map);
	});
	viewport.update(player);
	map.draw(viewport);
	drawSpells(gameTime);
	drawUnits();
	drawUI(changeTime);
}

function keyDown_event(event) {
	switch (event.which) {
		case 37: // Left
		case 65:
			player.movement.x -= player.movement.x < 0 ? 0 : 1;
		break;
		case 39: // Right
		case 68:
			player.movement.x += player.movement.x > 0 ? 0 : 1;
		break;
		case 38: // Up
		case 87:
			player.movement.y -= player.movement.y < 0 ? 0 : 1;
		break;
		case 40: // Down
		case 83:
			player.movement.y += player.movement.y > 0 ? 0 : 1;
		break;
	}
}

function keyUp_event(event) {
	switch (event.which) {
		case 37: // Left
		case 65:
			player.movement.x += player.movement.x > 0 ? 0 : 1;
		break;
		case 39: // Right
		case 68:
			player.movement.x -= player.movement.x < 0 ? 0 : 1;
		break;
		case 38: // Up
		case 87:
			player.movement.y += player.movement.y > 0 ? 0 : 1;
		break;
		case 40: // Down
		case 83:
			player.movement.y -= player.movement.y < 0 ? 0 : 1;
		break;
	}
}

function keyPress_event(event) {
	switch (event.which) {
		case 49: // 1
			spells["Shoot"].cast(player, player.target);
		break;
		case 50: // 2
			spells["Punch"].cast(player, player.target);
		break;
		case 51: // 3
			spells["Lightning"].cast(player, player.target);
		break;
		
	}
}

function mouseMove_event(event) {
	mouseState.x = event.pageX - this.offsetLeft;
	mouseState.y = event.pageY - this.offsetTop;
}

function mouseDown_event(event) {
	updateMouse(event, true);
	if (mouseState.left)
	{
		var loc = viewport.worldLocation(mouseState.x, mouseState.y);
		var ent = map.entityAt(loc.x, loc.y);
		if (player.contains(loc.x, loc.y))
			ent = player;
		player.target = ent;
	}
}

function mouseUp_event(event) {
	updateMouse(event, false);
}

function updateKeyboard(event, type) {
	
}

function updateMouse(event, type) {
	
	switch (event.which) {
		case 1:
			mouseState.left = type;
		break;
		case 2:
			mouseState.middle = type;
		break;
		case 3:
			mouseState.right = type;
		break;
	}
	//console.log(event.which);
}

function tileCollision(tile) {
	return tile == 2;
}

function drawUnits() {
	for (var i in map.NPCs) {
		map.NPCs[i].draw(viewport, map.NPCs[i] == player.target);
	}
	
	player.draw(viewport,  player == player.target);
}

function drawSpells(gameTime) {
	for (var i in spells) {
		if (spells[i].lastCast + 200 >= gameTime)
			spells[i].draw(viewport, player, player.target);
	}
}

function drawUI(time) {
	viewport.UI.drawFrame(5, 5, 150, 50, player);
	if (player.target != null)
		viewport.UI.drawFrame(160, 5, 150, 50, player.target);
	viewport.UI.drawSpellBar(viewport.width / 2, viewport.height - 64, 64, 64, spells);
	
	// Cursor
	viewport.g.fillStyle = "rgb(0,0,0)";
	viewport.g.beginPath();
	viewport.g.arc(mouseState.x, mouseState.y, 5, 0, Math.PI * 2, true);
	viewport.g.closePath();
	viewport.g.fill();
}

function getRandomLoc(checkCol) {
	var val = {
		x: Math.floor(Math.random() * map.tileSize * map.data[0].length),
		y: Math.floor(Math.random() * map.tileSize * map.data.length)
	};
	while (map.getTile(val.x, val.y) == 2 && checkCol) {
		val.x = Math.floor(Math.random() * map.tileSize * map.data[0].length);
		val.y = Math.floor(Math.random() * map.tileSize * map.data.length);
	}
	return val;
}

function randomColor() {
	return "rgb(" + randomNumber(255) +  "," +  randomNumber(255) +  "," +  randomNumber(255) +  ")";
}

function randomNumber(max) {
	return Math.floor(Math.random() * (max + 1));
}
