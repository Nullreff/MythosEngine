console.log("Creating Client...");
var players = {};
var name = "" + Math.floor(Math.random() * 999899) + 100;

window.onload = function() {
    fitToWindow();
    $(window).resize(fitToWindow);
    startGame();
};

function fitToWindow() {
    var g = document.getElementById('gameDisplay').getContext('2d');
    var width = $(window).width() - 50;
    var height = $(window).height() - 50;
    $("#content").width(width);
    g.canvas.width = width;
    g.canvas.height = height;
}

