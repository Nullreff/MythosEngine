var app = require('http').createServer(handler),
io = require('socket.io').listen(app),
fs = require('fs');

app.listen(8080);

function handler(req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
	if (err) {
	    res.writeHead(500);
	    return res.end('Error loading index.html');
	}
	
	res.writeHead(200);
	res.end(data);
    });
}

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
	console.log(data);
    });
});

/*
var net = require("net");
var server = net.createServer(NewConnection);
server.listen(1337, "127.0.0.1");

var players = { };
var sockets = Array();
var currentId = 0;

function NewConnection(socket) {
    socket.setEncoding('ascii');
    sockets[sockets.length] = socket;
    // Status:
    // 0 = Not Connected
    // 1 = Connected
    var status = 0;
    var playerId;

    // They send data to us
    socket.on("data", function(data) {
	var reply = JSON.parse(data);

	switch (status)
	{
	case 0:
	    playerId = currentId++;
	    players[playerId] = {
		id: playerId,
		name: reply.name
	    };
	    status = 1;
	    replyUpdate(socket, players[playerId]);
	    
	    break;
	case 1:
	    players[playerId] = reply;
	    for (var i = 0; i < sockets.length; i++) {
		if (sockets[i] != socket)
		    replyUpdate(sockets[i], reply);
	    }
	    break;
	}
    });
}

function replyError(socket, msg) {
    socket.write(JSON.stringify({error: msg}));
}

function replyUpdate(socket, entity) {
    socket.write(JSON.stringify(entity));
}
*/