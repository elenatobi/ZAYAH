var data = {
    a: { a1: "a1", a2: { a21: "a21.1", a22: "a22.1", a23: "a23,1" }, a3: "a3" },
    b: { b1: "valueB1", b2: { b21: { b211: "valueB211", b212: "valueB212" }, b22: "valueB22" }, b3: "valueB3", b4: "valueB4", b5: "valueB5", b6: "valueB6", b7: "valueB7" },
    c: "c.some",
    d: { d1: "d1", d2: "d2" },
    e: { e1: "e1" }
};

interface treeStructure {
    [index: string]: string | treeStructure
}

// CUSTOMERIZATIONS
function defaultLayerViewCustomerization(key: string, value: string | treeStructure) {
    console.log("KEY: ", key);
    if (typeof value == "string") {
        console.log("VALUE: ", value);
    }
    else {
        console.log("VALUE: NO DIRECTLY WRITTEN VALUE")
    }
}

// LAYOUT METHODS

function displayLayer(node: treeStructure, path: string[], customerization: Function = defaultLayerViewCustomerization) {
    //console.log(NODE["a"])
    if (path.length == 0 && typeof node == "object") {
        for (var lowerNodeKey of Object.keys(node)) {
            var lowerNodeValue = node[lowerNodeKey];
            customerization(lowerNodeKey, lowerNodeValue);
        }
    } else if (typeof node == "object") {
        var currentPath = path[0];
        if (!(currentPath in node)) {
            console.log(currentPath, " is not in node");
            return;
        }
        var lowerNode = node[currentPath];
        var lowerPath = path.slice(1);
        if (typeof lowerNode == "object") {
            displayLayer(lowerNode, lowerPath, customerization);
        } else {
            customerization(currentPath, lowerNode);
        }
    }
}

// TEST SECTION
console.clear();
displayLayer(data, ["b", "b2", "b21"]);