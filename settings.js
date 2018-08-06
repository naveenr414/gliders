var moduleName = {}

if(typeof module!="undefined" && module!==null){
	moduleName = module
}

moduleName.exports = this.Namespace = {
	updatesPer: 5,
	maxBlocksPlaced: 3,
	timeBetweenUpdates: 200,
	gridSize: 10, 
	blockSize: 30, // In Pixels 
	colors: ["#FF0000","#0000FF"], 
	hoverColor: "#AAAAAA", 
};
