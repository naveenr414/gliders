var size = 30;
var width = 600;
var height = 600;

var grid = [];

for(var i = 0;i<height/size;i++)
{
	var temp = []
	for(var j = 0;j<width/size;j++)
	{
		temp.push(Math.round(Math.random()));
	}
	grid.push(temp);
}

var c = document.getElementById("mainCanvas").getContext("2d");

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