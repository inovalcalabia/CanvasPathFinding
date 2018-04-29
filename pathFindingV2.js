var ROW = 50;
var COL = 30;
var STATUS = { PLAIN: 'white', OPEN: 'yellow', CLOSED: 'green' };

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var radius = 5;
var nodes = [];

function Node(x, y) {
	this.x = x;
	this.y = y;
	this.open = true;
	this.visited = false;
	this.close = false;

	this.draw = function(color) {
      ctx.beginPath();
      ctx.arc((this.x * (radius * 2.2)) + (radius + 1), (this.y * (radius * 2.2)) + (radius + 1), radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'black';
      ctx.stroke();
	}
	this.updateStatus = function() {

	}

}

function GridOfNodes() {
	for (var x = 0; x < ROW; x += 1) {
		nodes[x] = new Array();
		for (var y = 0; y < COL; y += 1) {
			nodes[x][y] = new Array();
			var node = new Node(x, y);
			node.draw(STATUS.PLAIN);
			nodes[x][y] = node;
		}
	}
	console.log(nodes)
}

GridOfNodes();