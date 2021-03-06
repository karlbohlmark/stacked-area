var CanvasRenderer = function(canvas, series, options) {
		this.options = options;
		this.canvas = canvas;
		this.width = options.width;
		this.height = options.height;
		this.ymax = options.ymax;
		this.ymin = options.ymin;
		this.ctx = canvas.getContext('2d');
		this.ctx.strokeStyle = options.stroke;
	};

CanvasRenderer.prototype.clear = function() {
	this.canvas.width = this.canvas.width;
};

CanvasRenderer.prototype.draw = function(seriesArr, highlight) {
	//# timer start drawing_series
	//var drawingStart = performance.webkitNow();
	var index;
	this.clear();

	for (var i = seriesArr.length; i; i--) {
		index = i - 1;
		var series = seriesArr[i - 1];
		this.drawSeries(series.points, series.color);
	}

	if (highlight)
		this.drawHighlightRegion(highlight);
	//# timer end drawing_series
	//var time = performance.webkitNow() - drawingStart;
	//console.log('drawing time', time);
};
CanvasRenderer.prototype.drawSeries = function(points, color) {
	var point;
	if (!points.length) return;

	this.ctx.fillStyle = color;
	this.ctx.lineWidth = 1;
	this.ctx.beginPath();

	this.ctx.moveTo(points[0].x, points[0].y);
	var lastDefined = 0;
	for (var i = 1; i < points.length; i++) {
		point = points[i];

		if (i + 1 < points.length && points[i + 1].x < 0) {
			continue;
		}
		if (i - 1 >= 0 && points[i - 1].x > this.width) {
			continue;
		}
		if(typeof point.y === 'number'){
			this.ctx.lineTo(point.x, Math.max(point.y,0.5));
			lastDefined = i;
		}else{
			this.ctx.moveTo(point.x, point.y);
		}
	}
	this.ctx.stroke();
	this.ctx.lineTo(points[lastDefined].x, this.ymax);
	this.ctx.lineTo(points[0].x, this.ymax);
	this.ctx.lineTo(points[0].x, points[0].y);
	this.ctx.fill();
};

CanvasRenderer.prototype.drawHighlightRegion = function(highlight){
	this.ctx.fillStyle = this.options.highlightRegionColor;
	this.ctx.beginPath();
	this.ctx.moveTo(highlight.from, this.ymin);
	this.ctx.lineTo(highlight.from, this.ymax);
	this.ctx.lineTo(highlight.to, this.ymax);
	this.ctx.lineTo(highlight.to, this.ymin);
	this.ctx.closePath();
	this.ctx.fill();
};

module.exports = CanvasRenderer;
