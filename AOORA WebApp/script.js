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

function hide(HTMLElement) {
    HTMLElement.style.display = "none";
}

function show(HTMLElement) {
    HTMLElement.style.display = "block";
}

function isShown(HTMLElement) {
    return HTMLElement.style.display === "block";
}

function DragPlaceholder() {
    return create("div", "node placeholder");
}

function ENode(node) {
    let [nodeName, subnodes] = node;
    let eNode = create("div", "node");
    let eNodeName = create("span", "node-name", nodeName);
    eNode.draggable = true;
    eNode.node = node;
    eNode.subnodes = subnodes;
    eNode.isClickable = true;

    let origNodeName = null;
    if (Array.isArray(subnodes)) {
        eNode.classList.add("group");
    } else {
        eNode.classList.add("leaf");
    }
    eNodeName.addEventListener("dblclick", function (evt) {
        evt.preventDefault();
        evt.stopImmediatePropagation();
        evt.target.contentEditable = "true";
        eNode.isClickable = false;
        evt.target.focus();
        origNodeName = eNodeName.textContent;
    });
    eNodeName.addEventListener("focusout", function (evt) {
        evt.target.contentEditable = "false";
        eNode.isClickable = true;
        if (eNodeName.textContent.trim() === "") {
            eNodeName.textContent = origNodeName;
        }
    });
    eNodeName.addEventListener("keydown", function (evt) {
        if (evt.keyCode === 13) {
            evt.target.contentEditable = "false";
            eNode.isClickable = true;
            if (eNodeName.textContent.trim() === "") {
                eNodeName.textContent = origNodeName;
            }
        }
    });
    eNode.appendChild(eNodeName);
    return eNode;
}

function ENodes(nodes) {
    let eNodes = create("div", "nodes");
    for (let node of nodes) {
        eNodes.appendChild(ENode(node));
    }
    return eNodes;
}

function isExpanded(eNode) {
    let subENodes = eNode.querySelector("div");
    if (!subENodes) {
        return false;
    }
    return isShown(subENodes);
}

function isLeaf(eNode) {
    return eNode.classList.contains("leaf");
}

function expand(eNode) {
    let subENodes = eNode.querySelector("div");
    if (!subENodes) {
        subENodes = ENodes(eNode.subnodes);
        eNode.appendChild(subENodes);
    }
    show(subENodes);
    eNode.classList.add("expanded");
}

