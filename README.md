# AuraGem with ZAYAH framework
## Introduction
AuraGem is a editing software dedicated for templates, reference guides and chart designs, especially for knowledge visualization. The software is written in Python and JavaScript, giving the freedom to user in terms of software operation, as it can be both run on local-native and browser environment.
***Important! This project is dedicated for educational purposes only.***

## AuraGem
AuraGem is a efficient and high-performance software, written in Python and JavaScript, dedicated for editing template, reference guide and chart designs, including visualization of knowledge concepts. Each page in the editor contain designs of templates and reference guides with charts while the pages are bundled collectively into a design. Ultimately, designs can be stored and saved into local files with custom binary file format using file extension .BLOODGEM. Alternatively, they can be stored as YAML files instead.

Sources for AuraGem data contents (for future usage):
 * https://essayrx.com/blog/reviews/what-is-metabolism-and-how-it-works/
 * https://www.behance.net/gallery/38270165/Metro-Map-of-Metabolism-The-Overview
 * https://upload.wikimedia.org/wikipedia/commons/a/a8/Human_Metabolism_-_Pathways.jpg
 * https://reactome.org/PathwayBrowser/#/R-HSA-8953854
 * https://reactome.org/PathwayBrowser/#/R-HSA-168256
 * https://en.wikipedia.org/wiki/File:Metabolic_Metro_Map.svg
 * https://rsc.bg/2023/09/11/restoring-corrupted-mysql-innodb-database/

## ZAYAH
The software AuraGem is implemented by ZAYAH which is a GUI and Graphics framework dedicated for high-performance node-nesting, layering, animation, rendering, filtering and event-handling, implemented using both versions in Python (PyGame) and JavaScript (HTML5 canvas). In this repository, ZAYAH framework is implemented in AuraGem software, which helps user to design charts and reference guides including for knowledge. However, ZAYAH framework can also be implemented in other software projects.

## Important key concepts definition
* Shape: The geometry object displayed in canvas, include rectangle, line, ellipse and so on.
* Single element: Only one element that can be displayed onto the canvas, including shapes, text and image.
* Container: The group of nodes. All of the nodes in one group apply the same behavior (Translating, scaling, resizing, layer number chaning, color updating and so on).
* Node: The concepts of shape, single element and container as well as layout are collectively called as node.

## Units and compatibility
All positions and dimentions are measured and calculated in pixels and rotations in radians. If users or clients request other units e.g. centimeters for positions or degreeds for angles, conversion between ZAYAH and custom business interface must be implemented by your own, as ZAYAH framework currently does not support this feature.

All nodes, including shapes, containers and layouts, will be drawn onto the main node container `Graphwin`

## Quick look (ZAYAH for JavaScript)

### Step 1. Import ZAYAH framework
```html
<script src = "ZAYAH.js"></script>
```
or
```js
import {Rect, GraphWin, ...} from "ZAYAH.js"
```

### Step 2. Implement the framework with your business
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

graphWin.push(rect1);
```

## Quick look (ZAYAH for Python (PyGame))
```python
from ZAYAH import *
import math

graph_win = GraphWin();

rect1 = Rect(
    x = 100,
    y = 150,
    width = 75,
    height = 95,
    skewX = 12,
    rotation = math.pi/3,
    color = "#df5d86"
)

graph_win.push(rect1)

```
