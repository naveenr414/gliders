var app = require('express')();
var express = require("express");
var http = require('http').Server(app);
var io = require('socket.io')(http);

const updatesPer = 5;
const maxBlocksPlaced = 3;
const gridSize = 10;
const timeBetweenUpdates = 1000;

var colors = [0,"#FF0000","#0000FF"];
var blocksPlaced = [maxBlocksPlaced];
var grid = [];

//Three stages: Updating, Waiting and Input 
var stage = "Updating";
var lastTimeUpdated = 0;
var totalUpdates = 0;
var numPlayers = 0;

function initGrid(){
	var g = [] 
	for(var i = 0;i<gridSize;i++){
		var temp = [];
		for(var j = 0;j<gridSize;j++){
			temp.push(0);
		}
		g.push(temp);
	}
	return g;
}

function withinGrid(var x, var y)
{
	return x>=0 &&y>=0 
	&& x<=gridSize && y<=gridSize;
}

function update(){
	if(stage=="Updating"){
		updateGrid();
		totalUpdates+=1;
		lastTimeUpdated = new Date().getTime();
		stage = "Waiting";
		io.emit("grid",grid);
	}
	
	/* Wait before updating the grid again */ 
	else if(stage=="Waiting"){
		var time = new Date().getTime();
		if(time-lastTimeUpdated>timeBetweenUpdates){
			if(totalUpdates == updatesPer){
				stage = "Input";
				totalUpdates = 0;
				io.emit("stage",stage);
			}
			else{
				stage = "Updating";
			}
		}
	}
	else if(stage=="Input"){
		var done = true;
		for(var i = 0;i<numPlayers;i++){
			if(blocksPlaced[i]!=maxBlocksPlaced){
				done=false;
			}
		}
		
		if(done){
			stage = "Waiting";
			lastTimeUpdated = new Date().getTime();
			
			for(var i = 0;i<numPlayers;i++){
				blocksPlaced[i] = 0;
			}
			blocksPlaced[0] = maxBlocksPlaced;
		}
	}
}

function updateGrid(){
	var newGrid = initGrid();

	for(var y = 0;y<gridSize;y++){
		for(var x = 0;x<gridSize;x++){
			var neighbors = 0;
			for(var xPlus = -1;xPlus<=1;xPlus++){
				for(var yPlus = -1;yPlus<=1;yPlus++){
					if(withinGrid(x+xPlus,y+yPlus)){
						if(grid[y+yPlus][x+xPlus]!=0)
						{
							neighbors+=1;
						}
					}
				}
			}
			
			// Don't count itself as a live neighbor 
			if(grid[y][x]!=0)
			{
				neighbors-=1;
			}
			
			var gridDead = grid[y][x]==0;
			
			if(gridDead){
				if(neighbors==3){
					// TODO: Make this grid into the most popular neighbor
					newGrid[y][x] = 1;
				}
				else{
					newGrid[y][x] = 0;
				}
			}
			else{
				if(neighbors==2 || neighbors==3){
					newGrid[y][x] = grid[y][x];
				}
				else{
					newGrid[y][x] = 0;
				}
			}
		}
	}
		
	grid = newGrid.slice();
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use('/', express.static(__dirname + '/'));

io.on('connection', function(socket){
  console.log('a user connected');
  
  numPlayers+=1;
  blocksPlaced.push(0);

  socket.emit("number",numPlayers);
  io.emit('color',colors);
  
  socket.on('move', function(gridY,gridX,playerNumber){
		var canPlace = blocksPlaced[playerNumber]!=maxBlocksPlaced;
		var spaceFree = grid[gridY][gridX] == 0;
		if(canPlace && spaceFree){
			grid[gridY][gridX] = playerNumber;
			io.emit("grid",grid);
			blocksPlaced[playerNumber]+=1;
		}
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

grid = initGrid();
setInterval(update,20);