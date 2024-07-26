const colorMap = {};
const testCanvas = document.createElement("canvas");
const testCtx = testCanvas.getContext("2d");

function getRandomRGBColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function genMouse(name) {
    return function (event, hit) {
        let x = event.offsetX;
        let y = event.offsetY;
        let pixel = hit.getImageData(x, y, 1, 1).data;
        let color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        let target = colorMap[color];
        if (target) {
            target.fire(name, { x: x, y: y });
            // console.log("Fired target:", target)
        }
    };
}

function genMouseOut(name) {
    return function (event, hit) {
        let x = event.offsetX;
        let y = event.offsetY;
        let pixel = hit.getImageData(x, y, 1, 1).data;
        let color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        let target = colorMap[color];
        for (let color in colorMap) {
            let node = colorMap[color];
            if (node != target) {
                node.fire(name, { x: x, y: y });
            }
        }
    };
}

let isDragging = false;

const eventMap = {
    mousemove: ["mousemove", genMouse("mousemove")],
    mousedown: ["mousedown", genMouse("mousedown")],
    mouseup: ["mouseup", genMouse("mouseup")],
    mousemoveout: ["mousemove", genMouseOut("mousemoveout")],
    mousedownout: ["mousedown", genMouseOut("mousedownout")],
    mouseupout: ["mouseup", genMouseOut("mouseupout")],
    dragstart: [
        "mousedown",
        function (event, hit) {
            let x = event.offsetX;
            let y = event.offsetY;
            let pixel = hit.getImageData(x, y, 1, 1).data;
            let color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            let target = colorMap[color];
            if (target) {
                target.fire("dragstart", { x: x, y: y });
            }
            isDragging = true;
        },
    ],
    drag: [
        "mousemove",
        function (event, hit) {
            if (!isDragging) {
                return;
            }
            let x = event.offsetX;
            let y = event.offsetY;
            let pixel = hit.getImageData(x, y, 1, 1).data;
            let color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            let target = colorMap[color];
            if (target) {
                target.fire("drag", { x: x, y: y });
            }
        },
    ],
    dragend: [
        "mouseup",
        function (event, hit) {
            if (!isDragging) {
                return;
            }
            let x = event.offsetX;
            let y = event.offsetY;
            let pixel = hit.getImageData(x, y, 1, 1).data;
            let color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            let target = colorMap[color];
            if (target) {
                target.fire("dragend", { x: x, y: y });
            }
            isDragging = false;
        },
    ],
};

class GraphWin {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");
        this.hit = document.createElement("canvas");
        this.hitCtx = this.hit.getContext("2d", { willReadFrequently: true });
        this.dirty = true;
        this.hitDirty = true;
        this.nodes = [];
        this.activeEventListeners = {};
        this.setSize(this.canvas.width, this.canvas.height);

        requestAnimationFrame(this.rerender.bind(this));
    }

    setSize(width, height) {
        const ratio = window.devicePixelRatio;
        this.hit.width = width;
        this.hit.height = height;
        this.canvas.width = width * ratio;
        this.canvas.height = height * ratio;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.ctx.scale(ratio, ratio);
        this.startEvent("dragend");
    }

    add(node) {
        node.inject(this);
        this.nodes.push(node);
    }

    removeAll() {
        this.nodes = [];
    }

    render(ctx) {
        let rect = this.canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        for (let node of this.nodes) {
            node.render(ctx);
        }
    }

    renderHit(ctx) {
        let rect = this.hit.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        for (let node of this.nodes) {
            node.renderHit(ctx);
        }
    }

    rerender() {
        if (this.dirty) {
            this.render(this.ctx);
            this.dirty = false;
        }
        requestAnimationFrame(this.rerender.bind(this));
    }

    requestRefresh() {
        this.dirty = true;
        this.hitDirty = true;
        // requestAnimationFrame(this.rerender.bind(this));
    }

    startEvent(name) {
        if (name in this.activeEventListeners) {
            return;
        }
        let sys = this;
        let [basicName, calcPos] = eventMap[name];
        let handler = function (event) {
            event.preventDefault();
            if (sys.hitDirty) {
                sys.renderHit(sys.hitCtx);
                sys.hitDirty = false;
            }
            calcPos(event, sys.hitCtx);
        };
        this.activeEventListeners[name] = [basicName, handler];
        this.canvas.addEventListener(basicName, handler);
    }
}

