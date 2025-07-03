class Node {
  constructor(name, lowerNodes = []) {
    this.name = name;
    this.lowerNodes = lowerNodes;
  }

  isSemileafNode() {
    if (this.isLeafNode()) {
      return false;
    }
    for (let lowerNode of this.lowerNodes) {
      if (!lowerNode.isLeafNode()) {
        return false;
      }
    }
    return true;
  }

  isLeafNode() {
    return this.lowerNodes.length === 0;
  }

  isEmpty() {
    return this.lowerNodes.length === 0 && this.name === '';
  }

  empty() {
    this.name = '';
    this.lowerNodes = [];
  }
}

function generateFirstLeaf(sublayout) {
  let segmentResult = '';
  if (sublayout.isSemileafNode()) {
    for (let lowerNode of sublayout.lowerNodes) {
      segmentResult += `<p>${lowerNode.name}</p>\n`;
    }
    return segmentResult;
  } else {
    for (let lowerNode of sublayout.lowerNodes) {
      if (!lowerNode.isLeafNode()) {
        let result = generateFirstLeaf(lowerNode);
        if (lowerNode.isSemileafNode()) {
          var index = sublayout.lowerNodes.indexOf(lowerNode);
          if (index !== -1) {
            sublayout.lowerNodes.splice(index, 1);
          }
        }
        return result;
      }
    }
  }
  return '';
}

/*

// NOTE: This code is done for only double layers. It takes however A LOT OF unneccessary space than printed

function generatePage(layout, pageNumber, continueNumber) {
  let pageResult = '';
  let traverseNext = [];
  pageResult += `<div class = "page" id = "Page${pageNumber}">\n`;
  pageResult += `<h1>${layout.name}</h1>\n`;
  continueNumber++;
  for (let lowerNode1 of layout.lowerNodes) {
    if (lowerNode1.isEmpty()) {
      continue;
    }
    let segmentResult = generateFirstLeaf(lowerNode1);
    if (!lowerNode1.isLeafNode() && !lowerNode1.isEmpty()) {
      if (!lowerNode1.isSemileafNode()) {
        traverseNext.push([continueNumber, lowerNode1]);
        pageResult += `<h2>${lowerNode1.name} -> ${continueNumber} </h2>\n`;
        continueNumber++;
      } else {
        pageResult += `<h2>${lowerNode1.name}</h2>\n`;
      }
    } else {
      pageResult += `<h2>${lowerNode1.name}</h2>\n`;
    }
    pageResult += segmentResult;
  }
  pageResult += `<p class = "page-number">${pageNumber}</p>`;
  pageResult += `</div>\n`;
  //traverseNext = traverseNext.filter((subLayout) => !subLayout.isEmpty());
  return [pageResult, traverseNext];
}

*/

/*


// NOTE: This time, I did it with triple layers but some can have 2 layers which I don't like.

function generatePage(layout, pageNumber, continueNumber) {
  let pageResult = '';
  let traverseNext = [];
  pageResult += `<div class = "page" id = "Page${pageNumber}">\n`;
  pageResult += `<h1>${layout.name}</h1>\n`;
  continueNumber++;
  for (let lowerNode1 of layout.lowerNodes) {
    pageResult += `<h2>${lowerNode1.name}</h2>\n`;
    for (let lowerNode2 of lowerNode1.lowerNodes) {
      if (lowerNode2.isEmpty()) {
        continue;
      }
      let segmentResult = generateFirstLeaf(lowerNode2);
      if (!lowerNode2.isLeafNode() && !lowerNode2.isEmpty()) {
        if (!lowerNode2.isSemileafNode()) {
          traverseNext.push([continueNumber, lowerNode2]);
          pageResult += `<h3>${lowerNode2.name} -> ${continueNumber} </h3>\n`;
          continueNumber++;
        } else {
          pageResult += `<h3>${lowerNode2.name}</h3>\n`;
        }
      } else {
        pageResult += `<h3>${lowerNode2.name}</h3>\n`;
      }
      pageResult += segmentResult;
    }
  }
  pageResult += `<p class = "page-number">${pageNumber}</p>`;
  pageResult += `</div>\n`;
  //traverseNext = traverseNext.filter((subLayout) => !subLayout.isEmpty());
  return [pageResult, traverseNext];
}
*/

