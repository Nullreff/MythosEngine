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
			npc.location.x = $(data).find("x").text();
			npc.location.y = $(data).find("y").text();
			npc.graphics.color = "" + Math.floor(Math.random() * 999899) + 100;
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

	generateSpell: function(data) {
		var cooldown = parseInt($(data).find("cooldown").text());
		var spell = {
			name: $(data).attr("name"),
			damage: parseInt($(data).find("damage").text()),
			range: parseInt($(data).find("range").text()),
			cooldown: cooldown,
			lastCast: new Date().getTime() - cooldown,
			cost: {
				mana: $(data).find("cost").find("mana").text()
			}
		};
		return spell;
	}

};
