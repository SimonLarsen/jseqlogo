jseqlogo
========

Simple Javascript sequence logo library using pure Javascript.

## Usage

```html
<!DOCTYPE html>
<html lang="en">
    <body>
        <canvas id="logo_canvas"></canvas>

        <script src="js/jseqlogo.js"></script>
        <script>
            var columns = [
                [["A", 0.5], ["C", 0.8],  ["G", 0.01], ["T", 0.2]],
                [["A", 1.0], ["C", 0.05], ["G", 0.0],  ["T", 0.0]],
                [["A", 0.0], ["C", 0.2],  ["G", 0.0],  ["T", 0.45]],
                [["A", 0.1], ["C", 0.0],  ["G", 0.7],  ["T", 0.0]],
                [["A", 0.0], ["C", 0.5],  ["G", 0.0],  ["T", 0.3]],
                [["A", 0.0], ["C", 0.05], ["G", 0.3],  ["T", 0.0]],
                [["A", 0.0], ["C", 0.0],  ["G", 0.84], ["T", 0.2]],
            ];

            var options = {
                "ymax": 1
            };

            sequence_logo(document.getElementById("logo_canvas"), 600, 200, columns, options);
        </script>
    </body>
</html>
```
