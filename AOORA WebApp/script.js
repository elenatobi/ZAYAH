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

// HTML5 Canvas Graphics/GUI

function getRandomRGBColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

const colorMap = {};

const eventMap = {
    "mousemove": ["mousemove", function(event){
        return [event.offsetX, event.offsetY];
    }]
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
    }
    
    add(node){
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
        if (!this.dirty){
            return;
        }
        this.render(this.ctx);
        this.dirty = false;
        requestAnimationFrame(this.rerender.bind(this));
        console.log("Re-rendered!")
    }
    
    startEvent(name){
        let sys = this;
        let [basicName, calcPos] = eventMap[name];
        this.canvas.addEventListener(basicName, function(event){
            if (sys.hitDirty){
                sys.renderHit(sys.hitCtx);
                sys.hitDirty = false;
            }
            let [x, y] = calcPos(event);
            let pixel = sys.hitCtx.getImageData(x, y, 1, 1).data;
            let color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            let target = colorMap[color];
            if (target){
                target.fire(name, {x: x, y: y});
            }
        });
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
        while (this.colorKey in colorMap){
            this.colorKey = getRandomRGBColor();
        }
        colorMap[this.colorKey] = this;
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
        if (!(name in this.handlers)){
            return;
        }
        for (let handler of this.handlers[name]){
            handler.call(this, event);
        }
    }
    
    destroy(){
        delete colorMap[this.colorKey];
        delete this.colorKey;
        delete this;
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
        this.sceneFunc(ctx);
        ctx.restore();
    }
}

class Rect extends BoxNode {
    constructor(config) {
        super();
        Object.assign(this, config);
    }

    sceneFunc(ctx) {
        let width = Math.abs(this.width);
        let height = Math.abs(this.height)
        ctx.beginPath();
        ctx.fillRect(0, 0, width, height);
        ctx.strokeRect(0, 0, width, height);
        ctx.closePath();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const g = new GraphWin("mainView");
    g.hit.style.border = "1px solid red";
    document.body.appendChild(g.hit);
    g.setSize(500, 400);
    let r = new Rect({
        x: 232,
        y: 170,
        width: 125,
        height: 35,
        skewX: 51,
        skewY: 29,
        color: "red",
    });
    r.bind("mousemove", function(event){
        console.log(event.x, event.y);
    });
    g.add(r);
    // Only for testing
    window.r = r;
    window.g = g;
    window.colorMap = colorMap;
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

// Aura Core features

class AuraCoreBase {
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

class Graph extends AuraCoreBase {
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

class Table extends AuraCoreBase {
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

class CollectionSegment extends AuraCoreBase {
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
            let newVNode = newNode[1].data.flat(Infinity);
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

    removeTab(node) {}

    appeal(data) {
        console.log(data);
    }
}
