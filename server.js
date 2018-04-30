var app = require('express')();
var express = require("express");
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use('/', express.static(__dirname + '/'));

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function createRandom()
{
	var grid = [];
	for(var i = 0;i<10;i++)
	{
		var temp = [];
		for(var j = 0;j<10;j++)
		{
			temp.push(Math.floor(3*Math.random()));
		}
		grid.push(temp);
	}
	io.emit("grid",grid);
}

setInterval(createRandom,1000);
