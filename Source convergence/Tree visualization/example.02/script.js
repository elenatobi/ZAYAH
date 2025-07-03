function callbackFuncOnClick() {
    console.log(this.innerHTML);
}

function createTableFromJSON(myData) {
    var col = [];
    for (var i = 0; i < myData.length; i++) {
        for (var key in myData[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement('table');
    table.setAttribute("id", "myTable");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < myData.length; i++) {
        tr = table.insertRow(-1);
        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = myData[i][col[j]];
        }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);

    var cells = document.querySelectorAll("#myTable td");
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", callbackFuncOnClick);
    }
}


function deleteTable() {
    var table = document.getElementById("myTable");
    if (table) {
        table.parentNode.removeChild(table);
        console.clear();
    } else {
        console.log("No table!");
    }
}


