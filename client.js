var grid = 0;
var turn = false;
var placed = 0;
var totalPlace = 3;
var colors = [];

var size = 30;
var width = 300;
var height = 300;

var mouseX = 0;
var mouseY = 0;
var mousePress = false;
var socket = io();

var number = 0;

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

function drawGrid()
{
	var c = document.getElementById("mainCanvas").getContext("2d");	
	c.clearRect(0, 0, width,height);
	for(var y = 0;y<grid.length;y++)
	{
		for(var x = 0;x<grid.length;x++)
		{	
			if(grid[y][x]!=0){
				c.fillStyle=colors[grid[y][x]];
				c.fillRect(size*x,size*y,size,size);
			}
		}
	}

	c.stroke();
}

function checkInput()
{
	console.log(turn);
	if(turn)
	{
		drawGrid();
		var c = document.getElementById("mainCanvas").getContext("2d");	
		var gridX = Math.floor(mouseX/size);
		var gridY = Math.floor(mouseY/size);
		
		if(gridX<=width/size && gridY<=height/size)
		{
			c.fillStyle="#AAAAAA";
			c.fillRect(gridX*size,gridY*size,size,size);
					
			if(mousePress && grid[gridY][gridX] == 0)
			{
				grid[gridY][gridX] = number;
				placed+=1;
				socket.emit ('move',[gridY,gridX,number]);
				
				console.log(placed+" "+totalPlace);
				if(placed == totalPlace)
				{
					console.log("Done");
					turn = false;
				}
				
				console.log("Turn is "+turn);
				
			}	
		}
	}
}

socket.on('grid',function(g){
	grid = g;
	drawGrid();
	console.log("Grid recieved");
});

socket.on('color',function(c){

	colors = c;
	drawGrid();
});

socket.on('input', function(){
	turn = true;
});

socket.on('number', function(n){
	number = n;
});

setInterval(checkInput,20);