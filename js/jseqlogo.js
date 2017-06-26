function sequence_logo(element, width, height, columns, options) {
	// set canvas size
	element.width = width;
	element.height = height;

	// Get setttings from options or default values.
	var defaults = {
		"colors": {"A": "green", "C": "blue", "G": "orange", "T": "red", "U": "red"},
		"ylabel": "bits",
		"textcolor": "black",
		"bgcolor": "white",
		"border": 28,
		"padding": 6,
		"labelfont": "14px Arial,sans-serif",
		"letterfont": "30px Arial,sans-serif",
		"fontpixelheight": 22,
		"ymax": 0,
	};

	var settings = {};
	for(var p in defaults) {
		settings[p] = (options[p] == null) ? defaults[p] : options[p];
	}

	// collect stats on columns
	var ymax = settings.ymax;
	for (var col = 0; col < columns.length; col++) {
		var totalweight = 0.0;
		var column = columns[col];
		for(var i = 0; i < column.length; ++i) {
			totalweight += column[i][1];
		}
		if (totalweight > ymax) ymax = totalweight;
	}
	var ctx = element.getContext("2d");
	ctx.save();

	// draw the background
	ctx.fillStyle = settings.bgcolor;
	ctx.fillRect(0, 0, width, height);

	// draw the letters
	var columnx = settings.border;
	var columndelta = (width - settings.border) / columns.length;
	var yheight = height - settings.border;
	ctx.font = settings.letterfont;

	for (var col = 0; col < columns.length; col++) {
		var totalweight = 0.0;
		var column = columns[col].slice();
		column.sort(function(a, b) { return a[1] - b[1]; });
		var lettery = yheight;
		for (var i = 0; i < column.length; i++) {
			var letter = column[i][0];
			var weight = column[i][1];
			totalweight += weight;
			ctx.save()
			ctx.fillStyle = settings.colors[letter];
			ctx.translate(columnx, lettery);
			var scaley = (yheight * weight) / (settings.fontpixelheight * ymax);
			var mt = ctx.measureText(letter);
			var letterwidth = mt.width;
			var scalex = columndelta / letterwidth;
			ctx.scale(scalex, scaley);
			ctx.fillText(letter, 0, 0)
			ctx.restore()
			lettery -= (weight * yheight) / ymax;
		}
		ctx.save();
		ctx.fillStyle = settings.textcolor;
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.font = settings.labelfont;
		ctx.fillText((col + 1).toString(), columnx + columndelta/2, height-settings.border+settings.padding);
		ctx.restore();
		columnx += columndelta;
	}

	// y-axis labels
	ctx.fillStyle = settings.textcolor;
	ctx.font = settings.labelfont;
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillText(ymax.toPrecision(1), settings.border-settings.padding, 0);
	ctx.textBaseline = "bottom";
	ctx.fillText("0", settings.border-settings.padding, height-settings.border);
	ctx.translate(settings.border-settings.padding, (height-settings.border)/2);
	ctx.rotate(-Math.PI/2);
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	ctx.fillText(settings.ylabel, 0, 0);

	ctx.restore();
	return element;
}
