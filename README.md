# Gliders - A Multiplayer Conway's Game of Life

## Game Rules

Conway's game of life simulates cellular automation as a zero player game based only upon initial conditions. The game consistss of cells, which can either be alive or dead. At each iteration, the cells update according to the following rules. Neighbors are defined either horizontally, vertically or diagonally. 

1. Living cells with less than 2 living neighbors die
2. Living cells with 2 or 3 living neighbors live
3. Living cells with more than 3 living neighbors die
4. Dead cells with 3 living neighbors become a living cell

Blacks cells are alive, while white cells are dead, like below.

![alt text][blackwhite]

[blackwhite]: images/singlePlayer.gif "Screenshot of Conway's game of life"


## Multiplayer Variant

The multiplayer variant has similar rules to the original version, except cells are either dead or controlled by some player. So the new update rules are 

1. Living cells with less than 2 living neighbors die
2. Living cells with 2 or 3 living neighbors live
3. Living cells with more than 3 living neighbors die
4. Dead cells with 3 living neighbors become a living cell owned by a randomly selected neighbor

The game is turn based, so every turn, each player places down a certain number of cells, and after all players have placed down their cells, the game updates for some number of iterations, after which the players get to place more cells. 

![alt text][inputwaiting]

[inputwaiting]: images/inputWaiting.png "Player about to enter location of a block"

(The user is about to enter the location of a block) 

![alt text][colorboard]

[colorboard]: images/colorfulBoard.png "The board after several turns" 

(What the board looks like after several turns) 

## Instructions to run 

To run the game, from command line run 	
` node server.js `

Then navigate to `localhost:3000` to play the game. 