/*

function generatePage(layout, pageNumber, continueNumber) {
  let pageResult = '';
  let traverseNext = [];
  pageResult += `<div class = "page" id = "Page${pageNumber}">\n`;
  pageResult += `<h1>${layout.name}</h1>\n`;
  continueNumber++;
  for (let lowerNode1 of layout.lowerNodes) {
    pageResult += `<h2>${lowerNode1.name}</h2>\n`;
    for (let lowerNode2 of lowerNode1.lowerNodes) {
      if (lowerNode2.isEmpty()) {
        continue;
      }
      let segmentResult = generateFirstLeaf(lowerNode2);
      if (!lowerNode2.isLeafNode() && !lowerNode2.isEmpty()) {
        if (!lowerNode2.isSemileafNode()) {
          traverseNext.push([continueNumber, lowerNode2]);
          pageResult += `<h3>${lowerNode2.name} -> ${continueNumber} </h3>\n`;
          continueNumber++;
        } else {
          pageResult += `<h3>${lowerNode2.name}</h3>\n`;
        }
      } else {
        pageResult += `<h3>${lowerNode2.name}</h3>\n`;
      }
      pageResult += segmentResult;
    }
  }
  pageResult += `<p class = "page-number">${pageNumber}</p>`;
  pageResult += `</div>\n`;
  //traverseNext = traverseNext.filter((subLayout) => !subLayout.isEmpty());
  return [pageResult, traverseNext];
}

*/

function generatePage(layout, pageNumber, continueNumber) {
  let pageResult = '';
  let traverseNext = [];
  pageResult += `<div class = "page" id = "Page${pageNumber}">\n`;
  pageResult += `<h1>${layout.name}</h1>\n`;
  continueNumber++;
  for (let lowerNode1 of layout.lowerNodes) {
    pageResult += `<h2>${lowerNode1.name}</h2>\n`;
    for (let lowerNode2 of lowerNode1.lowerNodes) {
      let segmentResult = generateFirstLeaf(lowerNode2);
      if (!lowerNode2.isLeafNode() && !lowerNode2.isSemileafNode()) {
        traverseNext.push([continueNumber, lowerNode2]);
        pageResult += `<h3>${lowerNode2.name} -> ${continueNumber} </h3>\n`;
        continueNumber++;
      } else {
        pageResult += `<h3>${lowerNode2.name}</h3>\n`;
      }
      pageResult += segmentResult;
    }
  }
  pageResult += `<p class = "page-number">${pageNumber}</p>`;
  pageResult += `</div>\n`;
  return [pageResult, traverseNext];
}

function generateVisualization(layout) {
  let visualizationResult = '';
  let shouldTraverse = [[1, layout]];
  //let pageNumber = 1;
  while (shouldTraverse.length !== 0) {
    let [pageNumber, subLayout] = shouldTraverse.shift();
    let peek = shouldTraverse[shouldTraverse.length - 1];
    let continueNumber = peek ? peek[0] : pageNumber;
    let [newPage, traverseNext] = generatePage(
      subLayout,
      pageNumber,
      continueNumber
    );
    visualizationResult += newPage;
    shouldTraverse.push(...traverseNext);
    pageNumber++;
    //console.log(shouldTraverse);
  }
  return visualizationResult;
}

function readFile(fileSelector, onhandle) {
  //let fileSelector = document.getElementById('FileImport');
  fileSelector.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = function () {
      onhandle(fileReader.result);
    };
    console.log(file);
  });
}

readFile(document.getElementById('FileImport'), function (result) {
  let doc = jsyaml.load(result);
  let loaded = load({ Root: doc });
  let v = generateVisualization(loaded);
  document.getElementById('Visualization').innerHTML = v;
});

function load(ObjectDataNode) {
  let node = new Node(Object.keys(ObjectDataNode)[0]);
  for (let lowerObjectDataNode of Object.values(ObjectDataNode)[0]) {
    if (typeof lowerObjectDataNode === 'string') {
      node.lowerNodes.push(new Node(lowerObjectDataNode));
    } else {
      node.lowerNodes.push(load(lowerObjectDataNode));
    }
    //console.log(lowerObjectDataNode);
    //node.lowerNodes.push()
  }
  return node;
}
