console.log("Creating Client...");
//var client = new APE.Client();
//var currentPipe;
var players = {};
var name = "" + Math.floor(Math.random() * 999899) + 100;

window.onload = function() {
	startGame();
	/*
	client.load();
	
	client.addEvent('load', this.start);
	client.addEvent('ready', this.ready);
    client.addEvent('multiPipeCreate', this.join);
    client.onRaw('move', this.rawMove);
    client.onRaw('data', this.rawData); 
    * */
};

function start() {
	//var name;
	//while (!name) {
	//	name = prompt("Whats your name?");
	//}
	
	// Random client
	
	client.core.start({"name":name});
	console.log("Connecting to Server with name '" + name + "'...");
}

function ready() {
	console.log('Your client is now connected');
	client.core.join('castle');
	
}

function join(pipe, options) {
	currentPipe = pipe;
	console.log('Joined channel "' + pipe.name + '"');
	console.log("Starting Game...");
	startGame();
}

function rawMove(params) {
	console.log("Det");
	var name = params.data.from.properties.name;
	players[name].pos.x = params.data.x;
	players[name].pos.y = params.data.y;
	console.log(params.data.x + "," + params.data.y);
}

function rawData(raw, pipe) {
	console.log("recived");
	var name = raw.data.from.properties.name;
	var msg = raw.data.msg.substring(1);
	var type = raw.data.msg.substring(0,1);
	if (type = "a") {
		if (msg.substring(0,6) == name) {
			damage(msg.substring(7));
		}
	}
}

function sendMessage(cmd, params) {
	//currentPipe.sendRaw(cmd, params);
	
}

