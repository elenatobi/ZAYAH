const SRC_VERTEX = 0;
const DEST_VERTEX = 1;
const VERTEX_INFO = 2;

// Utility functions

function isNull(value) {
    return value === null;
}

function isNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

function isString(value) {
    return typeof value === 'string';
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

function arrayClear(array){
    array.splice(0, array.length)
}

// Input reader (Very ugly code) 

function fulfillCondition(condition, data){
    switch (condition.constructor){
        case String:
            return data === condition;
        case RegExp:
            return condition.test(data);
    }
    return false;
}

function inputRead(data, currentState){
    let position = 0;
    let entry = "";
    let result = [];
    while (data.charAt(position) !== ""){
        let character = data.charAt(position);
        let index = 0;
        let running = true;
        while (index < currentState.length && running){
            let [condition, nextState, consume, record] = currentState[index];
            if (fulfillCondition(condition, character)){
                if (record){
                    entry += character;
                }
                if (consume){
                    position++;
                }
                if (nextState){
                    result.push(entry);
                    entry = "";
                    currentState = nextState;
                }
                running = false;
            }
            index++;
        }
        if (running){
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

function readHeader(item){
    let itemName = "";
    let itemType = "";
    let itemResult = inputRead(item, headerBegin);
    if (itemResult.length === 2){
        [, itemName] = itemResult;
    }
    else if (itemResult.length === 3){
        [, itemType, itemName] = itemResult;
    }
    return [itemName, itemType];
}

function readRef(item){
    let itemRef = "";
    let itemName = "";
    let itemResult = inputRead(item, refBegin);
    if (itemResult.length === 2){
        [, itemName] = itemResult;
    }
    else if (itemResult.length === 3){
        [, itemRef, itemName] = itemResult;
    }
    return [itemName, itemRef];
}

// Aura Core features

class AuraCoreBase{
    fromObject(object){
        throw new Error(".fromObject is not implemented yet");
    }
    
    toObject(object){
        throw new Error(".toObject is not implemented yet");
    }
    
    static create(object){
        let result = new this();
        result.fromObject(object);
        return result;
    }
}

class Graph extends AuraCoreBase{
    constructor(){
        super();
        this.data = {};
    }
    
    checkVertex(vertex){
        if (!this.data[vertex]){
            throw new Error(`No vertex named "${vertex}"`);
        }
    }
    
    getSrcVertices(vertex){
        this.checkVertex(vertex);
        return this.data[vertex][SRC_VERTEX];
    }
    
    getDestVertices(vertex){
        this.checkVertex(vertex);
        return this.data[vertex][DEST_VERTEX];
    }
    
    setVertexInfo(vertex, vertexInfo){
        this.checkVertex(vertex);
        this.data[vertex][VERTEX_INFO] = vertexInfo;
    }
    
    getVertexInfo(vertex){
        this.checkVertex(vertex);
        return this.data[vertex][VERTEX_INFO];
    }
    
    hasOwnProperty(vertex){
        return vertex in this.data;
    }
    
    addVertex(vertex, vertexInfo = null) {
        if (this.data[vertex]) {
            throw new Error('Vertex has been already added');
        }
        this.data[vertex] = [[], [], vertexInfo];
    }
    
    addEdge(srcVertex, destVertex, sortIndex = null) {
        let destVertices = this.getDestVertices(srcVertex);
        if (arrayHas(destVertices, destVertex)) {
            throw new Error(`Edge between ${srcVertex} and ${destVertex} has already been added`);
        }
        if (isNull(sortIndex)) {
            destVertices.push(destVertex);
        }
        else {
            destVertices.splice(sortIndex, 0, destVertex);
        }
        this.getSrcVertices(destVertex).push(srcVertex);
    }
    
    updateEdge(srcVertex, destVertex, newSrcVertex){
        this.removeEdge(srcVertex, destVertex);
        this.addEdge(newSrcVertex, destVertex, null);
    }
    
    sortEdge(srcVertex, destVertex, newSortIndex){
        let destVertices = this.getDestVertices(srcVertex);
        let oldSortIndex = destVertices.indexOf(destVertex);
        if (oldSortIndex === -1){
            throw new Error(`No edge exists between ${srcVertex} and ${destVertex}`);
        }
        arrayMove(destVertices, oldSortIndex, newSortIndex);
    }
    
    removeVertex(vertex){
        for (let srcVertex of this.getSrcVertices(vertex)){
            arrayDelete(this.getDestVertices(srcVertex), vertex);
        }
        for (let destVertex of this.getDestVertices(vertex)){
            arrayDelete(this.getSrcVertices(destVertex), vertex);
        }
        delete this.data[vertex];
    }
    
    removeEdge(srcVertex, destVertex){
        let srcVertices = this.getSrcVertices(destVertex);
        let destVertices = this.getDestVertices(srcVertex);
        if (!arrayHas(destVertices, destVertex)){
            throw new Error(`Cannot delete non-existing edge between ${srcVertex} and ${destVertex}`);
        }
        arrayDelete(srcVertices, srcVertex);
        arrayDelete(destVertices, destVertex);
    }
    
    removeAll(){
        for (let vertex of Object.keys(this.data)){
            delete this.data[vertex];
        }
    }
}

class Table extends AuraCoreBase{
    constructor(colNames = [], data = []){
        super();
        this.colNames = colNames;
        this.data = data;
    }
    
    __checkRowCol(row, col){
        if (row < 0 || row >= this.data.length){
            throw new Error(`No row number named ${row}`);
        }
        if (col < 0 || col >= this.data[row].length){
            throw new Error(`No col number named ${col}`);
        }
    }
    
    fromObject(array){
        arrayClear(this.data);
        for (let row of array){
            let rowResult = inputRead(row, tableLineBegin)
            if (rowResult.constructor === String){
                return rowResult;
            }
            rowResult.pop()
            this.data.push(rowResult);
        }
    }
    
    toObject(){
        
    }
    
    append(data){
        this.data.push(data);
    }
    
    add(row, data){
        this.data.splice(row, 0, data);
    }
    
    remove(row = -1){
        if (row === -1 || row === this.data.length-1){
            this.data.pop();
        }
        else{
            this.data.splice(row, 1);
        }
    }
    
    set(row, col, data){
        this.__checkRowCol(row, col);
        this.data[row][col] = data;
    }
    
    get(row, col){
        this.__checkRowCol(row, col);
        return this.data[row][col];
    }
}

const structureMap = {
    "$T": Table,
    "$G": Graph
}

function extractEntry(entry){
    let item = null;
    let subObject = [];
    if (isObject(entry)){
        item = Object.keys(entry)[0];
        subObject = entry[item]
    }
    else if (isString(entry)){
        item = entry;
    }
    return [item, subObject];
}

function createLoop(object, typeMap){
    let result = [];
    for (let entry of object){
        let [item, subObject] = extractEntry(entry);
        let [itemName, itemType] = readHeader(item);
        let subResult = null;
        if (itemType){
            let classEntity = typeMap[itemType];
            if (!classEntity){
                return `Type ${itemType} is invalid in "${item}"`;
            }
            subResult = classEntity.create(subObject);
        }
        else{
            subResult = createLoop(subObject, typeMap);
        }
        if (subResult.constructor === String){
            return subResult;
        }
        result.push([itemName, subResult]);
    }
    return result;
}

class CollectionSegment extends AuraCoreBase{
    constructor(){
        super();
        this.data = [];
    }
    
    fromObject(object){
        let resultData = createLoop(object, structureMap);
        if (resultData.constructor === String){
            return resultData;
        }
        this.data = resultData;
    }
}

const collectionMap = {
    "$S": CollectionSegment
};

class AuraBloodGemCore extends CollectionSegment{
    fromObject(object){
        let resultData = createLoop(object, collectionMap);
        if (resultData.constructor === String){
            return resultData;
        }
        this.data = resultData;
    }
}

let structure = jsyaml.load(data)
let a = new AuraBloodGemCore()
a.fromObject(structure)
console.log(a)
