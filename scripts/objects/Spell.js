function Spell(data) {
	var cd = parseInt($(data).find("cooldown").text());
	this.name = $(data).attr("name");
	this.damage = parseInt($(data).find("damage").text());
	this.range = parseInt($(data).find("range").text());
	this.cooldown = cd;
	this.lastCast = new Date().getTime() - cd;
	this.cost = $(data).find("cost").find("mana").text();
	
	this.cast = function(caster, target) {
		if (target == null)
			return 1;
		
		if (caster.distance(target) <= this.range && 
			gameTime - this.lastCast >= this.cooldown) 
		{
			target.health.mod(this.damage);
			caster.resource.mod(this.cost);
			this.lastCast = gameTime;
		}
	};
	
	this.draw = function(viewport, caster, target) {
		if (caster == null || target == null) {
			return;
		}
		var cLoc = viewport.screenLocationE(caster);
		var tLoc = viewport.screenLocationE(target);
		viewport.g.fillStyle = "rgb(255,0,0)";
		viewport.g.moveTo(cLoc.x,cLoc.y);
		viewport.g.lineTo(tLoc.x,tLoc.y);
		viewport.g.stroke();
	};
}