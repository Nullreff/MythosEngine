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
		var map = {
			tileSize: $(data).find("tilesize").text(),
			spawn: {
				x: parseInt($(data).find("spawn").attr("x")),
				y: parseInt($(data).find("spawn").attr("y"))
			},
			data: new Array(),
			NPCs: new Array()
		};
		
		var rawMap = $.trim($(data).find("data").text()).split("\n");
		for (var i in rawMap) {
			map.data.push(rawMap[i].split(","));
		}
		
		$(data).find("npc").each(function(num, data) {
			var npc = Loader.generateNPC(data);
			map.NPCs.push(npc);
		});
		
		var tileSet = $(data).find("tileset").text();
		var img = new Image();
		console.log("\t'" + tileSet + "'");
		Loader.itemStart();
		img.onload = function() {
			map.tileImg = this;
			Loader.itemEnd();
		};
		img.src = tileSet;
		
		return map;
	},

	generateNPC: function(data) {
		var npc = {
			type: "npc",
			name: $(data).attr("name"),
			x: $(data).find("x").text(),
			y: $(data).find("y").text(),
			size: 30,
			health: 100,
			maxHealth: 100,
			dead: false,
			color: "" + Math.floor(Math.random() * 999899) + 100
		};
		return npc;
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
