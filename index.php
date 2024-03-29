<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="css/default.css" />
    <script type="text/javascript" src="scripts/jquery.js"></script>
    <script type="text/javascript" src="scripts/objects/Loader.js"></script>
    <script type="text/javascript" src="scripts/objects/Entity.js"></script>
    <script type="text/javascript" src="scripts/objects/Map.js"></script>
    <script type="text/javascript" src="scripts/objects/Viewport.js"></script>
    <script type="text/javascript" src="scripts/objects/Spell.js"></script>
    <script type="text/javascript" src="scripts/objects/Interface.js"></script>
    <script type="text/javascript" src="scripts/game.js"></script>
    <script type="text/javascript" src="scripts/default.js"></script>
    <title>Ravaged Mythos</title>
  </head>
  <body>
    <div id="content">
      <canvas id="gameDisplay" width="800" height="600"></canvas>
    </div>
    <a onclick="$('#help').slideToggle();">Show/Hide Help</a>
    <div id="help" style="display:none;">
      <p>
	Move using wsad or arrow keys.<br />
	Target things by clicking on them.<br />
	Cast spells using the number keys.<br />
	Have fun :D
      </p>
    </div>
  </body>
</html>
