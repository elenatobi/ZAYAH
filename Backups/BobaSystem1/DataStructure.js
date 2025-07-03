export class Tree {
    constructor(name = "", subNodes = []) {
        this.name = name;
        this.subNodes = subNodes;
    }

    copy() {
        let copy = new Tree(this.name, []);
        for (let i = 0; i < this.subNodes.length; i++) {
            copy.push(this.get(i).copy());
        }
        return copy;
    }

    toString() {
        return `${this.name}(${this.subNodes.join(", ")})`;
    }

    clear() {
        this.subNodes = [];
    }

    isLeaf() {
        return this.subNodes.length === 0;
    }

    setName(newName) {
        this.name = newName;
    }

    getName() {
        return this.name;
    }

    setSubNodes(newSubNodes) {
        this.subNodes = newSubNodes;
    }

    getSubNodes() {
        return this.subNodes;
    }

    set(index, value) {
        this.subNodes[index] = value;
    }

    get(index) {
        return this.subNodes[index];
    }

    unshift(value) {
        this.subNodes.unshift(value);
    }

    shift() {
        return this.subNodes.shift();
    }

    push(value) {
        this.subNodes.push(value);
    }

    pop() {
        return this.subNodes.pop();
    }

    indexOf(value) {
        return this.subNodes.indexOf(value);
    }

    includes(value) {
        return this.subNodes.includes(value);
    }

    splice(index, count, ...values) {
        this.subNodes.splice(index, count, ...values);
    }

    insert(index, value) {
        this.subNodes.splice(index, 0, value);
    }

    remove(index) {
        this.splice(index, 1);
    }
}

export class GraphAdjacancy {
    constructor(adjacency = null) {
        this.adjacency = new Map(adjacency);
    }

    set(vertex, value) {
        this.adjacency.set(vertex, value);
    }

    get(vertex) {
        return this.adjacency.get(vertex);
    }

    includes(vertex) {
        return this.adjacency.has(vertex);
    }

    remove(vertex) {
        this.adjacency.delete(vertex);
    }

    addVertex(vertex) {
        this.set(vertex, []);
    }

    addEdge(vertex1, vertex2) {
        this.get(vertex1).push(vertex2);
    }
}

export class GraphSeparate {
    constructor(vertices = [], edges = []) {
        this.vertices = new Map(vertices);
        this.edges = edges;
    }

    addVertex(id, vertexName) {
        this.vertices.set(id, vertexName);
    }

    addEdge(vertex1, vertex2, sortId = 1) {
        this.edges.push([vertex1, vertex2, sortId]);
    }
}