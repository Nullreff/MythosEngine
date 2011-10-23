function Spell(name, cooldown, damage, range, cost, icon) {
	this.name = name;
	this.damage = damage;
	this.range = range;
	this.cooldown = cooldown;
	this.lastCast = new Date().getTime() - cooldown;
	this.cost = cost;
	this.icon = icon;
	
	this.cast = function(caster, target) {
		if (target == null || target.dead)
			return 1;
		
		if (caster.distance(target) <= this.range && 
			gameTime - this.lastCast >= this.cooldown &&
			caster.resource.current >= this.cost) 
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
