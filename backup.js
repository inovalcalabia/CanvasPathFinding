var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var PLAYER = 'green';
var DESTINATION = 'red';
var BLOCK = 'black';
var PATH = 'yellow'
var NODE = 'white';

var nodes = [];
var size = 10;
var row = 60;
var column = 40;
var paths = [];
var isStart = false;
var distanceInfo = [];
function manhattan(x1, x2, y1, y2) {
	var dx = x1 - x2;
    var dy = y1 - y2;
    // return Math.round(Math.sqrt(dx * dx + dy * dy));
    // manhatan
	//return Math.abs(x1 - x2) + Math.abs(y1 - y2);
	// Euclidean
	// return 2*(Math.abs(x1- x2) + Math.abs(y1 - y2))
	// sebastian
	var distX = Math.abs(x1 - x2);
	var distY = Math.abs(y1 - y2);
	if (distX > distY) {
		return 14 * distY + 10 * (distX - distY);
	}
	return 14 * distX + 10 * (distY - distX);
}

function Node(width, height, x, y, color, nodes) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.color = color
	this.nodes = nodes;
	this.nodes[x][y] = this;
	this.isVisited = false;
	this.isBlock = false;

	this.gCost = 0;
	this.hCost = 0;

	this.create = function() {
		ctx.beginPath();
		ctx.lineWidth = '1';
		ctx.strokeStyle = 'gray';
		ctx.rect(this.x * (this.width  + 1), this.y * (this.width + 1) , this.width, this.height);
		ctx.stroke();
		ctx.fillStyle = this.color;
		ctx.fill();
	}
	this.getFCost = function() {
		return this.gCost + hCost
	}
	this.scan = function(dx, dy) {
		this.isVisited = true;

		var neighbors = this.getNeighborNode();
		
		for (var i =  neighbors.length - 1; i >= 0; i -= 1) {
			var x = neighbors[i].x;
			var y = neighbors[i].y;
			var gCost = neighbors[i].gCost;
			if (x === -1 || y === -1 && x === 61 && y === 41) {
				return undefined;
			}
			var currentNode = this.nodes[x][y];
			if (currentNode) {
				if (!currentNode.isVisited && !currentNode.isBlock) {
					var dist = manhattan(x ,dx ,y ,dy);
					currentNode.gCost = gCost;
					currentNode.hCost = dist;
					currentNode.fCost = dist + gCost;
					distanceInfo.push({ x: x, y: y, dist: dist, fCost: currentNode.fCost, name: neighbors[i].name });
				}
			}
		}
		if (distanceInfo.length === 0) {

			return undefined;
		}
		// console.log(distanceInfo)
		var nearest = this.getNearest(distanceInfo, 'fCost');
		var dist = this.getNearest(distanceInfo, 'dist');
		var selectedNeighborIndex = nearest.index;
		var selectedNeighbor = {fCost: distanceInfo[selectedNeighborIndex].fCost, x: distanceInfo[selectedNeighborIndex].x, y: distanceInfo[selectedNeighborIndex].y, distance: dist.distance };
		distanceInfo.splice(selectedNeighborIndex, 1);
		return selectedNeighbor;
	}
	this.getNeighborNode = function() {
		var up = { x: this.x, y: this.y - 1, gCost: 10, name: 'up' };
		var upright = {x: this.x + 1, y: this.y - 1, gCost: 14, name: 'upright' };
		var right = {x: this.x + 1, y: this.y, gCost: 10, name: 'right' };
		var downright = { x: this.x + 1, y: this. y + 1, gCost: 14, name: 'downright' };
		var down = { x: this.x, y: this. y + 1, gCost: 10, name: 'down' };
		var downleft = { x: this.x - 1, y: this. y + 1, gCost: 14, name: 'downleft' };
		var left = { x: this.x - 1, y: this. y, gCost: 10, name: 'left' };
		var upleft = { x: this.x - 1, y: this. y - 1, gCost: 14, name: 'upleft' };
		var neighbors = [up, upright, right, downright, down, downleft, left, upleft];

		return neighbors.reverse();
	}
	this.convertToPixelPosition = function(x, y) {
		return { x: x * ( this.width + 1), y: y * ( this.width + 1) };
	}
	this.getPixelPosition = function() {
		return { x: this.x * (this.width + 1) , y: this.y * (this.width + 1) };
	}
	this.getNearest = function(arr, attr) {
	    var val = arr[0][attr];
	    for(var i = 1; i < arr.length; i += 1) {
	        val = Math.min(val, arr[i][attr]);
	    }
	    var index = 0;
	    for (var j = 0; j < arr.length; j += 1) {
	    	if (arr[j][attr] === val) {
	    		index = j;
	    		break;
	    	}
	    }
	    return { distance: val, index: index};
	}
	this.redraw = function(color) {
		ctx.beginPath();
		ctx.lineWidth = '1';
		ctx.strokeStyle = 'gray';
		ctx.rect(x * (this.width + 1) , y * (this.width + 1) , this.width, this.height);
		ctx.stroke();
		ctx.fillStyle = color;
		ctx.fill();
	}
	this.create();
}
function generateRandomBlocks() {
	/*for (var i = 0; i < 900; i += 1) {
		var x = Math.floor(Math.random() * row);
		var y = Math.floor(Math.random() * column);
		nodes[x][y].redraw(BLOCK);
		nodes[x][y].isBlock = true;
	}*/
	for (var i = 0; i < 35; i += 1) {
		var x = 36;
		var y = i;
		nodes[x][y].redraw(BLOCK);
		nodes[x][y].isBlock = true;
	}

}
function InitializeGridNodes() {
	for (var x = 0; x < row; x += 1) {
		nodes[x] = new Array();
		for (var y = 0; y < column; y += 1) {
			nodes[x][y] = new Array();
			var node = new Node(size, size, x, y, NODE, nodes);
		}
	}

	generateRandomBlocks();

	var node = new Node(size, size, 5, 8, PLAYER, nodes);
	nodes[5][8].isVisited = true;

	var node = new Node(size, size, 50, 7, DESTINATION, nodes);
	nodes[50][7].isVisited = true;

}

InitializeGridNodes();

setInterval(function() {
	if (isStart) {
		if (paths.length < 1) {
			var firstNode = nodes[5][8].scan(50, 7);
			paths.push(firstNode);
			nodes[firstNode.x][firstNode.y].redraw(PATH);
			// console.log(firstNode);
		    isStart = false;
		} else {
			if (paths[paths.length - 1] !== undefined && nodes[paths[paths.length - 1].x][paths[paths.length - 1].y] !== undefined) {
				var lastNode = nodes[paths[paths.length - 1].x][paths[paths.length - 1].y].scan(50, 7);
				
				if (lastNode !== undefined) {
					paths.push(lastNode);
					nodes[lastNode.x][lastNode.y].redraw(PATH);
					if (lastNode.distance <= size + 5) {
						isStart = true;
					}
				} else {
					// var popNode = paths.pop()
					// var lastNode = nodes[popNode.x][popNode.y].scan(50, 7);
					// nodes[popNode.x][popNode.y].redraw(NODE);

				}
			}
			
		}
	}
}, 1000 / 120);

