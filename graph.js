const VERTEX = 0;
const CACHE = 1;

const ROOT_INDEX = 0;
const ROOT_NAME = '~';

function isNull(value) {
    return value === null;
}

function isNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

function isDefined(value) {
    return typeof value !== 'undefined';
}

function arrayHas(array, value) {
    return array.indexOf(value) !== -1;
}

function arrayClear(array) {
    let length = array.length;
    for (let i = 0; i < length; i++) {
        array.pop();
    }
}

function deleteFromArray(array, value) {
    let i = 0;
    while (i < array.length) {
        if (array[i] === value) {
            array.splice(i, 1);
        } else {
            i++;
        }
    }
}

function arrayMove(array, index1, index2) {
    array.splice(index2, 0, array.splice(index1, 1)[0]);
}

class Timeline {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }

    action(value) {
        this.undoStack.push(value);
        arrayClear(this.redoStack);
    }

    undo() {
        let value = this.undoStack.pop();
        this.redoStack.push(value);
        return value;
    }

    redo() {
        let value = this.redoStack.pop();
        this.undoStack.push(value);
        return value;
    }
}

class Graph {
    constructor(data = {}) {
        this.data = data;
    }

    hasOwnProperty(vertex) {
        return isDefined(this.data[vertex]);
    }

    getVertices(vertex) {
        if (!this.data[vertex]) {
            throw new Error(`No vertex named "${vertex}"`);
        }
        return this.data[vertex][VERTEX];
    }

    getCache(vertex) {
        if (!this.data[vertex]) {
            throw new Error(`No vertex named "${vertex}"`);
        }
        return this.data[vertex][CACHE];
    }

    addVertex(vertex) {
        if (this.data[vertex]) {
            throw new Error('Vertex has been already added');
        }
        this.data[vertex] = [[], []];
    }

    addEdge(vertex1, vertex2, sortIndex = null) {
        let v1 = this.getVertices(vertex1);
        if (arrayHas(v1, vertex2)) {
            throw new Error(`${vertex1} has already ${vertex2}`);
        }
        if (!isNull(sortIndex)) {
            v1.splice(sortIndex, 0, vertex2);
        } else {
            v1.push(vertex2);
        }
        this.getCache(vertex2).push(vertex1);
    }

    updateEdge(vertex1, vertex2, newVertex1) {
        this.deleteEdge(vertex1, vertex2);
        this.addEdge(newVertex1, vertex2, null);
    }

    sortEdge(vertex1, vertex2, newSortId) {
        let v1 = this.getVertices(vertex1);
        let sortId = v1.indexOf(vertex2);
        if (sortId === -1) {
            throw new Error(`No vertex named ${vertex2}`);
        }
        arrayMove(v1, sortId, newSortId);
    }

    deleteVertex(vertex) {
        for (let vertex1 of this.getCache(vertex)) {
            deleteFromArray(this.getVertices(vertex1), vertex);
        }
        for (let vertex2 of this.getVertices(vertex)) {
            deleteFromArray(this.getCache(vertex2), vertex);
        }
        delete this.data[vertex];
    }

    deleteEdge(vertex1, vertex2) {
        let v1 = this.getVertices(vertex1);
        let v2 = this.getCache(vertex2);
        if (!arrayHas(v1, vertex2)) {
            throw new Error(`${vertex1} has no ${vertex2}`);
        }
        deleteFromArray(v1, vertex2);
        deleteFromArray(v2, vertex1);
    }

    DFS(startVertex, handler, visited = new Set()) {
        visited.add(startVertex);
        handler(startVertex);
        for (let vertex of this.getVertices(startVertex)) {
            if (!visited.has(vertex)) {
                this.DFS(vertex, handler, visited);
            }
        }
    }

    display() {
        for (let property in this.data) {
            let [nodes, cache] = this.data[property];
            console.log(property, '->', nodes, '/', cache);
        }
    }
}

class AuraEditor {
    constructor() {
        this.graph = new Graph();
        this.values = {};
        this.idPath = [ROOT_INDEX];
        this.namePath = [ROOT_NAME];
        this.nextId = ROOT_INDEX + 1;
        this.graph.addVertex(ROOT_INDEX);
        this.values[ROOT_INDEX] = ROOT_NAME;
    }

    getId() {
        return this.idPath[this.idPath.length - 1];
    }

    getPath() {
        this.namePath.join('/');
    }

    sourceId(srcId) {
        return (srcId = srcId ? srcId : this.getId());
    }

    addVertex(item, sortId = null, srcId = null) {
        srcId = this.sourceId(srcId);
        this.values[this.nextId] = item;
        this.graph.addVertex(this.nextId);
        this.graph.addEdge(srcId, this.nextId, sortId);
        this.nextId++;
    }

    addEdge(srcId, destId, sortId = null) {
        srcId = this.sourceId(srcId);
        this.graph.addEdge(srcId, destId, sortId);
    }

    updateVertex(id, newItem) {
        this.values[id] = newItem;
    }

    list(srcId = null) {
        srcId = this.sourceId(srcId);
        let result = [];
        for (let id of this.graph.getVertices(srcId)) {
            result.push([id, this.values[id]]);
        }
        return result;
    }
}

let g = new Graph();
g.addVertex(1);
g.addVertex(2);
g.addVertex(3);
g.addVertex(4);
g.addVertex(5);
g.addVertex(6);
g.addEdge(1, 2);
g.addEdge(1, 3);
g.addEdge(2, 4);
g.addEdge(2, 5);
g.addEdge(1, 6);
g.addEdge(3, 4);
g.display();
g.sortEdge(1, 6, 1);
g.display();
let result = [];
g.DFS(1, function (vertex) {
    result.push(vertex);
});
console.log(result);
