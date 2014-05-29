/*
Author: Ian Char
Date: 5/26/2014
*/

//****************** PLAYER ************************
function Player() {
	//Player Variables
	var playerState = 0; //0 for running, 1 for sliding, 2 for jumping
	var y = 0;
	var yVel = 0;
	var inAir = false;

	//Player methods
	this.duck = function() {
		if(playerState === 0)
			playerState = 1;
	}

	this.standUp = function() {
		playerState = 0;
		y = 0;
		yVel = 0;
		inAir = false;
	}

	this.jump = function() {
		inAir = true;
		yVel = INIT_Y_VEL;
		playerState = 2;
	}

	this.setY = function(newY) {
		y = newY;
	}

	this.changeYVel = function() {
		yVel -= Y_ACCELERATION;
	}

	//_Player accessors 
	this.getPlayerState = function() {
		return playerState;
	}

	this.getY = function() {
		return y;
	}

	this.getInAir = function() {
		return inAir;
	}

	this.getYVel = function() {
		return yVel;
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
var initialized = false; // Tells if the game is running or not 
var player = new Player();
var obstacleArray = [];

//Constants
var SPACE = 32;
var DOWN = 40;
var ENTER = 13;
var SCREEN_HEIGHT = 150;
var SCREEN_WIDTH = 300;
var PLAYER_HEIGHT = 30;
var PLAYER_WIDTH = 17;
var PLAYER_DUCK_HEIGHT = 20;
var PLAYER_DUCK_WIDTH = 25;
var LOW_OBSTACLE_HEIGHT = 20;
var LOW_OBSTACLE_WIDTH = 15;
var HIGH_OBSTACLE_HEIGHT = 40;
var HIGH_OBSTACLE_WIDTH = 15;
var Y_ACCELERATION = 7;
var INIT_Y_VEL = 27;

//****************** HELPER FUNCTIONS ***************************
var startNewGame = function() {
	initialized = true;
	obstacleArray.splice(0, obstacleArray.length);
}

var spawnObstacles = function(authorized) {
	if(authorized)
	{
		if(obstacleArray.length == 0 || obstacleArray[obstacleArray.length - 1].getX() < (SCREEN_WIDTH - 100))
		{
			if(Math.random() <= 0.34)
			{
				obstacleArray.push(new Obstacle(Math.floor(2 * Math.random())));
			}
		}
	}
}

var checkForCollision = function() {
	for(var i = 0; i < obstacleArray.length; i++)
	{

		switch(obstacleArray[i].getType())
		{
			
			case 0:
				if((player.getPlayerState() == 1 && !(obstacleArray[i].getX() <= (47 - LOW_OBSTACLE_WIDTH))) || (player.getPlayerState() != 1 && !(obstacleArray[i].getX() <= (50 - LOW_OBSTACLE_WIDTH))))	
				{
					if(player.getPlayerState() == 1 && obstacleArray[i].getX() <= (47 + PLAYER_DUCK_WIDTH))
						return true;
					else if(player.getPlayerState() != 1 && obstacleArray[i].getX() <= (50 + PLAYER_WIDTH))
					{
						if(player.getPlayerState() == 0)
							return true;
						else if(player.getY() <= LOW_OBSTACLE_HEIGHT)
							return true;
					}
				}	
				break;
			

			case 1:
				if((player.getPlayerState() == 1 && !(obstacleArray[i].getX() <= (47 - HIGH_OBSTACLE_WIDTH))) || (player.getPlayerState() != 1 && !(obstacleArray[i].getX() <= (50 - HIGH_OBSTACLE_WIDTH))))	
				{
					if(player.getPlayerState() != 1 && obstacleArray[i].getX() <= (50 + PLAYER_WIDTH))
						return true;
				}	
				break;
		}	
	}

	return false;
}

var update = function() {
	
	//Obstacle Logic
	for(var i = 0; i < obstacleArray.length; i++)
	{
		obstacleArray[i].updateX(speedLvl + 9);
		if(obstacleArray[i].getX() <= (47 - HIGH_OBSTACLE_WIDTH))
			score++;
	}

	while(obstacleArray.length >= 1 && obstacleArray[0].getX() <= -50)
	{
		obstacleArray.shift();
	}

	//Player Logic
	if(player.getInAir())
	{
		player.setY(player.getY() + player.getYVel());
		player.changeYVel();
	}

	//Check for collisions
	if(checkForCollision())
	{
		initialized = false;
	}

	spawnObstacles(true);
}

var draw = function() {
	//resets the canvas
	canvas.width = canvas.width;

	//Draw the ground
	ctx.fillStyle = "#00FF00";
	ctx.fillRect(0, SCREEN_HEIGHT - 10, SCREEN_WIDTH, 10);

	//Draw the player
	ctx.fillStyle = "black";
	switch(player.getPlayerState())
	{
		case 0:
			ctx.fillRect(50, SCREEN_HEIGHT - 10 - PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT);
			break;
		case 1:
			ctx.fillRect(47, SCREEN_HEIGHT - 10 - PLAYER_DUCK_HEIGHT, PLAYER_DUCK_WIDTH, PLAYER_DUCK_HEIGHT);
			break;
		case 2:
			ctx.fillRect(50, SCREEN_HEIGHT - 10 - PLAYER_HEIGHT - player.getY(), PLAYER_WIDTH, PLAYER_HEIGHT);
			break;
	}
	
	

	//Draw obstacles
	for(var i = 0; i < obstacleArray.length; i++)
	{
		if(obstacleArray[i].getType() === 0)
		{
			ctx.fillStyle = "red";
			ctx. fillRect(obstacleArray[i].getX(), SCREEN_HEIGHT - 10 - LOW_OBSTACLE_HEIGHT, LOW_OBSTACLE_WIDTH, LOW_OBSTACLE_HEIGHT);
		}
		else
		{
			ctx.fillStyle = "blue";
			ctx. fillRect(obstacleArray[i].getX(), SCREEN_HEIGHT - 10 - HIGH_OBSTACLE_HEIGHT - 22, HIGH_OBSTACLE_WIDTH, HIGH_OBSTACLE_HEIGHT);
		}
	}
	
}

var loop = function() {
	if(initialized)
	{
		update();
	}
	draw();
}

function keyDown(e) {
	switch(e.keyCode)
	{
		case ENTER:
			startNewGame();
			break;
		case DOWN:
			if(player.getPlayerState() === 0 && initialized)
			{
				player.duck();
				setTimeout(player.standUp, 400);
			}	
			break;
		case SPACE:
			if(player.getPlayerState() === 0 && initialized)
			{
				player.jump();
				setTimeout(player.standUp, 400);
			}	
			break;	
	} 
}

//******************* MAIN ********************************
var main = function(){
	var interval = setInterval(loop, 50);

}

main();