class Node {
    constructor() {
        this.color = "black";
        this.borderWidth = 0;
        this.borderDash = [];
        this.borderColor = "transparent";
        this.rotation = 0;
        this.handlers = {};
        this.colorKey = getRandomRGBColor();
        this.__glob = null;
        this.superNode = null;
        while (this.colorKey in colorMap) {
            this.colorKey = getRandomRGBColor();
        }
        colorMap[this.colorKey] = this;
    }

    inject(glob) {
        this.__glob = glob;
        for (let name in this.handlers) {
            this.__glob.startEvent(name);
        }
    }

    sceneFunc(ctx) {
        throw new Error("sceneFunc is not implemented");
    }

    hitFunc(ctx) {
        this.sceneFunc(ctx);
    }

    get pivot() {
        throw new Error(".pivot is not implemented");
    }

    bind(name, handler) {
        if (!(name in this.handlers)) {
            this.handlers[name] = [];
            if (this.__glob) {
                this.__glob.startEvent(name);
            }
        }
        this.handlers[name].push(handler);
    }

    unbind(name, handler) {
        if (!(name in this.handlers)) {
            return;
        }
        arrayDelete(this.handlers[name], handler);
    }

    unbindAll(name) {
        if (!(name in this.handlers)) {
            return;
        }
        delete this.handlers[name];
    }

    fire(name, event) {
        if (name in this.handlers) {
            for (let handler of this.handlers[name]) {
                handler.call(this, event);
            }
        }
        if (this.superNode) {
            this.superNode.fire(name, event);
        }
    }

    destroy() {
        delete colorMap[this.colorKey];
        delete this.colorKey;
    }
}

class BoxNode extends Node {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.skewX = 0;
        this.skewY = 0;
    }

    __setTransform(ctx) {
        let xFactor = this.width > 0 ? 1 : -1;
        let yFactor = this.height > 0 ? 1 : -1;

        if (this.rotation) {
            let [centerX, centerY] = this.pivot;
            ctx.translate(centerX, centerY);
            ctx.rotate(this.rotation);
            ctx.translate(-centerX, -centerY);
        }

        let skewScaleX = this.skewX / this.height;
        let skewScaleY = this.skewY / this.width;

        ctx.transform(1, skewScaleY, skewScaleX, 1, this.x, this.y);
        ctx.scale(xFactor, yFactor);
    }

    get pivot() {
        let x = this.x + (this.width + this.skewX) / 2;
        let y = this.y + (this.height + this.skewY) / 2;
        return [x, y];
    }

    render(ctx) {
        ctx.save();
        this.__setTransform(ctx);

        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.setLineDash(this.borderDash);
        this.sceneFunc(ctx);
        ctx.restore();
    }

    renderHit(ctx) {
        ctx.save();
        this.__setTransform(ctx);

        ctx.fillStyle = this.colorKey;
        ctx.strokeStyle = this.colorKey;
        ctx.lineWidth = this.borderWidth;
        this.hitFunc(ctx);
        ctx.restore();
    }

    get bound() {
        let s = Math.sin(this.rotation);
        let c = Math.cos(this.rotation);
        let x1 = this.x * c - this.y * s;
        let y1 = this.x * s + this.y * c;
        let x2 = this.width * c - this.skewY * s + this.x * c - this.y * s;
        let y2 = this.width * s + this.skewY * c + this.x * s + this.y * c;
        let x3 = this.skewX * c - this.height * s + this.x * c - this.y * s;
        let y3 = this.skewX * s + this.height * c + this.x * s + this.y * c;
        let x4 =
            this.width * c -
            this.skewY * s +
            this.skewX * c -
            this.height * s +
            this.x * c -
            this.y * s;
        let y4 =
            this.width * s +
            this.skewY * c +
            this.skewX * s +
            this.height * c +
            this.x * s +
            this.y * c;
        let xMin = Math.min(x1, x2, x3, x4);
        let yMin = Math.min(y1, y2, y3, y4);
        let xMax = Math.max(x1, x2, x3, x4);
        let yMax = Math.max(y1, y2, y3, y4);

        return [xMin, yMin, xMax - xMin, yMax - yMin];
    }

    /*
  transform(sx, ry, rx, sy, dx, dy){
      let s = Math.sin(this.rotation);
      let c = Math.cos(this.rotation);
  }
  
  translate(dx, dy){
      this.x += xDelta;
      this.y += yDelta;
  }
  
  scale(xScale, yScale){
      this.x *= xScale;
      this.y *= yScale;
      this.width *= xScale;
      this.height *= yScale;
      this.skewX *= xScale;
      this.skewY *= yScale;
  }
  */

    rotate(rotationDelta) {
        this.rotation += rotationDelta;
    }
}

