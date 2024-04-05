# ZAYAH
ZAYAH is a GUI and Graphics framework dedicated for high-performance node-nesting, layering, animation, rendering, filtering and event-handling, implemented usign both versions in Python (PyGame) and JavaScript (HTML5 canvas).

## Key concept definitions:
* Shape: The geometry object displayed in canvas, include rectangle, line, ellipse and so on.
* Single element: Only one element that can be displayed onto the canvas, including shapes, text and image.
* Container: The group of nodes. All of the nodes in one group apply the same behavior (Translating, scaling, resizing, layer number chaning, color updating and so on).
* Node: The concepts of shape and layout are collectively called as node.

## Measurements and units
All positions and dimentions are measured and calculated in pixels and rotations in radians. If your users or clients request other units e.g. centimeters for positions or degreeds for angles, conversion between ZAYAH and custom business interface must be implemented by your own, as ZAYAH framework currently does not support this feature.

All nodes, including shapes, containers and layouts, will be drawn onto the main node container `Graphwin`

## Quick look (ZAYAH for JavaScript)
```js
let graphWin = new GraphWin("myCanvas");

let rect1 = new Rect({
    x: 100,
    y: 150,
    width: 75,
    height: 95,
    skewX: 12,
    rotation: Math.PI/3,
    color: "#df5d86"
});

graphWin.push(rect1)
```
