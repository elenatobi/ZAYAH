import { TreeStorage } from "./DataStorage.js";
import { BobaSystem } from "./BobaSystem.js";
import { Terminal, FileReadTerminal, FileWriteTerminal, ToastTerminal } from "./Terminal.js";

class BobaApp {
    constructor() {
        this.yamlinput = new FileReadTerminal("yamlinput");
        this.sqloutput = new Terminal("sqloutput");
        this.toast = new ToastTerminal("toast");
        this.write = new FileWriteTerminal();
        this.system = new BobaSystem();
    }

    __read(result) {
        try {
            this.system.readYAML(result)
        }
        catch (error) {
            let errorMessage = error.name + ": " + error.message;
            errorMessage = errorMessage.replace(/(?:\r\n|\r|\n)/g, "<br>");
            this.toast.toast(errorMessage);
        }
    }

    __write() {
        let [nameTable, relationship] = this.system.generateSQL();
        this.write.write("nameTable.sql", nameTable);
        this.write.write("relationship.sql", relationship);
    }

    run() {
        document.getElementById("sqloutput").addEventListener("click", this.__write.bind(this));
        this.yamlinput.onread = this.__read.bind(this);
        //this.sqloutput.onclick = this.generatesql.bind(this);
        //console.log(this.sqloutput.onclick)
    }
}

document.addEventListener("DOMContentLoaded", function() {
    new BobaApp().run()
});