class Collection{
    constructor(){
        this.element = document.createElement("div");
    }

    append(segment){
        this.element.appendChild(segment.element);
    }
}

class Component{
    constructor(name){
        this.element = document.createElement("div");
        this.nameElement = document.createElement("h1");
        this.name = name;
    }

    set name(name){
        this.nameElement.innerHTML = name;
    }
    
    get name(){
        return this.nameElement.innerHTML;
    }
}

class RelationalTable{
    constructor(){
        this.element = document.createElement("table");
        this.element.className = "relational";
    }

    appendRow(rowData){
        let tr = this.element.insertRow(-1);
        for (let colData of rowData){
            let td = tr.insertCell(-1);
            td.innerHTML = colData;
        }
    }

    appendRows(rowsData){
        for (let rowData of rowsData){
            this.appendRow(rowData);
        }
    }
}

class Diagram{
    constructor(){
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.element.setAttribute("width", "200");
        this.element.setAttribute("height", "200");
    }
}

let c = new Collection();
document.body.appendChild(c.element);

let comp = new Component("Name 1");
c.append(comp);


let rt = new RelationalTable();
c.append(rt);
rt.appendRow(["aabb", "Something more", "Something more", "Something more"]);
rt.appendRows([
    ["1", "Something more", "Something more", "Something more"],
    ["2", "Something more", "Something more", "Something more"],
    ["3", "Something more", "Something more", "Something more"],
    ["4", "Something more", "Something more", "Something more"],
    ["5", "Something more", "Something more", "Something more"],
])
console.log(c);