function collapse(eNode) {
    let subENodes = eNode.querySelector("div");
    if (!subENodes) {
        return;
    }
    hide(subENodes);
    eNode.classList.remove("expanded");
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

function getESubnodes(eNode) {
    if (isLeaf(eNode)) {
        return null;
    }
    let children = eNode.children;
    if (children.length < 2) {
        expand(eNode);
    }
    return children[1];
}

function ETab(tabName, node) {
    let eTab = create("td", "tab", tabName);
    let eDel = create("span", "del", "X");
    eTab.draggable = true;
    eTab.node = node;
    eTab.appendChild(eDel);

    return eTab;
}

class AOORABloodGemWrapper {
    constructor() {
        this.core = new AOORABloodGemCore();
        this.treeView = document.getElementById("treeView");
        this.mainTabs = document.getElementById("mainTabs");
        this.mainView = document.getElementById("mainView");
        this.tabs = new Map();
        this.eActive = null;
        this.eTabActive = null;
        this.start();
    }

    start() {
        const structure = jsyaml.load(data);
        this.core.fromObject(structure);
        this.updateTreeUI();
        this.treeView.addEventListener(
            "click",
            function (evt) {
                this.updateEActive(evt.target);
            }.bind(this)
        );
        this.mainTabs.addEventListener(
            "click",
            function (evt) {
                this.updateETabActive(evt.target);
            }.bind(this)
        );

        /*
        // Only for testing
        const appealNode = this.core.data[0][1][3];
        this.addTab(appealNode);
        //this.appeal(appealNode);
        */
    }
    
    updateTreeUI(){
        clear(this.treeView);
        this.treeView.appendChild(ENodes(this.core.data));
    }

    updateEActive(neweActive) {
        if (neweActive.classList.contains("node-name")) {
            neweActive = neweActive.parentNode;
            if (isLeaf(neweActive)) {
                this.addTab(neweActive.node);
            } else if (neweActive.isClickable) {
                if (isExpanded(neweActive)) {
                    collapse(neweActive);
                } else {
                    expand(neweActive);
                }
            }
        }
        
    }

    updateETabActive(eTab) {
        let neweTabActive = eTab;
        if (eTab.classList.contains("del")) {
            let removedETab = eTab.parentElement;
            if (this.eTabActive === removedETab){
                neweTabActive = removedETab.previousSibling;
                if (!neweTabActive) {
                    neweTabActive = removedETab.nextSibling;
                    console.log("neweTabActive", neweTabActive);
                }
            }
            else{
                neweTabActive = this.eTabActive;
            }
            this.tabs.delete(removedETab.node);
            removedETab.parentElement.removeChild(removedETab);
            
        }
        deactivate(this.eTabActive);
        this.eTabActive = neweTabActive;
        if (this.eTabActive){
            activate(this.eTabActive);
            this.appeal(this.eTabActive.node);
        }
    }

    addTab(node) {
        let name = node[0];
        let eTab = null;
        if (this.tabs.has(node)) {
            eTab = this.tabs.get(node);
        } else {
            eTab = ETab(name, node);
            this.mainTabs.appendChild(eTab);
            this.tabs.set(node, eTab);
        }
        this.updateETabActive(eTab);
        this.appeal(node);
    }

    removeTab(node) {}

    appeal(node) {
        this.mainView.innerHTML = node[1].data.flat(Infinity);
    }
}

/*

function main() {
    const treeView = document.getElementById("treeView");

    let draggingEle = null;
    let placeholder = null;

    function onDragStart(e) {
        draggingEle = e.target;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", null);

        placeholder = DragPlaceholder();
        draggingEle.parentNode.insertBefore(
            placeholder,
            draggingEle.nextSibling
        );

        setTimeout(function () {
            hide(draggingEle);
        }, 0);
    }

    function onDragOver(e) {
        e.preventDefault();
        const target = e.target;

        if (
            target &&
            target !== draggingEle &&
            target.classList.contains("node")
        ) {
            const parentNode = target.parentNode;
            const rect = target.getBoundingClientRect();
            let upperY = rect.top + rect.height / 3;
            let lowerY = rect.top + (2 * rect.height) / 3;

            if (target.classList.contains("leaf")) {
                upperY = rect.top + rect.height / 2;
                lowerY = upperY;
            }

            if (e.clientY < upperY) {
                parentNode.insertBefore(placeholder, target);
            } else if (upperY < e.clientY && e.clientY < lowerY) {
                if (!target.contains(placeholder)) {
                    target.appendChild(placeholder);
                }
            } else {
                parentNode.insertBefore(placeholder, target.nextSibling);
            }
        }
    }

    function onDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        show(draggingEle);

        const target = e.target;
        if (target && target.classList.contains("node")) {
            const rect = target.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;

            const parentNode = target.parentNode;
            if (e.clientY > midY) {
                parentNode.insertBefore(draggingEle, target.nextSibling);
            } else {
                parentNode.insertBefore(draggingEle, target);
            }
        } else {
            treeView.appendChild(draggingEle);
        }

        if (placeholder && placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
        }

        draggingEle = null;
        placeholder = null;
    }

    function onDragEnd() {
        if (placeholder && placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
        }

        if (draggingEle) {
            show(draggingEle);
        }

        draggingEle = null;
        placeholder = null;
    }

    treeView.addEventListener("dragstart", onDragStart);
    treeView.addEventListener("dragover", onDragOver);
    treeView.addEventListener("drop", onDrop);
    treeView.addEventListener("dragend", onDragEnd);
}

document.addEventListener("DOMContentLoaded", main);
*/
