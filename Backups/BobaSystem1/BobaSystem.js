import { TreeStorage } from "./DataStorage.js";

export class BobaSystem {
    constructor() {
        this.tree = new TreeStorage("Root");
    }

    readYAML(result) {
        let yamlfile = null;
        yamlfile = jsyaml.load(result);
        this.tree.fromObject(yamlfile);
    }

    generateSQL() {
        let sqlstorage = this.tree.toSQLStorage()
        let files = sqlstorage.generateSQLFiles();
        return files;
    }
}