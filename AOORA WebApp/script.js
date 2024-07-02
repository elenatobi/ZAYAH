const SRC_VERTEX = 0;
const DEST_VERTEX = 1;
const VERTEX_INFO = 2;

// Utility functions

function isNull(value) {
    return value === null;
}

function isNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
}

function isString(value) {
    return typeof value === "string";
}

function isObject(value) {
    return value.constructor === Object;
}

function arrayHas(array, value) {
    return array.indexOf(value) !== -1;
}

function arrayMove(array, srcIndex, destIndex) {
    array.splice(destIndex, 0, array.splice(srcIndex, 1)[0]);
}

function arrayDelete(array, value) {
    let i = 0;
    while (i < array.length) {
        if (array[i] === value) {
            array.splice(i, 1);
        } else {
            i++;
        }
    }
}

function arrayClear(array) {
    array.splice(0, array.length);
}

function sum(array){
    return array.reduce(function(partialSum, x){
        return partialSum + x;
    })
}

// HTML5 Canvas Graphics/GUI

function getRandomRGBColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

const colorMap = {};
const testCanvas = document.createElement("canvas");
const testCtx = testCanvas.getContext("2d");

function genMouse(name) {
    return function (event, hit) {
        let x = event.offsetX;
        let y = event.offsetY;
        let pixel = hit.getImageData(x, y, 1, 1).data;
        let color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        let target = colorMap[color];
        if (target){
            target.fire(name, {x: x, y: y});
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
    mousemove: ['mousemove', genMouse('mousemove')],
    mousedown: ['mousedown', genMouse('mousedown')],
    mouseup: ['mouseup', genMouse('mouseup')],
    mousemoveout: ['mousemove', genMouseOut('mousemoveout')],
    mousedownout: ['mousedown', genMouseOut('mousedownout')],
    mouseupout: ['mouseup', genMouseOut('mouseupout')],
    dragstart: ['mousedown', function(event, hit){
        let x = event.offsetX;
        let y = event.offsetY;
        let pixel = hit.getImageData(x, y, 1, 1).data;
        let color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        let target = colorMap[color];
        if (target){
            target.fire("dragstart", {x: x, y: y});
        }
        isDragging = true;
    }],
    drag: ['mousemove', function(event, hit){
        if (!isDragging){
            return;
        }
        let x = event.offsetX;
        let y = event.offsetY;
        let pixel = hit.getImageData(x, y, 1, 1).data;
        let color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        let target = colorMap[color];
        if (target){
            target.fire("drag", {x: x, y: y});
        }
    }],
    dragend: ['mouseup', function(event, hit){
        if (!isDragging){
            return;
        }
        let x = event.offsetX;
        let y = event.offsetY;
        let pixel = hit.getImageData(x, y, 1, 1).data;
        let color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        let target = colorMap[color];
        if (target){
            target.fire("dragend", {x: x, y: y});
        }
        isDragging = false;
    }],
};

class GraphWin {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");
        this.hit = document.createElement("canvas");
        this.hitCtx = this.hit.getContext("2d", {willReadFrequently: true});
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
    
    add(node){
        node.inject(this);
        this.nodes.push(node);
    }
    
    render(ctx){
        let rect = this.canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        for (let node of this.nodes){
            node.render(ctx);
        }
    }
    
    renderHit(ctx){
        let rect = this.hit.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        for (let node of this.nodes){
            node.renderHit(ctx);
        }
    }
    
    rerender(){
        if (this.dirty){
            this.render(this.ctx);
            this.dirty = false;
        }
        requestAnimationFrame(this.rerender.bind(this));
    }
    
    requestRefresh(){
        this.dirty = true;
        this.hitDirty = true;
        // requestAnimationFrame(this.rerender.bind(this));
    }
    
    startEvent(name) {
        if (name in this.activeEventListeners){
            return;
        }
        let sys = this;
        let [basicName, calcPos] = eventMap[name];
        let handler = function(event){
            if (sys.hitDirty){
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
        while (this.colorKey in colorMap){
            this.colorKey = getRandomRGBColor();
        }
        colorMap[this.colorKey] = this;
    }
    
    inject(glob){
        this.__glob = glob;
        for (let name in this.handlers){
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
    
    bind(name, handler){
        if (!(name in this.handlers)){
            this.handlers[name] = [];
            if (this.__glob){
                this.__glob.startEvent(name);
            }
        }
        this.handlers[name].push(handler);
    }
    
    unbind(name, handler){
        if (!(name in this.handlers)){
            return;
        }
        arrayDelete(this.handlers[name], handler);
    }
    
    unbindAll(name){
        if (!(name in this.handlers)){
            return;
        }
        delete this.handlers[name];
    }
    
    fire(name, event){
        if (name in this.handlers){
            for (let handler of this.handlers[name]){
                handler.call(this, event);
            }
        }
        if (this.superNode){
            this.superNode.fire(name, event);
        }
    }
    
    destroy(){
        delete colorMap[this.colorKey];
        delete this.colorKey;
    }
}

class BoxNode extends Node{
    constructor(){
        super();
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.skewX = 0;
        this.skewY = 0;
    }
    
    __setTransform(ctx){
        let xFactor = this.width > 0 ? 1 : -1;
        let yFactor = this.height > 0 ? 1 : -1;

        if (this.rotation){
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
    
    render(ctx){
        ctx.save();
        this.__setTransform(ctx);
        
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.setLineDash(this.borderDash);
        this.sceneFunc(ctx);
        ctx.restore();
    }
    
    renderHit(ctx){
        ctx.save();
        this.__setTransform(ctx);
        
        ctx.fillStyle = this.colorKey;
        ctx.strokeStyle = this.colorKey;
        ctx.lineWidth = this.borderWidth;
        this.hitFunc(ctx);
        ctx.restore();
    }
    
    get bound(){
        let s = Math.sin(this.rotation);
        let c = Math.cos(this.rotation);
        let x1 = this.x*c - this.y*s;
        let y1 = this.x*s + this.y*c;
        let x2 = this.width*c - this.skewY*s + this.x*c - this.y*s;
        let y2 = this.width*s + this.skewY*c + this.x*s + this.y*c;
        let x3 = this.skewX*c - this.height*s + this.x*c - this.y*s;
        let y3 = this.skewX*s + this.height*c + this.x*s + this.y*c;
        let x4 = this.width*c - this.skewY*s + this.skewX*c - this.height*s + this.x*c - this.y*s;
        let y4 = this.width*s + this.skewY*c + this.skewX*s + this.height*c + this.x*s + this.y*c;
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
    
    rotate(rotationDelta){
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
    constructor(config){
        super();
        this.startAngle = 0;
        this.endAngle = 2*Math.PI;
        Object.assign(this, config);
    }
    
    sceneFunc(ctx){
        let width = Math.abs(this.width);
        let height = Math.abs(this.height);
        ctx.beginPath();
        ctx.ellipse(width/2, height/2, width/2, height/2, 0, this.startAngle, this.endAngle);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

class IText extends BoxNode{
    constructor(config){
        super();
        this.content = "";
        this.textAlign = "start";
        this.textBaseline = "top";
        this.fontFamily = "Arial";
        this.fontStyle = "";
        Object.assign(this, config);
    }
    
    sceneFunc(ctx){
        let width = Math.abs(this.width);
        let height = Math.abs(this.height);
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.font = `${this.fontStyle} ${height}px ${this.fontFamily}`;
        ctx.fillText(this.content, 0, 0, width);
        ctx.strokeText(this.content, 0, 0, width);
    }
    
    hitFunc(ctx){
        let width = Math.abs(this.width);
        let height = Math.abs(this.height);
        ctx.beginPath();
        ctx.fillRect(0, 0, width, height);
        ctx.strokeRect(0, 0, width, height);
        ctx.closePath();
    }
}

class Image extends BoxNode{
    constructor(config){
        super();
        this.element = null;
        Object.assign(this, config);
    }
    
    set src(src){
        this.element = document.createElement("img");
        this.element.src = src;
    }
    
    get src(){
        return this.element.src;
    }
    
    sceneFunc(ctx){
        if (!this.element){
            return;
        }
        let width = Math.abs(this.width);
        let height = Math.abs(this.height);
        ctx.drawImage(this.element, 0, 0, width, height);
    }
    
    hitFunc(ctx){
        let width = Math.abs(this.width);
        let height = Math.abs(this.height);
        ctx.beginPath();
        ctx.fillRect(0, 0, width, height);
        ctx.strokeRect(0, 0, width, height);
        ctx.closePath();
    }
}

class TextTable extends BoxNode{
    constructor(config){
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
        if (!this.__sizeDirty){
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
                    const text = this.data[row][col] || '';
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
                    const text = this.data[row][col] || '';
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
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let y = 0;
        for (let row = 0; row < this.data.length; row++) {
            let x = 0;
            for (let col = 0; col < this.data[row].length; col++) {
                const cellWidth = this.__colSizes[col];
                const cellHeight = this.__rowSizes[row];

                ctx.strokeRect(x, y, cellWidth, cellHeight);
                const text = this.data[row][col] || '';
                ctx.fillText(text, x + cellWidth / 2, y + cellHeight / 2);

                x += cellWidth;
            }
            y += this.__rowSizes[row];
        }
    }
    
    hitFunc(ctx){
        let width = Math.abs(this.width);
        let height = Math.abs(this.height);
        ctx.beginPath();
        ctx.fillRect(0, 0, width, height);
        ctx.strokeRect(0, 0, width, height);
        ctx.closePath();
    }
}

class Layout extends BoxNode{
    constructor(){
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

class SpaceLayout extends Layout{
    constructor(){
        super();
        this.subNodes = [];
        this.__width = 0;
        this.__height = 0;
        this.fitX = false;
        this.fitY = false
    }
    
    inject(glob){
        super.inject(glob);
        for (let subNode of this.subNodes){
            subNode.inject(glob);
        }
    }
    
    add(node){
        node.inject(this.__glob);
        node.superNode = this;
        this.subNodes.push(node);
        this.__calculateSize();
    }
}

class CoordinatorLayout extends SpaceLayout{
    constructor(config){
        super();
        Object.assign(this, config);
    }
    
    __calculateSize(){
        if (!(this.fitX || this.fitY)){
            return;
        }
        if (this.fitX){
            this.width = 0;
        }
        if (this.fitY){
            this.height = 0;
        }
        for (let subNode of this.subNodes){
            let [bx, by, bw, bh] = subNode.bound;
            blockWidth = bx + bw;
            blockHeight = by + bh;
            if (blockWidth > this.width && this.fitX){
                this.width = blockWidth;
            }
            if (blockHeight > this.height && this.fitY){
                this.height = blockHeight;
            }
        }
    }
    
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
        }
        
        ctx.restore();
    }
}

class LinearLayout extends SpaceLayout{
    constructor(config){
        super();
        Object.assign(this, config);
    }
    
    __calculateSize(){
        if (!(this.fitX || this.fitY)){
            return;
        }
        if (this.fitX){
            this.width = 0;
        }
        if (this.fitY){
            this.height = 0;
        }
        
        for (let subNode of this.subNodes){
            let [bx, by, bw, bh] = subNode.bound;
            let blockWidth = bx + bw;
            let blockHeight = by + bh;
            if (blockWidth > this.width && this.fitX){
                this.width = blockWidth;
            }
            if (this.fitY){
                this.height += blockHeight;
            }
        }
    }
    
    render(ctx){
        this.__calculateSize();
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
        this.__calculateSize();
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
}

class TableLayout extends Layout{
    constructor(config){
        super();
        this.colSizes = [];
        this.rowSizes = [];
        this.data = [];
        Object.assign(this, config);
    }
    
    inject(glob){
        super.inject(glob);
        for (let row of this.data){
            for (let node of row){
                node.inject(glob);
            }
        }
    }
    
    addRow(){
        for (let node of row){
            node.inject(this.__glob);
            node.superNode = this;
        }
        this.data.push([]);
    }
    
    addColumn(rowIndex, node){
        let row = this.data[rowIndex];
        if (!row){
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

// Traversals

function readName(name){
    
}

function createLayout(array){
    let result = new LinearLayout({
        x: 0,
        y: 0,
        width: 500,
        color: "white",
        borderColor: "orange",
        fitY: true,
    });
    for (let object of array){
        let layoutName = "";
        let subArray = [];
        if (object.constructor === Object){
            layoutName = Object.keys(object)[0];
            subArray = Object.values(object)[0];
        }
        else if (object.constructor === String){
            layoutName = object;
        }
        
        let subResult = null;
        let [name, type] = readHeader(layoutName);
        result.add(new IText({
            x: 10,
            y: 10,
            width: 200,
            height: 17,
            color: "blue",
            content: name,
        }));
        if (type === "$T"){
            subResult = createTable(subArray);
            
        }
        else if (type === ""){
            subResult = createLayout(subArray);
        }
        if (subResult.constructor === String){
            return subResult;
        }
        result.add(subResult);
    }
    return result;
}

function createTable(array){
    let data = [];
    for (let row of array){
        let rowResult = inputRead(row, tableLineBegin);
        if (rowResult.constructor === String) {
            return rowResult;
        }
        rowResult.pop();
        data.push(rowResult);
    }
    return new TextTable({
        x: 0,
        y: 0,
        data: data,
        colSizes: new Array(data[0].length).fill(0),
        rowSizes: new Array(data.length).fill(0),
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const g = new GraphWin("mainView");
    g.hit.style.border = "1px solid red";
    document.body.appendChild(g.hit);
    g.setSize(1000, 400);
    
    const structure = jsyaml.load(data);
    
    let path0 = structure[0]["Natural sciences"][2]["Chemistry"][1]["$S Organic Chemistry"]
    let layout = createLayout(path0)
    layout.dy = -250;
    console.log(layout);
    g.add(layout);
    
    
    let path = structure[0]["Natural sciences"][2]["Chemistry"][1]["$S Organic Chemistry"][0]["$T Alkanes"];
    
    
});

// Input reader (Very ugly code)

function fulfillCondition(condition, data) {
    switch (condition.constructor) {
        case String:
            return data === condition;
        case RegExp:
            return condition.test(data);
    }
    return false;
}

function inputRead(data, currentState) {
    let position = 0;
    let entry = "";
    let result = [];
    while (data.charAt(position) !== "") {
        let character = data.charAt(position);
        let index = 0;
        let running = true;
        while (index < currentState.length && running) {
            let [condition, nextState, consume, record] = currentState[index];
            if (fulfillCondition(condition, character)) {
                if (record) {
                    entry += character;
                }
                if (consume) {
                    position++;
                }
                if (nextState) {
                    result.push(entry);
                    entry = "";
                    currentState = nextState;
                }
                running = false;
            }
            index++;
        }
        if (running) {
            return `Following data is malformed: "${data}"`;
        }
    }
    result.push(entry);
    return result;
}

const headerBegin = [];
const headerReadType = [];
const headerReadName = [];

headerBegin.push(["$", headerReadType, false, false]);
headerBegin.push(["\\", headerReadName, true, false]);
headerBegin.push([/./, headerReadName, false, false]);

headerReadType.push([/^\S+$/, null, true, true]);
headerReadType.push([" ", headerReadName, true, false]);

headerReadName.push([/./, null, true, true]);

const refBegin = [];
const refReadType = [];
const refReadName = [];

refBegin.push(["=", refReadType, false, false]);
refBegin.push(["\\", refReadName, true, false]);
refBegin.push([/./, refReadName, false, false]);

refReadType.push([/^\S+$/, null, true, true]);
refReadType.push([" ", refReadName, true, false]);

refReadName.push([/./, null, true, true]);

const tableLineBegin = [];
const tableLineColumn = [];
const tableLineEnd = [];

tableLineBegin.push([/[^\[]/, null, true, true]);
tableLineBegin.push(["[", tableLineColumn, true, false]);

tableLineColumn.push([/[^\s\]]/, null, true, true]);
tableLineColumn.push([" ", tableLineColumn, true, false]);
tableLineColumn.push(["]", tableLineEnd, true, false]);

function readHeader(item) {
    let itemName = "";
    let itemType = "";
    let itemResult = inputRead(item, headerBegin);
    if (itemResult.length === 2) {
        [, itemName] = itemResult;
    } else if (itemResult.length === 3) {
        [, itemType, itemName] = itemResult;
    }
    return [itemName, itemType];
}

function readRef(item) {
    let itemRef = "";
    let itemName = "";
    let itemResult = inputRead(item, refBegin);
    if (itemResult.length === 2) {
        [, itemName] = itemResult;
    } else if (itemResult.length === 3) {
        [, itemRef, itemName] = itemResult;
    }
    return [itemName, itemRef];
}

// AOORA Core features

class AOORACoreBase {
    fromObject(object) {
        throw new Error(".fromObject is not implemented yet");
    }

    toObject(object) {
        throw new Error(".toObject is not implemented yet");
    }

    static create(object) {
        let result = new this();
        result.fromObject(object);
        return result;
    }
}

class Graph extends AOORACoreBase {
    constructor() {
        super();
        this.data = {};
    }

    checkVertex(vertex) {
        if (!this.data[vertex]) {
            throw new Error(`No vertex named "${vertex}"`);
        }
    }

    getSrcVertices(vertex) {
        this.checkVertex(vertex);
        return this.data[vertex][SRC_VERTEX];
    }

    getDestVertices(vertex) {
        this.checkVertex(vertex);
        return this.data[vertex][DEST_VERTEX];
    }

    setVertexInfo(vertex, vertexInfo) {
        this.checkVertex(vertex);
        this.data[vertex][VERTEX_INFO] = vertexInfo;
    }

    getVertexInfo(vertex) {
        this.checkVertex(vertex);
        return this.data[vertex][VERTEX_INFO];
    }

    hasOwnProperty(vertex) {
        return vertex in this.data;
    }

    addVertex(vertex, vertexInfo = null) {
        if (this.data[vertex]) {
            throw new Error("Vertex has been already added");
        }
        this.data[vertex] = [[], [], vertexInfo];
    }

    addEdge(srcVertex, destVertex, sortIndex = null) {
        let destVertices = this.getDestVertices(srcVertex);
        if (arrayHas(destVertices, destVertex)) {
            throw new Error(
                `Edge between ${srcVertex} and ${destVertex} has already been added`
            );
        }
        if (isNull(sortIndex)) {
            destVertices.push(destVertex);
        } else {
            destVertices.splice(sortIndex, 0, destVertex);
        }
        this.getSrcVertices(destVertex).push(srcVertex);
    }

    updateEdge(srcVertex, destVertex, newSrcVertex) {
        this.removeEdge(srcVertex, destVertex);
        this.addEdge(newSrcVertex, destVertex, null);
    }

    sortEdge(srcVertex, destVertex, newSortIndex) {
        let destVertices = this.getDestVertices(srcVertex);
        let oldSortIndex = destVertices.indexOf(destVertex);
        if (oldSortIndex === -1) {
            throw new Error(
                `No edge exists between ${srcVertex} and ${destVertex}`
            );
        }
        arrayMove(destVertices, oldSortIndex, newSortIndex);
    }

    removeVertex(vertex) {
        for (let srcVertex of this.getSrcVertices(vertex)) {
            arrayDelete(this.getDestVertices(srcVertex), vertex);
        }
        for (let destVertex of this.getDestVertices(vertex)) {
            arrayDelete(this.getSrcVertices(destVertex), vertex);
        }
        delete this.data[vertex];
    }

    removeEdge(srcVertex, destVertex) {
        let srcVertices = this.getSrcVertices(destVertex);
        let destVertices = this.getDestVertices(srcVertex);
        if (!arrayHas(destVertices, destVertex)) {
            throw new Error(
                `Cannot delete non-existing edge between ${srcVertex} and ${destVertex}`
            );
        }
        arrayDelete(srcVertices, srcVertex);
        arrayDelete(destVertices, destVertex);
    }

    removeAll() {
        for (let vertex of Object.keys(this.data)) {
            delete this.data[vertex];
        }
    }
}

class Table extends AOORACoreBase {
    constructor(colNames = [], data = []) {
        super();
        this.colNames = colNames;
        this.data = data;
    }

    __checkRowCol(row, col) {
        if (row < 0 || row >= this.data.length) {
            throw new Error(`No row number named ${row}`);
        }
        if (col < 0 || col >= this.data[row].length) {
            throw new Error(`No col number named ${col}`);
        }
    }

    fromObject(array) {
        arrayClear(this.data);
        for (let row of array) {
            let rowResult = inputRead(row, tableLineBegin);
            if (rowResult.constructor === String) {
                return rowResult;
            }
            rowResult.pop();
            this.data.push(rowResult);
        }
    }

    toObject() {}

    append(data) {
        this.data.push(data);
    }

    add(row, data) {
        this.data.splice(row, 0, data);
    }

    remove(row = -1) {
        if (row === -1 || row === this.data.length - 1) {
            this.data.pop();
        } else {
            this.data.splice(row, 1);
        }
    }

    set(row, col, data) {
        this.__checkRowCol(row, col);
        this.data[row][col] = data;
    }

    get(row, col) {
        this.__checkRowCol(row, col);
        return this.data[row][col];
    }
}

const structureMap = {
    $T: Table,
    $G: Graph,
};

function extractEntry(entry) {
    let item = null;
    let subObject = [];
    if (isObject(entry)) {
        item = Object.keys(entry)[0];
        subObject = entry[item];
    } else if (isString(entry)) {
        item = entry;
    }
    return [item, subObject];
}

function createLoop(object, typeMap) {
    let result = [];
    for (let entry of object) {
        let [item, subObject] = extractEntry(entry);
        let [itemName, itemType] = readHeader(item);
        let subResult = null;
        if (itemType) {
            let classEntity = typeMap[itemType];
            if (!classEntity) {
                return `Type ${itemType} is invalid in "${item}"`;
            }
            subResult = classEntity.create(subObject);
        } else {
            subResult = createLoop(subObject, typeMap);
        }
        if (subResult.constructor === String) {
            return subResult;
        }
        result.push([itemName, subResult]);
    }
    return result;
}

class CollectionSegment extends AOORACoreBase {
    constructor() {
        super();
        this.data = [];
    }

    fromObject(object) {
        let resultData = createLoop(object, structureMap);
        if (resultData.constructor === String) {
            return resultData;
        }
        this.data = resultData;
    }
}

const collectionMap = {
    $S: CollectionSegment,
};

class AOORABloodGemCore extends CollectionSegment {
    fromObject(object) {
        let resultData = createLoop(object, collectionMap);
        if (resultData.constructor === String) {
            return resultData;
        }
        this.data = resultData;
    }
}

// Onion peeler

function peelOnion(array, handler, result = []){
    for (let object of array){
        let name = "";
        let subArray = null;
        if (object.constructor === Object){
            name = Object.keys(object)[0];
            subArray = Object.values(object)[0];
        }
        else if (object.constructor === String){
            name = object;
        }
        
        let [flag, problem] = handler(result, name, subArray);
        if (problem){
            return problem;
        }
        
        if (subArray && flag){
            peelOnion(subArray, handler);
        }
    }
    return result;
}

function onionPeeler1(name, array){
    console.log("O", name, array);
    
    return true;
}

// Wrappers

function create(name, clsName, txt = "") {
    let HTMLElement = document.createElement(name);
    HTMLElement.className = clsName;
    HTMLElement.textContent = txt;
    return HTMLElement;
}

function clear() {
    HTMLElement.innerHTML = "";
}

function activate(eNode) {
    if (!eNode) {
        return;
    }
    eNode.classList.add("active");
}

function deactivate(eNode) {
    if (!eNode) {
        return;
    }
    eNode.classList.remove("active");
}

function isActive(eNode) {
    if (!eNode) {
        return false;
    }
    return eNode.classList.contains("active");
}

class AOORABloodGemWrapper {
    constructor() {
        this.core = new AOORABloodGemCore();
        this.treeView = document.getElementById("treeView");
        this.mainTabs = document.getElementById("mainTabs");
        this.mainView = document.getElementById("mainView");
        this.tabs = [];
        this.eTabActive = null;
        this.start();
    }

    start() {
        const structure = jsyaml.load(data);
        this.core.fromObject(structure);
        this.updateTreeUI();
    }

    __createTree(node) {
        let sys = this;
        let [nodeName, subnodes] = node;
        let eNode = create("div", "node");
        let eNodeName = create("span", "node-name", nodeName);
        eNode.draggable = true;

        if (Array.isArray(subnodes)) {
            eNode.classList.add("group");
            eNodeName.addEventListener("click", function () {
                let subENodes = eNode.querySelector("div");
                if (!subENodes) {
                    subENodes = create("div", "nodes");
                    for (let subnode of subnodes) {
                        subENodes.appendChild(sys.__createTree(subnode));
                    }
                    eNode.appendChild(subENodes);
                    eNode.classList.add("expanded");
                } else {
                    if (subENodes.style.display === "block") {
                        subENodes.style.display = "none";
                        eNode.classList.remove("expanded");
                    } else {
                        subENodes.style.display = "block";
                        eNode.classList.add("expanded");
                    }
                }
            });
        } else {
            eNode.classList.add("leaf");
            eNodeName.addEventListener("click", function () {
                sys.addTab(node);
            });
        }

        eNode.appendChild(eNodeName);
        return eNode;
    }

    updateTreeUI() {
        clear(this.treeView);
        for (let node of this.core.data) {
            this.treeView.appendChild(this.__createTree(node));
        }
    }

    addTab(newNode) {
        let newETab = null;
        for (let [node, eTab] of this.tabs) {
            if (node === newNode) {
                newETab = eTab;
            }
        }
        if (!newETab) {
            let sys = this;
            let name = newNode[0];
            let newVNode = newNode[1];
            newETab = create("td", "tab", name);
            let eDel = create("span", "del", "X");
            newETab.draggable = true;
            newETab.appendChild(eDel);
            newETab.addEventListener("click", function () {
                deactivate(sys.eTabActive);
                sys.eTabActive = newETab;
                if (sys.eTabActive) {
                    activate(sys.eTabActive);
                    sys.appeal(newVNode);
                }
            });
            eDel.addEventListener("click", function (evt) {
                evt.stopPropagation();
                let neweTabActive = sys.eTabActive;
                if (sys.eTabActive === newETab) {
                    neweTabActive = newETab.nextSibling;
                    if (!neweTabActive) {
                        neweTabActive = newETab.previousSibling;
                    }
                }
                var index = sys.tabs.findIndex(function (x) {
                    return x[1] === newETab;
                });
                if (index > -1) {
                    sys.tabs.splice(index, 1);
                }
                newETab.parentElement.removeChild(newETab);
                if (neweTabActive){
                    neweTabActive.click();
                }
            });
            this.mainTabs.appendChild(newETab);
            this.tabs.push([newNode, newETab]);
        }
        newETab.click();
    }

    appeal(data) {
        console.log(data);
    }
}
