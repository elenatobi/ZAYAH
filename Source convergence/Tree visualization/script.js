"use strict";

// VARIABLES DEFINITONS

var path = ["b", "b2"];
var tableConfig = document.getElementById("myOwnTable");

// CUSTOMERIZATIONS (CALLBACKS)
function defaultLayerViewCustomerization(key, value) {
    console.log("KEY: ", key);
    if (typeof value == "string") {
        console.log("VALUE: ", value);
    }
    else {
        console.log("VALUE: NO DIRECTLY WRITTEN VALUE");
    }
}

function tableLayerViewCustomerization(key, value) {
    var tr = tableConfig.insertRow(-1);
    var tdKey = tr.insertCell(-1);
    tdKey.setAttribute("class", "table");
    tdKey.innerHTML = key;
    var tdValue = tr.insertCell(-1);
    tdValue.setAttribute("class", "table");
    if (typeof value == "string") {
        tdValue.innerHTML = value;
    }
    else {
        tdValue.innerHTML = "...";
    }
}

function isValidPath(node, path) {
    if (path.length == 0) {
        return true;
    } else {
        if (typeof node != "object" || node == null) return false;
        var currentPath = path[0];
        if (!(currentPath in node)) {
            return false;
        }
        var lowerNode = node[currentPath];
        var lowerPath = path.slice(1);
        return isValidPath(lowerNode, lowerPath);
    }
}

function hasLowerNodes(node, path) {
    if (path.length == 0) {
        return typeof node == "object";
    }
    else {
        if (typeof node != "object" || node == null) return false;
        var currentPath = path[0];
        if (!(currentPath in node)) {
            return false;
        }
        var lowerNode = node[currentPath];
        var lowerPath = path.slice(1);
        return hasLowerNodes(lowerNode, lowerPath)
    }
}

// LAYOUT METHODS
function displayLayer(node, path, customerization = defaultLayerViewCustomerization) {
    //console.log(NODE["a"])
    if (path.length == 0 && typeof node == "object") {
        for (var lowerNodeKey of Object.keys(node)) {
            var lowerNodeValue = node[lowerNodeKey];
            customerization(lowerNodeKey, lowerNodeValue);
        }
    }
    else if (typeof node == "object") {
        var currentPath = path[0];
        if (!(currentPath in node)) {
            console.log(currentPath, " is not in node");
            return;
        }
        var lowerNode = node[currentPath];
        var lowerPath = path.slice(1);
        if (typeof lowerNode == "object") {
            displayLayer(lowerNode, lowerPath, customerization);
        }
        else {
            customerization(currentPath, lowerNode);
        }
    }
}

function createTableHeading() {
    var trTop = tableConfig.insertRow(-1);
    var thKey = document.createElement("th");
    thKey.innerHTML = "Namn";
    thKey.setAttribute("width", "157")
    thKey.setAttribute("class", "table")
    trTop.appendChild(thKey);
    var thValue = document.createElement("th");
    thValue.setAttribute("class", "table");
    if (path.length == 0) {
        thValue.innerHTML = "Innehåll (Rot nod)";
    }
    else {
        thValue.innerHTML = "Innehåll (" + path.join("/") + ")";
    }
    thValue.addEventListener("click", ascend);
    trTop.appendChild(thValue);
}

// FILE TRAVERSAL METHODS

function ascend() {
    if (path.length != 0) {
        path.pop();
        clickCreate();
    }

}

function descend() {
    var currentPath = this.childNodes[0].innerHTML;
    path.push(currentPath);
    clickCreate();
}

function clickCreate() {
    console.clear();
    tableConfig.innerHTML = "";
    createTableHeading()
    displayLayer(parsed_data, path, tableLayerViewCustomerization);
    for (var tableRow of document.querySelectorAll("#myOwnTable tr")) {
        if (hasLowerNodes(parsed_data, path.concat(tableRow.childNodes[0].innerHTML))) {
            tableRow.addEventListener("click", descend);
        }
    }
}

function clickDelete() {
    console.clear();
    tableConfig.innerHTML = "";
}

clickCreate()