# ZAYAH
ZAYAH is a GUI and Graphics framework dedicated for high-performance node-nesting, layering, animation, rendering, filtering and event-handling, implemented usign both versions in Python (PyGame) and JavaScript (HTML5 canvas).

## Important concept names to be beware of:
* Shape: the geometry object displayed in canvas, include rectangle, line, ellipse and so on.
* Single element: Only one element that can be displayed onto the canvas, including shapes, text and image.
* Container: the group of nodes. All of shapes in one group apply the same behavior (moving, resizing, layer number chaning, color changing and so on).
* Node: the concepts of shape and layout are collectively called as widget.


Shapes, containers and layouts could be drawn onto the main shape container `Graphwin`
