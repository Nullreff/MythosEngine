function Spell(name, cooldown, damage, range, cost, icon) {
    this.name = name;
    this.damage = damage;
    this.range = range;
    this.cooldown = cooldown;
    this.lastCast = new Date().getTime() - cooldown;
    this.cost = cost;
    this.icon = icon;

    var counter = 0;
    var counterStart = 5;
    var spellCaster = null;
    var spellTarget = null;

    this.cast = function(viewport, caster, target) {
	if (target == null || target.dead) {
	    return 1;
	}

	if (caster.distance(target) <= this.range && 
	    gameTime - this.lastCast >= this.cooldown &&
	    caster.resource.current >= this.cost) 
	{
	    target.health.mod(this.damage);
	    caster.resource.mod(this.cost);
	    this.lastCast = gameTime;

	    spellCaster = caster;
	    spellTarget = target;
	    counter = counterStart;
	}
    };
    
    this.draw = function(viewport) {
	if (counter < 0) {
	    caster = null;
	    target = null;
	    return;
	}
	if (spellCaster == null || spellTarget == null) {
	    return;
	}

	var cLoc = viewport.screenLocationE(spellCaster);
	var tLoc = viewport.screenLocationE(spellTarget);
	
	var x = tLoc.x + (((cLoc.x - tLoc.x) / counterStart) * counter);
	var y = tLoc.y + (((cLoc.y - tLoc.y) / counterStart) * counter);
	viewport.g.fillStyle = "rgb(255,0,0)";
	viewport.g.beginPath();
	viewport.g.arc(x, y, 10, 0, Math.PI*2, false);
	viewport.g.stroke();
	counter--;
    };
}
