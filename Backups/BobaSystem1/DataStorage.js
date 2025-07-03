import { Tree, GraphSeparate } from "./DataStructure.js";

export class TreeStorage extends Tree {
    fromObject(object) {
        this.clear();
        for (let subObject of object) {
            let newNode = new TreeStorage();
            this.push(newNode);
            if (typeof subObject === "string") {
                newNode.setName(subObject);
            }
            else if (object !== null && typeof object === "object") {
                let name = Object.keys(subObject)[0];
                let subTree = Object.values(subObject)[0];
                newNode.setName(name);
                if (Array.isArray(subTree)) {
                    newNode.fromObject(subTree);
                }
            }
        }
    }

    __toSQLStorage(id = 1, subId = 2, result = new SQLStorage()) {
        for (let subNode of this.getSubNodes()) {
            result.addVertex(subId, subNode.name);
            result.addEdge(id, subId, 1);
            [subId, result] = subNode.__toSQLStorage(subId, subId + 1, result);
            subId++;
        }
        return [subId - 1, result];
    }

    toSQLStorage(id = 1) {
        return this.__toSQLStorage(id)[1];
    }
}

export class SQLStorage extends GraphSeparate {
    constructor(vertices = [[1, "Root"]], edges = []) {
        super(vertices, edges);
    }

    generateSQLFiles() {
        let nameTable = "CREATE TABLE IF NOT EXISTS nameTable (id INTEGER PRIMARY KEY, item TEXT);\nDELETE FROM nameTable;"
        let relationship = "CREATE TABLE IF NOT EXISTS relationship (parentid INTEGER, childid INTEGER, sortid INTEGER);\nDELETE FROM relationship;"
        for (let [id, item] of this.vertices) {
            item = item.replaceAll('"', '""');
            nameTable += `INSERT INTO nameTable VALUES (${id}, "${item}");\n`;
        }
        for (let [parentId, childId, sortId] of this.edges) {
            relationship += `INSERT INTO relationship VALUES (${parentId}, ${childId}, ${sortId});\n`;
        }
        return [nameTable, relationship];
    }
}