var app = require('express')();
var express = require("express");
var http = require('http').Server(app);
var io = require('socket.io')(http);

var colors = [0,"#FF0000","#0000FF"];
var inputRecieved = [];
var totalInput = 3;
var stage = "Update";
var grid = [];

var lastTime = 0;
var stage = "Updating";
var ticks = 0;
var updatesPer = 5;

inputRecieved.push(totalInput);

for(var i = 0;i<10;i++)
{
	var temp = [];
	for(var j = 0;j<10;j++)
	{
		temp.push(Math.floor(Math.random()*3));
	}
	grid.push(temp);
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use('/', express.static(__dirname + '/'));

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.emit("number",inputRecieved.length);
  inputRecieved.push(0);
 
  io.emit('color',colors);
  
  socket.on('move', function(info){
	console.log("Move "+info);
	if(inputRecieved[info[2]]!=totalInput && grid[info[0]][info[1]]==0)
	{
		grid[info[0]][info[1]] = info[2];
		io.emit("grid",grid);
		inputRecieved[info[2]]+=1;
	}
	});
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});

function update()
{
	if(stage=="Updating")
	{
		console.log("Made a move");
		updateGrid();
		ticks+=1;
		lastTime = new Date().getTime();
		stage = "Waiting";
		io.emit("grid",grid);
	}
	else if(stage=="Waiting")
	{
		var time = new Date().getTime();
		if(time-lastTime>1000)
		{
			if(ticks == updatesPer)
			{
				ticks = 0;
				io.emit("input");
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
		var done = true;
		for(var i = 0;i<inputRecieved.length;i++)
		{
			done&=inputRecieved[i]==totalInput;
		}
		
		
		if(done)
		{
			stage = "Waiting";
			lastTime = new Date().getTime();
			for(var i = 0;i<inputRecieved.length;i++)
			{
				inputRecieved[i] = 0;
			}
			inputRecieved[0] = totalInput;
		}
	}
}

function updateGrid()
{
	var newGrid = [];
	for(var i = 0;i<grid.length;i++)
	{
		var temp = [];
		for(var j = 0;j<grid[0].length;j++)
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
						neighbors+=grid[i+yPlus][j+xPlus]==grid[i][j];
					}
				}
			}
			
			neighbors-=grid[i][j]>0;
			
			if(grid[i][j]==0)
			{
				if(neighbors==3)
				{
					newGrid[i][j] = grid[i][j];
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
					newGrid[i][j] = grid[i][j];
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


