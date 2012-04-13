function Interface(data) {
	var configData = $(data).find("config");
	var framesData = $(data).find("frames");
	var templatesData = $(data).find("templates");
	var res = {
		 x: configData.find("resolution").find("x").text(),
		 y: configData.find("resolution").find("y").text()
	 };
	
	this.config = {
		maxfps: configData.find("maxfps").text(),
		resolution: res
	};
	
	var templates = new Array();
	var elements = new Array();
	
	templatesData.children("template").each(function(num, data) {
		templates[$(data).attr("type")] = {
			width: $(data).attr("width"),
			height: $(data).attr("height")
		};
	});
	
	framesData.children("frame").each(function(num, data) {
		var type = $(data).attr("type");
		var entity = $(data).attr("entity");
		var width = $(data).attr("width") == undefined ? templates[type].width : $(data).attr("width");
		var height = $(data).attr("height") == undefined ? templates[type].height : $(data).attr("height");
		
		var x = 0;
		var y = 0;
		
		$(data).children("anchor").each(function(num, data) {
			var parent = {
				x: 0,
				y: 0,
				width: res.x,
				height: res.y
			};
			var from = $(data).attr("from");
			var to = $(data).attr("to");
			var offset = $(data).attr("offset") == undefined ? 0 : $(data).attr("offset");
			
			// Calculate X
			x = parent.x;
			if (from == "center") {
				x += parent.width / 2;
			} else if (from == "right") {
				x += parent.width;
			}
			if (to == "center") {
				x -= width / 2;
			} else if (to == "right") {
				x -= width;
			}
				
			// Calculate Y
			y = parent.y;
			if (from == "middle") {
				y += parent.height / 2;
			} else if (from == "bottom") {
				y += parent.width;
			}
			if (to == "center") {
				y -= height / 2;
			} else if (to == "bottom") {
				y -= height
			}
		});	
		
		elements.push({ x: x, y: y, entity: entity, type: type});
	});
	
	this.draw = function(viewport, player) {
		
	};
}
