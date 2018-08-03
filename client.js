/* Says which player played down a block at each position on the grid */
var grid = [];
var playerNumber = 0;

/* Block color for each player */ 
var colors = [];

var turn = false;
var blocksPlaced = 0;
const maxBlocksPlaced = 3;

const blockSize = 30;
const width = 300;
const height = 300;
const blocksHorizontal = width/blockSize;
const blocksVertical = height/blockSize

const hoverColor = "AAAAAA";

var mouseX = 0;
var mouseY = 0;
var mousePress = false;

var socket = io();


/*Update the status of the mouse*/
$(document).mousemove(function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
}).mouseover(); 

$(document).mousedown(function(e){
	mousePress=true;
});

$(document).mouseup(function(e){
	mousePress=false;
});

function drawBlock(var gridX, var gridY, var c){
	var startX = blockSize*x;
	var startY = blockSize*y;
	c.fillRect(gridX*blockSize,gridY*blockSize,blockSize,blockSize);
}

function drawGrid(){
	var c = document.getElementById("mainCanvas").getContext("2d");	
	c.clearRect(0, 0, width,height);
	
	for(var y = 0;y<grid.length;y++){
		for(var x = 0;x<grid.length;x++){	
			/* Draw non-empty blocks */ 
			if(grid[y][x]!=0){
				c.fillStyle=colors[grid[y][x]];
				drawBlock(x,y,c);
			}
		}
	}

	c.stroke();
}

function checkInput(){
	if(turn){
		var c = document.getElementById("mainCanvas").getContext("2d");	
		drawGrid();
		
		/* Convert mouse position to grid position */ 
		var gridX = Math.floor(mouseX/blockSize);
		var gridY = Math.floor(mouseY/blockSize);

		var gridFree = grid[gridY][gridX]==0;
		if(gridX<=blocksHorizontal && gridY<=blocksVertical && gridFree){
			/* Draw a block where we're hovering*/ 
			c.fillStyle=hoverColor;
			drawBlock(gridX,gridY,c);
			
			if(mousePress){
				grid[gridY][gridX] = number;
				blocksPlaced+=1;
				socket.emit ('move',[gridY,gridX,number]);
				
				if(blocksPlaced == maxBlocksPlaced){
					turn = false;
				}				
			}	
		}
	}
}

socket.on('gridUpdate',function(g){
	grid = g;
	drawGrid();
});

/* We recieve what this player's block color is */ 
socket.on('color',function(c){
	colors = c;
	drawGrid();
});

socket.on('input', function(){
	turn = true;
});

/* We recieve what this player's number is */ 
socket.on('playerNumber', function(n){
	playerNumber = n;
});

setInterval(checkInput,20);