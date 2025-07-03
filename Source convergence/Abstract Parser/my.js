// AbstractParser.js
const RULE_TYPE = 0;
const RULE_REGEX = 1;

class AbstractLexer {
    constructor(rules) {
        this.stream = "";
        this.rules = rules;
        this.position = 0;
        this.line = 1;
        this.col = 0;
    }
    
    feed(stream){
        this.stream = stream;
    }

    eof() {
        return this.position >= this.stream.length;
    }

    next() {
        if (this.eof()) {
            return null;
        }
        for (let rule of this.rules) {
            let match = this.stream.slice(this.position).match(rule[RULE_REGEX]);
            if (match) {
                let matchValue = match[0];
                this.updatePosition(matchValue);
                return {type: rule[RULE_TYPE], value: matchValue};
            }
        }
        this.croak("Unexpected character")
    }

    updatePosition(stream) {
        this.position += stream.length;
        for (let char of stream) {
            if (char === "\n") {
                this.line++;
                this.col = 0;
            } else {
                this.col++;
            }
        }
    }
    
    croak(message){
        throw new Error(`${message} at line ${this.line}, column ${this.col}`);
    }
}

class AbstractParser{
    constructor(grammar){
        
    }
}

// script.js (Implementation)

class TreeNode {
    constructor(name, lowerNodes = []) {
        this.name = name;
        this.lowerNodes = lowerNodes;
    }

    create(node) {
        this.lowerNodes.push(node);
    }

    createBatch(nodes) {
        this.lowerNodes.push(...nodes);
    }

    insert(index, node) {
        if (index >= 0 && index <= this.lowerNodes.length) {
            this.lowerNodes.splice(index, 0, node);
        }
    }

    read(index) {
        return this.lowerNodes[index];
    }

    update(newName) {
        this.name = newName;
    }

    delete(node) {
        const index = this.lowerNodes.indexOf(node);
        if (index !== -1) {
            this.lowerNodes.splice(index, 1);
        }
    }
}

class Table {
    constructor(name, data = [[]]) {
        this.name = name;
        this.data = data;
    }

    create(row) {
        this.data.push(row);
    }

    createBatch(rows) {
        this.data.push(...rows);
    }

    insert(index, row) {
        if (index >= 0 && index <= this.data.length) {
            this.data.splice(index, 0, row);
        }
    }

    read(index) {
        return this.data[index];
    }

    update(index, newRow) {
        this.data[index] = newRow;
    }

    delete(index) {
        this.data.splice(index, 1);
    }
}

class Graph {
    constructor() {
        this.adjList = {};
    }

    addVertex(vertex, value) {
        this.adjList[vertex] = { value, neighbors: [] };
    }

    addEdge(vertex1, vertex2) {
        throw new Error("addEdge must be implemented by subclasses");
    }
    
    get(vertex){
        return this.adjList[vertex].value;
    }
    
    getNeighbors(vertex){
        return this.adjList[vertex].neighbors
    }

    dfs(start, visited = {}, result = []) {
        visited[start] = true;
        result.push({ vertex: start, value: this.get(start)});
        for (const neighbor of this.getNeighbors(start)) {
            const neighborVertex = neighbor.vertex;
            if (!visited[neighborVertex]) {
                this.dfs(neighborVertex, visited, result);
            }
        }
        return result;
    }
}

class UndirectedGraph extends Graph {
    addEdge(vertex1, vertex2, weight = 0) {
        this.adjList[vertex1].neighbors.push({ vertex: vertex2, weight });
        this.adjList[vertex2].neighbors.push({ vertex: vertex1, weight });
    }
}

class DirectedGraph extends Graph {
    addEdge(vertex1, vertex2, weight = 0) {
        this.adjList[vertex1].neighbors.push({ vertex: vertex2, weight });
    }
}



const ModelMap = {
    "$T": Table
}

const lexer = new AbstractLexer([
    ["BEGINNODE", /^-\s/],
    ["WHITESPACE", /^[ \t]+/],
    ["NEWLINE", /^[\n]/],
    ["IDENTIFIER", /^[a-zA-Z_][a-zA-Z0-9_/]*[ \t]*/],
    ["MODEL", /^\$[a-zA-Z_][a-zA-Z0-9_]*[ \t]+/],
    ["NUMBER", /^[0-9]+(\.[0-9]+)?/],
    ["PARENTHESIS", /^[\(\)\[\]]/],
    ["COLON", /^:/],
]);

let s = `
- aa/nn  :
  - $T   bb:
    - 1[1.1 1.2 1.3 1.4]
    - 2[2.1 2.2 2.3 2.45]
`;

lexer.feed(s);
while (!lexer.eof()){
    console.log(lexer.next());
}

function parse(text){
    lexer.feed(text);
    let currentClass = TreeNode;
    let currentName = "";
    let currentIdent = 0;
    while (!lexer.eof()) {
        let token = lexer.next();
        if (token.type === "WHITESPACE"){
            currentIdent = token.value.length;
            token = lexer.next();
        }
        if (token.type === "BEGINNODE"){
            
        }
        else{
            lexer.croak('Expected "- "')
        }
        token = lexer.next();
        if (token){
            if (token.type === "MODEL"){
                let newClass = ModelMap[token.value]
                if (newClass){
                    currentClass = newClass;
                }
                token = lexer.next();
            }
        }
        if (token){
            if (token.type === "WHITESPACE"){
                token = lexer.next();
            }
        }
        if (token){
            if (token.type === "IDENTIFIER"){
                currentName = token.value;
            }
        }
        else{
            lexer.croak('Expected an identifier')
        }
        token = lexer.next();
        if (token){
            if (token.type === "COLON"){
                
            }
        }
        else{
            lexer.croak('Expected a colon')
        }
        token = lexer.next();
        if (token){
            if (token.type === "NEWLINE"){
                
            }
        }
        else{
            lexer.croak('Expected a newline')
        }
        console.log(new currentClass(currentName))
    }
}

//parse("- AAB:\n");

