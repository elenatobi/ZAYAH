"use strict"; 

var results = '[{"parentId":1,"parent":"*","childId":2,"child":"Livet"},{"parentId":1,"parent":"*","childId":3,"child":"Gemensam"},{"parentId":1,"parent":"*","childId":9,"child":"Profil"},{"parentId":2,"parent":"Livet","childId":4,"child":"Själskapelse"},{"parentId":2,"parent":"Livet","childId":5,"child":"Född"},{"parentId":2,"parent":"Livet","childId":6,"child":".1"},{"parentId":2,"parent":"Livet","childId":8,"child":".2"},{"parentId":6,"parent":".1","childId":7,"child":"Skolan"},{"parentId":10,"parent":"Root","childId":1,"child":"*"}]';

let dataList = JSON.parse(results);
let dataTree = {};

function convertTree(dataSliceList, dataSliceTree, treeParentId, treeParent) {
    let children = getAllChildren(dataSliceList, treeParentId);

    if (children.length == 0) {
        dataSliceTree[treeParent] = treeParent;
        return;
    }
    dataSliceTree[treeParent] = {};
    for (let child of children) {
        convertTree(dataSliceList, dataSliceTree[treeParent], child.childId, child.child);
    }
}


function getAllChildren(dataSliceList, currentId) {
    let resultArray = [];
    for (let dataSlice of dataSliceList) {
        if (dataSlice.parentId == currentId) {
            resultArray.push(dataSlice);;
        }
    }
    for (let i = 0; i < resultArray.length; i++) {
        for (let j = 0; j < dataSliceList.length; j++) {
            if (dataSliceList[j].parentId == currentId) {
                dataSliceList.splice(j, 1);
                break;
            }
        }
    }
    return resultArray;
}

function getItem(dataList, id) {
    for (var data of dataList) {
        if (data.parentId == id) {
            return data.parent;
        }
    }
    return null;
}

const initId = 10
convertTree(dataList, dataTree, initId, getItem(dataList, initId));
console.log(dataList);
console.log(dataTree);


