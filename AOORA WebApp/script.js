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

class AuraBloodGemWrapper {
    constructor() {
        this.core = new AuraBloodGemCore();
        this.treeView = document.getElementById("treeView");
        this.mainTabs = document.getElementById("mainTabs");
        // this.mainView = document.getElementById("mainView");
        this.graphWin = new GraphWin("mainView");
        this.tabs = [];
        this.eTabActive = null;
        this.start();
    }

    start() {
        this.graphWin.setSize(800, 500);
        const structure = jsyaml.load(data);
        this.core.fromObject(structure);
        // this.addTab(this.core.data[0][1][2][1][1]);
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
            let newVNode = this.appeal(name, newNode[1]);
            newETab = create("td", "tab", name);
            let eDel = create("span", "del", "X");
            newETab.draggable = true;
            newETab.appendChild(eDel);
            newETab.addEventListener("click", function () {
                deactivate(sys.eTabActive);
                sys.eTabActive = newETab;
                if (sys.eTabActive) {
                    activate(sys.eTabActive);
                    // console.log(newVNode);
                    sys.castVNode(newVNode);
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
                if (neweTabActive) {
                    neweTabActive.click();
                }
            });
            this.mainTabs.appendChild(newETab);
            this.tabs.push([newNode, newETab]);
        }
        newETab.click();
    }

    appeal(name, data) {
        let graphWin = this.graphWin;
        let result = new LinearLayout({
            x: 0,
            y: 0,
            width: 500,
            height: 450,
            color: "white",
            borderColor: "purple",
        });
        result.add(new IText({
            x: 20,
            y: 15,
            width: 500,
            height: 27,
            color: "purple",
            fontFamily: "Allura",
            content: name,
        }))
        result.add(this.__appeal(data.data))
        let y = 0;
        result.bind("dragstart", function(evt){
            y = evt.y;
        });
        result.bind("drag", function(evt){
            this.dy += evt.y - y;
            y = evt.y;
            graphWin.requestRefresh();
        });
        
        return result;
    }

    __appeal(nodes) {
        let result = new LinearLayout({
            x: 0,
            y: 0,
            width: 500,
            color: "white",
            fitY: true,
        });
        for (let node of nodes) {
            let [name, subnodes] = node;
            result.add(
                new IText({
                    x: 10,
                    y: 10,
                    width: 200,
                    height: 17,
                    color: "blue",
                    content: name,
                })
            );
            if (isArray(subnodes)) {
                result.add(this.__appeal(subnodes));
            } else if (subnodes.constructor === Table) {
                result.add(this.__appealTable(subnodes.data));
            }

            // console.log(name, subnodes);
        }
        return result;
    }

    __appealTable(array) {
        let data = [];
        for (let row of array) {
            data.push(row);
        }
        return new TextTable({
            x: 0,
            y: 0,
            data: data,
            colSizes: new Array(data[0].length).fill(0),
            rowSizes: new Array(data.length).fill(0),
        });
    }

    castVNode(data) {
        this.graphWin.removeAll();
        this.graphWin.add(data);
        this.graphWin.requestRefresh();
    }
}

function createLayout(nodes) {
    for (let node of nodes) {
        let subResult = null;
        let [name, type] = readHeader(layoutName);
        result.add(
            new IText({
                x: 10,
                y: 10,
                width: 200,
                height: 17,
                color: "blue",
                content: name,
            })
        );
        if (type === "$T") {
            subResult = createTable(subArray);
        } else if (type === "") {
            subResult = createLayout(subArray);
        }
        if (subResult.constructor === String) {
            return subResult;
        }
        result.add(subResult);
    }
    return result;
}
