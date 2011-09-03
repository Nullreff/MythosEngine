/*
 * Castle
 * Written By: Ryan Mendivil
 * 
 * 
 * 
 * Credits:
 * doodle.js Javascript library - http://www.lamberta.org/doodle-js
 * jQuery Javascript library - http://jquery.com/
 * OGA Community Tileset: Nature - http://opengameart.org
 * 
 * 
 */


// Graphics
var display = null;

// Movement
var speed = 5,
	mLeft = 0,
	mRight = 0,
	mUp = 0,
	mDown = 0;

// Location
var xArea = 0,
	yArea = 0;

// Map
var map	= null,
	tileSize = 32;

doodle.ready(function () {
	display = doodle.createDisplay('#display', {width:600, height:400});
	
	// Keyboard listeners
	display.addListener(doodle.events.KeyboardEvent.KEY_DOWN, onKeyboardEvent);
	display.addListener(doodle.events.KeyboardEvent.KEY_UP, onKeyboardEvent);
	
	map = createMap().appendTo(display);
	
	// Player
	var player = createPlayer("#00FF00").appendTo(display);
	
	// Interface
	var underlay = createOverlay().appendTo(display);
	var	debug = doodle.createText("").appendTo(display);
	
	// Center player
	player.x = display.width / 2;
	player.y = display.height / 2;
	
	// Move Text
	debug.x = 2;
	debug.y = 10;
	
	//game loop
	display.on('animationFrame', function () {
		// Movement
		player.x += (mRight - mLeft) * speed;
		player.y += (mDown - mUp) * speed;
		
		// Wrap Around
		if (player.x > display.width) {
			player.x = 0;
			xArea++;
		} else if (player.x < 0) {
			player.x = display.width;
			xArea--;
		}
		if (player.y > display.height) {
			player.y = 0;
			yArea++;
		} else if (player.y < 0) {
			player.y = display.height;
			yArea--;
		}
		
		//map.x = -xArea * display.width;
		//map.y = -yArea * display.height;
		
		debug.text = "X: " + player.x + "  Y: " + player.y + "  xArea: " + xArea + "  yArea: " + yArea;
	});
	
	function onKeyboardEvent (event) {
		var num = (event.type == "keydown") ? 1 : 0;
		switch (event.keyCode) {
		case doodle.Keyboard.UP:
			mUp = num;
			break;
		case doodle.Keyboard.DOWN:
			mDown = num;
			break;
		case doodle.Keyboard.LEFT:
			mLeft = num;
			break;
		case doodle.Keyboard.RIGHT:
			mRight = num;
			break;
		}
	}
});


function createPlayer(color) {
  return doodle.createSprite(function () {
    this.graphics.lineStyle(2, "#000000", 1);
    this.graphics.beginFill(color);
    this.graphics.beginPath();
    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(13, 25);
    this.graphics.lineTo(15, 25);
    this.graphics.lineTo(2, -2);
    this.graphics.lineTo(2, -23);
    this.graphics.lineTo(13, -10);
    this.graphics.lineTo(15, -10);
    this.graphics.lineTo(2, -25);
    this.graphics.lineTo(2, -30);
    this.graphics.lineTo(-2, -30);
    this.graphics.lineTo(-2, -25);
    this.graphics.lineTo(-15, -10);
    this.graphics.lineTo(-13, -10);
    this.graphics.lineTo(-2, -23);
    this.graphics.lineTo(-2, -2);
    this.graphics.lineTo(-15, 25);
    this.graphics.lineTo(-13, 25); 
    this.graphics.closePath();
    this.graphics.endFill();
    this.graphics.circle(0, -35, 5);
  });
}

function createOverlay() {
  return doodle.createSprite(function () {
    this.graphics.lineStyle(2, "#000000", 1);
    this.graphics.beginFill("#FFFFFF");
    this.graphics.beginPath();
    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(165, 0);
	this.graphics.lineTo(165, 20);
	this.graphics.lineTo(0, 20);
    this.graphics.closePath();
    this.graphics.endFill();
  });
}

function createMap() {
	return doodle.createImage(function() {
		for (var x = 0;x < display.width;x += tileSize) {
			for (var y = 0;y < display.height;y += tileSize) {
				drawTile(x, y, this);
			}
		}
	});
}

function drawTile(x, y, sprite) {
	sprite.graphics.draw(function(context) {
		var mapImg = new Image();
		mapImg.src = "images/tiles.png";
		mapImg.addEventListener('load', function () {
			context.drawImage(mapImg, 0, 0, tileSize, tileSize, x, y, tileSize, tileSize);
		});
	});
}

