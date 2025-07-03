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

let layout = new Node('52! Heghineh Full Stack', [
  new Node('A', [
    new Node('A1', [
      new Node('A11', [new Node('A111'), new Node('A112'), new Node('A113')]),
      new Node('A12', [new Node('A121'), new Node('A122')]),
      new Node('A13', [new Node('A131'), new Node('A132')]),
      new Node('A14'),
      new Node('A15'),
      new Node('A16'),
    ]),
    new Node('A2', [
      new Node('A21'),
      new Node('A22'),
      new Node('A23'),
      new Node('A24'),
      new Node('A25'),
      new Node('A26'),
    ]),
    new Node('A3', [
      new Node('A31'),
      new Node('A32'),
      new Node('A33'),
      new Node('A34'),
      new Node('A35'),
      new Node('A36'),
    ]),
    new Node('A4', [
      new Node('A41'),
      new Node('A42'),
      new Node('A43'),
      new Node('A44'),
      new Node('A45'),
      new Node('A46'),
    ]),
    new Node('A5', [
      new Node('A51'),
      new Node('A52'),
      new Node('A53'),
      new Node('A54'),
      new Node('A55'),
      new Node('A56'),
    ]),
    new Node('A6'),
    new Node('A7'),
    new Node('A8'),
  ]),
  new Node('B', [
    new Node('B1'),
    new Node('B2'),
    new Node('B3'),
    new Node('B4'),
    new Node('B5', [new Node('B51')]),
  ]),
  new Node('C'),
  new Node('D'),
]);

function generateFirstLeaf(sublayout) {
  let segmentResult = '';
  if (sublayout.isSemileafNode()) {
    for (let lowerNode of sublayout.lowerNodes) {
      segmentResult += `<p>${lowerNode.name}</p>\n`;
    }
    sublayout.empty();
    return segmentResult;
  } else {
    for (let lowerNode of sublayout.lowerNodes) {
      if (!lowerNode.isLeafNode()) {
        return generateFirstLeaf(lowerNode);
      }
    }
  }
  return '';
}

function generatePage(layout, pageNumber) {
  let pageResult = '';
  let traverseNext = [];
  let pointerNumber = pageNumber + 1;
  pageResult += `<div class = "page" id = "Page${pageNumber}">\n`;
  pageResult += `<h1>${layout.name}</h1>\n`;
  for (let lowerNode1 of layout.lowerNodes) {
    if (lowerNode1.isEmpty()) {
      continue;
    }
    if (!lowerNode1.isLeafNode() && !lowerNode1.isEmpty()) {
      if (!lowerNode1.isSemileafNode()) {
        traverseNext.push(lowerNode1);
        pageResult += `<h2>${lowerNode1.name} -> ${pointerNumber} </h2>\n`;
        pointerNumber++;
      } else {
        pageResult += `<h2>${lowerNode1.name}</h2>\n`;
      }
    } else {
      pageResult += `<h2>${lowerNode1.name}</h2>\n`;
    }
    let segmentResult = generateFirstLeaf(lowerNode1);
    pageResult += segmentResult;
  }
  pageResult += `</div>\n`;
  //traverseNext = traverseNext.filter((subLayout) => !subLayout.isEmpty());
  return [pageResult, traverseNext];
}

function generateVisualization(layout) {
  let visualizationResult = '';
  let shouldTraverse = [layout];
  let pageNumber = 1;
  while (shouldTraverse.length !== 0) {
    let subLayout = shouldTraverse.shift();
    let [newPage, traverseNext] = generatePage(subLayout, pageNumber);
    visualizationResult += newPage;
    shouldTraverse.push(...traverseNext);
    pageNumber++;
    //console.log(shouldTraverse);
  }
  return visualizationResult;
}

/*
let [newPage, traverseNext] = generatePage(layout, 1);
console.log(newPage);
console.log(traverseNext);
console.log(layout);
*/

console.log(generateVisualization(layout));
