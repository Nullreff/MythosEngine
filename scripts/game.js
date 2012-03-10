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


// Game State
var gameLoop = null;
var gameTime = new Date().getTime();
var lastTime = gameTime;
var fps = 20;

// Networking
var networkLoop = null;
var networkDelay = 500;

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
var loadCount = 0;

// Map
var map = {};

// Spells
var spells = {};

// Interface
var interface = {};

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
    var interfaceName = "data/UI.xml";
    
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
    
    loader.itemStart();
    $.get(interfaceName, function(data) {
	console.log("Loading UI...");
	interface = new Interface(data);
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
    togglePause();
    console.log("Game Started");
}

function togglePause() {
    if (gameLoop == null) {
	// Start the processes that update the game
	gameLoop = setInterval(updateGame, 1000/fps);
	networkLoop = setInterval(updateNetwork, networkDelay);
    } else {
	// Or stop them
	clearInterval(gameLoop);
	clearInterval(networkLoop);
	gameLoop = networkLoop = null;
	
	// And draw a "Game Paused" on the screen
	viewport.UI.setFontSize(40);
	viewport.g.fillStyle = "rgb(0,0,0)";
	viewport.g.textAlign = "center";
	viewport.g.textBaseline = "middle";
	viewport.g.fillText("Game Paused", viewport.width / 2, viewport.height / 2);
    }
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
    drawUnits();
    drawUI(changeTime);
    drawSpells();
}

function updateNetwork() {
    
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
	spells["Shoot"].cast(viewport, player, player.target);
	break;
    case 50: // 2
	spells["Punch"].cast(viewport, player, player.target);
	break;
    case 51: // 3
	spells["Lightning"].cast(viewport, player, player.target);
	break;		
    case 112: // p
	togglePause();
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

function drawUI(time) {
    viewport.UI.drawFrame(5, 5, 150, 50, player);
    if (player.target != null)
	viewport.UI.drawFrame(160, 5, 150, 50, player.target);
    viewport.UI.drawSpellBar(viewport.g.canvas.width / 2, viewport.g.canvas.height - 64, 64, 64, spells);
}

function drawSpells() {
    for (var i in spells) {
	spells[i].draw(viewport);
    }
}

function randomColor() {
    return "rgb(" + randomNumber(255) +  "," +  randomNumber(255) +  "," +  randomNumber(255) +  ")";
}

function randomNumber(max) {
    return Math.floor(Math.random() * (max + 1));
}
