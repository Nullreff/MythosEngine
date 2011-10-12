Loader = {
	loadCount: 0,
	loadDone: false,
	
	setCallback: function(func) {
		
	},

	startLoad: function() {
		loadCount = 0;
		loadDone = false;
	},

	endLoad: function() {
		loadDone = true;
		if (loadCount == 0)
			runGame();
	},

	itemStart: function() {
		loadCount++;
	},

	itemEnd: function() {
		loadCount--;
		if (loadCount == 0 && loadDone)
			runGame();
	},
	
	generateMap: function(data) {
		var tileSize = parseInt($(data).find("tilesize").text());
		var spawn = {
			x: parseInt($(data).find("spawn").attr("x")),
			y: parseInt($(data).find("spawn").attr("y"))
		};
		var mapData = new Array();
		var NPCs = new Array();
		
		var rawMap = $.trim($(data).find("data").text()).split("\n");
		for (var i in rawMap) {
			mapData.push(rawMap[i].split(","));
		}
		
		$(data).find("npc").each(function(num, data) {
			var npc = new Entity($(data).attr("name"));
			npc.location.x = parseInt($(data).find("x").text());
			npc.location.y = parseInt($(data).find("y").text());
			npc.type = "npc";
			NPCs.push(npc);
		});
		
		var tileSet = $(data).find("tileset").text();
		var img = new Image();
		console.log("\t'" + tileSet + "'");
		Loader.itemStart();
		img.onload = function() {
			Loader.itemEnd();
		};
		img.src = tileSet;
		
		return new Map(tileSize, img, spawn, mapData, NPCs);
	},

};
