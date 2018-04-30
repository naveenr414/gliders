var grid = 0;
var turn = false;
var placed = 0;
var totalPlace = 3;
var colors = [0,"#FF0000","#0000FF"];

var size = 30;
var width = 800;
var height = 270;

var mouseX = 0;
var mouseY = 0;
var mousePress = false;
var socket = io();

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
				console.log("Here");
				c.fillStyle=colors[grid[y][x]];
				c.fillRect(size*x,size*y,size,size);
			}
		}
	}

	c.stroke();
}
if(turn){
	var gridX = Math.floor(mouseX/size);
	var gridY = Math.floor(mouseY/size);
	
	if(gridX<width/size && gridY<height/size)
	{
		c.fillStyle="#AAAAAA";
		c.fillRect(gridX*size,gridY*size,size,size);
				
		if(mousePress && grid[gridY][gridX] == 0)
		{
			grid[gridY][gridX] = 1;
			placed+=1;
			
			if(placed == totalPlace)
			{
				turn = false;
			}
		}	
	}
}

socket.on('grid',function(g){
	grid = g;
	drawGrid();
});