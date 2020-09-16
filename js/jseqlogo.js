var jseqlogo = {
    "colors": {
        "nucleotides": {"A": "green", "C": "blue", "G": "orange", "T": "red", "U": "red"},
        "aminoacids": {
            "D": "red", "E": "red",
            "N": "green", "Q": "green", "S": "green", "G": "green", "T": "green", "Y": "green",
            "R": "blue", "K": "blue", "H": "blue",
        }
    }
};

function sequence_logo(element, width, height, columns, options) {
    function range(n) {
        var a = new Array(n);
        for(var i = 0; i < a.length; i++) a[i] = i;
        return a;
    }

    function sort_order(x) {
        var order = range(x.length);
        order.sort(function(a, b) { return x[a] - x[b]; });
        return order;
    }

    // set canvas size
    element.width = width;
    element.height = height;

    // Get setttings from options or default values.
    var defaults = {
        "colors": jseqlogo.colors.nucleotides,
        "ylabel": "bits",
        "textcolor": "black",
        "bgcolor": "white",
        "border": 28,
        "padding": 6,
        "labelfont": "14px Arial,sans-serif",
        "letterfont": "30px Lucida Console,monospace",
        "fontpixelheight": 24,
        "ymax": 0,
        "sort": true
    };

    var settings = {};
    for(var p in defaults) {
        settings[p] = (options[p] == null) ? defaults[p] : options[p];
    }

    var letters = Object.keys(columns);
    var ncols = columns[letters[0]].length;

    // collect stats on columns
    var ymax = settings.ymax;
    for(var i = 0; i < ncols; i++) {
        var colsum = 0;
        for(var j = 0; j < letters.length; j++) {
            colsum += columns[letters[j]][i];
        }
        if(colsum > ymax) ymax = colsum;
    }

    var ctx = element.getContext("2d");
    ctx.save();

    // draw the background
    ctx.fillStyle = settings.bgcolor;
    ctx.fillRect(0, 0, width, height);

    // draw the letters
    var columnx = settings.border;
    var columndelta = (width - settings.border) / ncols;
    var yheight = height - settings.border;
    ctx.font = settings.letterfont;

    for (var col = 0; col < ncols; col++) {
        var totalweight = 0.0;
        var lettery = yheight;

        var values = letters.map(function(letter) { return columns[letter][col]; })
        if(settings.sort) {
            var order = sort_order(values);
        } else {
            var order = range(letters.length);
        }

        for(var i = 0; i < letters.length; i++) {
            var letter = letters[order[i]];
            var weight = columns[letter][col];

            if(weight > 0) {
                totalweight += weight;
                ctx.save();
                ctx.fillStyle = letter in settings.colors ? settings.colors[letter] : "black";
                ctx.translate(columnx, lettery);
                var scaley = (yheight * weight) / (settings.fontpixelheight * ymax);
                var mt = ctx.measureText(letter);
                var letterwidth = mt.width;
                var scalex = columndelta / letterwidth;
                ctx.scale(scalex, scaley);
                ctx.fillText(letter, 0, 0);
                ctx.restore();
                lettery -= (weight * yheight) / ymax;
            }
        }

        // x-axis labels
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