class Rect extends BoxNode {
    constructor(config) {
        super();
        Object.assign(this, config);
    }

    sceneFunc(ctx) {
        let width = Math.abs(this.width);
        let height = Math.abs(this.height);
        ctx.beginPath();
        ctx.fillRect(0, 0, width, height);
        ctx.strokeRect(0, 0, width, height);
        ctx.closePath();
    }
}

class Ellipse extends BoxNode {
    constructor(config) {
        super();
        this.startAngle = 0;
        this.endAngle = 2 * Math.PI;
        Object.assign(this, config);
    }

    sceneFunc(ctx) {
        let width = Math.abs(this.width);
        let height = Math.abs(this.height);
        ctx.beginPath();
        ctx.ellipse(
            width / 2,
            height / 2,
            width / 2,
            height / 2,
            0,
            this.startAngle,
            this.endAngle
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

class IText extends BoxNode {
    constructor(config) {
        super();
        this.content = "";
        this.textAlign = "start";
        this.textBaseline = "top";
        this.fontFamily = "Arial";
        this.fontStyle = "";
        Object.assign(this, config);
    }

    sceneFunc(ctx) {
        let width = Math.abs(this.width);
        let height = Math.abs(this.height);
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.font = `${this.fontStyle} ${height}px ${this.fontFamily}`;
        ctx.fillText(this.content, 0, 0, width);
        ctx.strokeText(this.content, 0, 0, width);
    }

    hitFunc(ctx) {
        let width = Math.abs(this.width);
        let height = Math.abs(this.height);
        ctx.beginPath();
        ctx.fillRect(0, 0, width, height);
        ctx.strokeRect(0, 0, width, height);
        ctx.closePath();
    }
}

class Image extends BoxNode {
    constructor(config) {
        super();
        this.element = null;
        Object.assign(this, config);
    }

    set src(src) {
        this.element = document.createElement("img");
        this.element.src = src;
    }

    get src() {
        return this.element.src;
    }

    sceneFunc(ctx) {
        if (!this.element) {
            return;
        }
        let width = Math.abs(this.width);
        let height = Math.abs(this.height);
        ctx.drawImage(this.element, 0, 0, width, height);
    }

    hitFunc(ctx) {
        let width = Math.abs(this.width);
        let height = Math.abs(this.height);
        ctx.beginPath();
        ctx.fillRect(0, 0, width, height);
        ctx.strokeRect(0, 0, width, height);
        ctx.closePath();
    }
}

class TextTable extends BoxNode {
    constructor(config) {
        super();

        this.data = [];
        this.colSizes = [];
        this.rowSizes = [];
        this.fontSize = 14;
        this.fontFamily = "Arial";
        this.color = "black";
        this.borderColor = "black";

        this.__colSizes = [];
        this.__rowSizes = [];
        this.__sizeDirty = true;

        Object.assign(this, config);
        this.calculateDynamicSizes(testCtx);
    }

    /*
  addRow(row){
      this.data.push(row);
      this.__sizeDirty = true;
  }
  
  insertRow(rowIndex, row){
      this.data.splice(row, 0, row);
      this.__sizeDirty = true;
  }
  */

    calculateDynamicSizes(ctx) {
        if (!this.__sizeDirty) {
            return;
        }
        this.__colSizes = this.colSizes.slice();
        this.__rowSizes = this.rowSizes.slice();
        this.__sizeDirty = false;

        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        for (let col = 0; col < this.__colSizes.length; col++) {
            if (this.__colSizes[col] === 0) {
                let maxWidth = 0;
                for (let row = 0; row < this.data.length; row++) {
                    const text = this.data[row][col] || "";
                    const textWidth = ctx.measureText(text).width;
                    if (textWidth > maxWidth) {
                        maxWidth = textWidth;
                    }
                }
                this.__colSizes[col] = maxWidth + 10;
            }
        }

        for (let row = 0; row < this.__rowSizes.length; row++) {
            if (this.__rowSizes[row] === 0) {
                let maxHeight = 0;
                for (let col = 0; col < this.data[row].length; col++) {
                    const text = this.data[row][col] || "";
                    const textHeight = this.fontSize;
                    if (textHeight > maxHeight) {
                        maxHeight = textHeight;
                    }
                }
                this.__rowSizes[row] = maxHeight + 10;
            }
        }
        this.width = sum(this.__colSizes);
        this.height = sum(this.__rowSizes);
    }

    /*
  render(ctx){
      this.calculateDynamicSizes(ctx);
      super.render(ctx);
  }
  
  renderHit(ctx){
      this.calculateDynamicSizes(ctx);
      super.renderHit(ctx);
  }
  */

    sceneFunc(ctx) {
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let y = 0;
        for (let row = 0; row < this.data.length; row++) {
            let x = 0;
            for (let col = 0; col < this.data[row].length; col++) {
                const cellWidth = this.__colSizes[col];
                const cellHeight = this.__rowSizes[row];

                ctx.strokeRect(x, y, cellWidth, cellHeight);
                const text = this.data[row][col] || "";
                ctx.fillText(text, x + cellWidth / 2, y + cellHeight / 2);

                x += cellWidth;
            }
            y += this.__rowSizes[row];
        }
    }

    hitFunc(ctx) {
        let width = Math.abs(this.width);
        let height = Math.abs(this.height);
        ctx.beginPath();
        ctx.fillRect(0, 0, width, height);
        ctx.strokeRect(0, 0, width, height);
        ctx.closePath();
    }
}

class Layout extends BoxNode {
    constructor() {
        super();
        this.dx = 0;
        this.dy = 0;
        this.sx = 1;
        this.sy = 1;
        this.skewX = 0;
        this.skewY = 0;
    }

    sceneFunc(ctx) {
        let width = Math.abs(this.width);
        let height = Math.abs(this.height);
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

class SpaceLayout extends Layout {
    constructor() {
        super();
        this.subNodes = [];
        this.__width = 0;
        this.__height = 0;
        this.fitX = false;
        this.fitY = false;
    }

    inject(glob) {
        super.inject(glob);
        for (let subNode of this.subNodes) {
            subNode.inject(glob);
        }
    }

    add(node) {
        node.inject(this.__glob);
        node.superNode = this;
        this.subNodes.push(node);
        this.__calculateSize();
    }

    destroy() {
        super.destroy();
        for (let node of this.subNodes) {
            node.destroy();
        }
        this.subNodes = [];
    }
}

class CoordinatorLayout extends SpaceLayout {
    constructor(config) {
        super();
        Object.assign(this, config);
    }

    __calculateSize() {
        if (!(this.fitX || this.fitY)) {
            return;
        }
        if (this.fitX) {
            this.width = 0;
        }
        if (this.fitY) {
            this.height = 0;
        }
        for (let subNode of this.subNodes) {
            let [bx, by, bw, bh] = subNode.bound;
            blockWidth = bx + bw;
            blockHeight = by + bh;
            if (blockWidth > this.width && this.fitX) {
                this.width = blockWidth;
            }
            if (blockHeight > this.height && this.fitY) {
                this.height = blockHeight;
            }
        }
    }

    render(ctx) {
        ctx.save();
        this.__setTransform(ctx);

        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.setLineDash(this.borderDash);
        this.sceneFunc(ctx);

        ctx.clip();
        ctx.transform(
            this.sx,
            this.skewY,
            this.skewX,
            this.sy,
            this.dx,
            this.dy
        );
        for (let subNode of this.subNodes) {
            subNode.render(ctx);
        }

        ctx.restore();
    }

    renderHit(ctx) {
        ctx.save();
        this.__setTransform(ctx);

        ctx.fillStyle = this.colorKey;
        ctx.strokeStyle = this.colorKey;
        ctx.lineWidth = this.borderWidth;
        this.hitFunc(ctx);

        ctx.clip();
        ctx.transform(
            this.sx,
            this.skewY,
            this.skewX,
            this.sy,
            this.dx,
            this.dy
        );
        for (let subNode of this.subNodes) {
            subNode.renderHit(ctx);
        }

        ctx.restore();
    }
}

class LinearLayout extends SpaceLayout {
    constructor(config) {
        super();
        Object.assign(this, config);
    }

    __calculateSize() {
        if (!(this.fitX || this.fitY)) {
            return;
        }
        if (this.fitX) {
            this.width = 0;
        }
        if (this.fitY) {
            this.height = 0;
        }

        for (let subNode of this.subNodes) {
            let [bx, by, bw, bh] = subNode.bound;
            let blockWidth = bx + bw;
            let blockHeight = by + bh;
            if (blockWidth > this.width && this.fitX) {
                this.width = blockWidth;
            }
            if (this.fitY) {
                this.height += blockHeight;
            }
        }
    }

    render(ctx) {
        this.__calculateSize();
        ctx.save();
        this.__setTransform(ctx);

        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.setLineDash(this.borderDash);
        this.sceneFunc(ctx);

        ctx.clip();
        ctx.transform(
            this.sx,
            this.skewY,
            this.skewX,
            this.sy,
            this.dx,
            this.dy
        );
        for (let subNode of this.subNodes) {
            subNode.render(ctx);
            let [, boundY, , boundHeight] = subNode.bound;
            ctx.translate(0, boundY + boundHeight);
        }

        ctx.restore();
    }

    renderHit(ctx) {
        this.__calculateSize();
        ctx.save();
        this.__setTransform(ctx);

        ctx.fillStyle = this.colorKey;
        ctx.strokeStyle = this.colorKey;
        ctx.lineWidth = this.borderWidth;
        this.hitFunc(ctx);

        ctx.clip();
        ctx.transform(
            this.sx,
            this.skewY,
            this.skewX,
            this.sy,
            this.dx,
            this.dy
        );
        for (let subNode of this.subNodes) {
            subNode.renderHit(ctx);
            let [, boundY, , boundHeight] = subNode.bound;
            ctx.translate(0, boundY + boundHeight);
        }

        ctx.restore();
    }
}

class TableLayout extends Layout {
    constructor(config) {
        super();
        this.colSizes = [];
        this.rowSizes = [];
        this.data = [];
        Object.assign(this, config);
    }

    inject(glob) {
        super.inject(glob);
        for (let row of this.data) {
            for (let node of row) {
                node.inject(glob);
            }
        }
    }

    addRow() {
        for (let node of row) {
            node.inject(this.__glob);
            node.superNode = this;
        }
        this.data.push([]);
    }

    addColumn(rowIndex, node) {
        let row = this.data[rowIndex];
        if (!row) {
            return;
        }
        row.push(node);
    }

    /*
  render(ctx){
      ctx.save();
      this.__setTransform(ctx);
      
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.borderColor;
      ctx.lineWidth = this.borderWidth;
      ctx.setLineDash(this.borderDash);
      this.sceneFunc(ctx);
      
      ctx.clip();
      ctx.transform(this.sx, this.skewY, this.skewX, this.sy, this.dx, this.dy);
      for (let subNode of this.subNodes){
          subNode.render(ctx);
          let [, boundY, , boundHeight] = subNode.bound;
          ctx.translate(0, boundY + boundHeight);
      }
      
      ctx.restore();
  }
  
  renderHit(ctx){
      ctx.save();
      this.__setTransform(ctx);
      
      ctx.fillStyle = this.colorKey;
      ctx.strokeStyle = this.colorKey;
      ctx.lineWidth = this.borderWidth;
      this.hitFunc(ctx);
      
      ctx.clip();
      ctx.transform(this.sx, this.skewY, this.skewX, this.sy, this.dx, this.dy);
      for (let subNode of this.subNodes){
          subNode.renderHit(ctx);
          let [, boundY, , boundHeight] = subNode.bound;
          ctx.translate(0, boundY + boundHeight);
      }
      
      ctx.restore();
  }
  */
}