var app = require('express')();
var express = require("express");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var settings = require('./settings');

const updatesPer = settings.updatesPer;
const maxBlocksPlaced = settings.maxBlocksPlaced;
const gridSize = settings.gridSize;
const timeBetweenUpdates = settings.timeBetweenUpdates;

var colors = settings.colors;
var blocksPlaced = [];
var grid = [];

//Three stages: Updating, Waiting and Input 
var stage = "Input";
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

function withinGrid(x, y){
	return x>=0 &&y>=0 
	&& x<gridSize && y<gridSize;
}

function update(){
	if(stage=="Updating"){
		updateGrid();
		totalUpdates+=1;
		lastTimeUpdated = new Date().getTime();
		stage = "Waiting";
		io.emit("gridUpdate",grid);
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
				io.emit("stage",stage);
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
						if(grid[y+yPlus][x+xPlus]!=-1){
							neighbors+=1;
						}
					}
				}
			}
			
			// Don't count itself as a live neighbor 
			if(grid[y][x]!=-1){
				neighbors-=1;
			}
			
			var gridDead = grid[y][x]==-1;
			
			if(gridDead){
				if(neighbors==3){
					// TODO: Make this grid into the most popular neighbor
					newGrid[y][x] = 0;
				}
				else{
					newGrid[y][x] = -1;
				}
			}
			else{
				if(neighbors==2 || neighbors==3){
					newGrid[y][x] = grid[y][x];
				}
				else{
					newGrid[y][x] = -1;
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
  

  socket.emit("playerNumber",numPlayers);
  io.emit('color',colors);
  socket.emit("gridUpdate",grid);
  socket.emit("stage",stage);

  blocksPlaced.push(0);  
  numPlayers+=1;
  
  socket.on('move', function(gridY,gridX,playerNumber){
		var canPlace = blocksPlaced[playerNumber]!=maxBlocksPlaced;
		var spaceFree = grid[gridY][gridX] == -1;
		if(canPlace && spaceFree){
			grid[gridY][gridX] = playerNumber;
			io.emit("gridUpdate",grid);
			blocksPlaced[playerNumber]+=1;
		}
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

grid = initGrid();
setInterval(update,20);