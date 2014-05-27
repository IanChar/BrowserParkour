
//****************** PLAYER ************************
function Player() {
	//Player Variables
	var playerState = 0;

	//Player methods

	//_Player accessors 
	this.getPlayerState = function() {
		return playerState;
	}
}
//****************** OBSTACLES ************************
function Obstacle(obstType) {
	//Obstacle Variables
	var type = obstType; //0 is for low 1 is for high 
	var x = 300;

	//Obstacle Methods
	this.updateX = function(xVel) {
		x = x - xVel;
	}

	//Obstacle accessors 
	this.getType = function(){
		return type;
	}

	this.getX = function() {
		return x;
	}
}


//********************* VARIABLES ***************************
var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");

//Game Variables
var speedLvl = 1;
var score = 0;
var playerState = 0; //0 for standing, 1 for ducking, 2 for jumping 
var initialized = false; // Tells if the game is running or not 
var obstacleArray = [];

//Constants
var SPACE = 32;
var DOWN = 40;
var ENTER = 13;
var SCREEN_HEIGHT = 150;
var SCREEN_WIDTH = 300;
var PLAYER_HEIGHT = 30;
var PLAYER_WIDTH = 15;
var OBSTACLE_DIMENSION = 23;

//****************** HELPER FUNCTIONS ***************************

var startNewGame = function() {

}

var update = function() {
	for(var i = 0; i < obstacleArray.length; i++)
	{
		obstacleArray[i].updateX(speedLvl * 3);
	}
}

var draw = function() {
	//resets the canvas
	canvas.width = canvas.width;

	//Draw the ground
	ctx.fillStyle = "#00FF00";
	ctx.fillRect(0, SCREEN_HEIGHT - 10, SCREEN_WIDTH, 10);

	//Draw the player
	ctx.fillStyle = "black";
	ctx.fillRect(50, SCREEN_HEIGHT - 10 - PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT);

	//Draw obstacles
	for(var i = 0; i < obstacleArray.length; i++)
	{
		if(obstacleArray[i].getType() === 0)
		{
			ctx.fillStyle = "red";
			ctx. fillRect(obstacleArray[i].getX(), SCREEN_HEIGHT - 10 - OBSTACLE_DIMENSION, OBSTACLE_DIMENSION, OBSTACLE_DIMENSION);
		}
		else
		{
			ctx.fillStyle = "blue";
			ctx. fillRect(obstacleArray[i].getX(), SCREEN_HEIGHT - 10 - OBSTACLE_DIMENSION * 2, OBSTACLE_DIMENSION, OBSTACLE_DIMENSION);
		}
	}
	
}

var loop = function() {
	update();
	draw();
}

//******************* MAIN ********************************
var main = function(){
	var low = new Obstacle(0);
    var high = new Obstacle(1);
	obstacleArray.push(low); obstacleArray.push(high);
	var interval = setInterval(loop, 50);
}

main();

