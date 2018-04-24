var size = 30;
var width = 800;
var height = 270;
var lastTime = 0

var grid = [];
var stage = "Updating";
var ticks = 0;	
var movesPer = 5;

for(var i = 0;i<height/size;i++)
{
	var temp = []
	for(var j = 0;j<width/size;j++)
	{
		temp.push(0);
	}
	grid.push(temp);
}



grid[0] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
grid[1] = [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0];
grid[2] = [0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0];
grid[3] = [0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0];
grid[4] = [0,1,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0];
grid[5] = [0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0];
grid[6] = [0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0];
grid[7] = [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0];
grid[8] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var mouseX = 0;
var mouseY = 0;
var mousePress = false;
var blocksPlaced = 0;
var targetBlocks = 2;

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
	c.fillStyle="#000000";
	
	for(var y = 0;y<grid.length;y++)
	{
		for(var x = 0;x<grid.length;x++)
		{	
			if(grid[y][x]==1){
				c.fillRect(size*x,size*y,size,size);
			}
		}
	}

	c.stroke();
}

function update()
{
	var c = document.getElementById("mainCanvas").getContext("2d");
	c.clearRect(0, 0, width,height);
	
	if(stage=="Updating")
	{
		updateGrid();
		lastTime = new Date().getTime();
		stage = "Waiting";
	}
	else if(stage=="Waiting")
	{
		var time = new Date().getTime();
		if(time-lastTime>300)
		{
			ticks+=1;
			if(ticks>movesPer)
			{
				ticks = 0;
				stage = "Input";
			}
			else
			{
				stage = "Updating";
			}
		}
	}
	else if(stage=="Input")
	{
		var gridX = Math.floor(mouseX/size);
		var gridY = Math.floor(mouseY/size);
		
		if(gridX<width/size && gridY<height/size)
		{
			c.fillStyle="#AAAAAA";
			c.fillRect(gridX*size,gridY*size,size,size);
					
			if(mousePress && grid[gridY][gridX] == 0)
			{
				grid[gridY][gridX] = 1;
				blocksPlaced+=1;
				
				if(blocksPlaced == targetBlocks)
				{
					blocksPlaced = 0;
					stage = "Waiting";
					lastTime = new Date().getTime();
				}
			}	
		}
	}
	
	drawGrid();
	c.stroke();
}

function updateGrid()
{
	var newGrid = [];
	for(var i = 0;i<height/size;i++)
	{
		var temp = [];
		for(var j = 0;j<width/size;j++)
		{
			temp.push(0);
		}
		newGrid.push(temp);
	}

	for(var i = 0;i<newGrid.length;i++)
	{

		for(var j = 0;j<newGrid[0].length;j++)
		{
			var neighbors = 0;
			for(var xPlus = -1;xPlus<=1;xPlus++)
			{
				for(var yPlus = -1;yPlus<=1;yPlus++)
				{
					if(j+xPlus>=0 && j+xPlus<newGrid[0].length
					&& i+yPlus>=0 && i+yPlus<newGrid.length)
					{
						neighbors+=grid[i+yPlus][j+xPlus];
					}
				}
			}
			
			neighbors-=grid[i][j];
			
			if(grid[i][j]==0)
			{
				if(neighbors==3)
				{
					newGrid[i][j] = 1;
				}
				else
				{
					newGrid[i][j] = 0;
				}
			}
			else
			{
				if(neighbors==2 || neighbors==3)
				{
					newGrid[i][j] = 1;
				}
				else
				{
					newGrid[i][j] = 0;
				}
			}
		}
	}
		
	grid = newGrid.slice();
}

setInterval(update,20);
