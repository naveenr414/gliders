# Conway's Game of Life

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

