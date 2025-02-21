function clearObject(object){
    for (let property in object){
        delete object[property];
    }
}

function arrayIsEmpty(array){
    return array.length === 0;
}

function clearArray(array){
    while (array.length > 0) {
        array.pop();
    }
}

function fileRead(handler){
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.addEventListener("change", function(event1){
        let reader = new FileReader();
        reader.addEventListener('load', function(event2){
            handler(event2.target.result);
        });
        for (let file of event1.target.files){
            reader.readAsText(file);
        }
    });
    fileInput.click();
    delete fileInput;
}

function fileWrite(filename, data) {
    let blob = new Blob([data], { type: 'octet/stream' });
    let url = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}

/*

AURA ENCODING FORMATION (AEC)

	0	1	2	3	4	5	6	7	8	9	a	b	c	d	e	f
0	NUL	P	f	v	.	{	|	Ï	ä	õ	±	Λ				
1	A	Q	g	w	,	}	À	Ñ	å	ö	²	Μ				
2	B	R	h	x	:	+	Á	Ò	æ	ø	³	Ν				
3	C	S	i	y	;	-	Â	Ó	ç	ù	¼	Ξ				
4	D	T	j	z	'	*	Ã	Ô	è	ú	½	Ο				
5	E	U	k	0	"	/	Ä	Õ	é	û	¾	Π				
6	F	V	l	1	´	^	Å	Ö	ê	ü	Α	Ρ				
7	G	W	m	2	`	%	Æ	Ø	ë	¿	Β	Σ				
8	H	X	n	3	~	<	Ç	Ù	ì	¡	Γ	Τ				
9	I	Y	o	4	?	>	È	Ú	í	§	Δ	Υ				
a	J	Z	p	5	!	=	É	Û	î	¨	Ε	Φ				
b	K	a	q	6	&	#	Ê	Ü	ï	«	Ζ	Χ				
c	L	b	r	7	(	$	Ë	à	ñ	»	Η	Ψ				
d	M	c	s	8	)	@	Ì	á	ò	¯	Θ	Ω				
e	N	d	t	9	[	\	Í	â	ó	¬	Ι					
f	O	e	u	SP	]	_	Î	ã	ô	°	Κ					


*/

class TimeLine{
    constructor(){
        this.undoStack = [];
        this.redoStack = [];
    }
    
    perform(object){
        this.undoStack.push(object);
        clearArray(this.redoStack);
    }
    
    undo(){
        if (arrayIsEmpty(this.undoStack)){
            return null;
        }
        let object = this.undoStack.pop();
        this.redoStack.push(object);
        return object;
    }
    
    redo(){
        if (arrayIsEmpty(this.redoStack)){
            return null;
        }
        let object = this.redoStack.pop();
        this.undoStack.push(object);
        return object;
    }
}

class AuraFileManager{
    constructor(){
        this.data = null;
        this.idPath = [ROOT_ID];
        this.namePath = [ROOT_NAME];
        this.timeLine = new TimeLine();
    }

    loadData(data){
        this.data = data;
    }

    getCurrentId(){
        return this.idPath[this.idPath.length - 1];
    }

    getPath(){
        return this.namePath.join("/");
    }

    at(id){
        let left = 0;
        let right = this.data.length - 1;
        while (left <= right) {
            let mid = left + Math.floor((right - left) / 2);
            let midValue = this.data[mid][DATA_ID];
            if (midValue === id) {
                return this.data[mid][DATA_VALUE];
            }
            else if (midValue < id) {
                left = mid + 1;
            }
            else {
                right = mid - 1;
            }
        }
        return null;
    }

    list(){
        return this.at(this.getCurrentId());
    }

    ascend(){
        if (this.idPath.length > 1){
            this.idPath.pop();
            this.namePath.pop();
        }
    }

    descend(id, value){
        this.idPath.push(id);
        this.namePath.push(value);
    }
}

/*

class Table{
    constructor({columnNames, data}){
        this.columnNames = [];
        this.data = [];
        this.alterColumnNames(columnNames);
        this.pushData(data);
    }
    
    alterColumnNames(columnNames){
        this.columnNames = columnNames;
    }
    
    pushData(data){
        if (!Array.isArray(data)){
            throw new Error("Data is not array");
        }
        for (let row of data){
            this.pushRow(row);
        }
    }
    
    pushRow(row){
        if (!Array.isArray(row)){
            throw new Error("Row is not array");
        }
        if (row.length != this.columnNames.length){
            throw new Error("Invalid row length");
        }
        this.data.push(row);
    }
    
    toRow(rowData){
        let result = [];
        for (let columnName of this.columnNames){
            let column = null;
            if (rowData[columnName]){
                column = rowData[columnName];
            }
            result.push(column);
        }
        return result;
    }
    
    traverse(handler){
        handler(this.columnNames);
        for (let row of this.data){
            handler(row);
        }
    }
}

class SequenceTable extends Table{
    constructor({columnNames, data, createHead, createRow, clearAll}){
        super({columnNames, data});
        this.createHead = createHead;
        this.createRow = createRow;
        this.clearAll = clearAll;
    }
    
    updateElement(){
        this.clearAll();
        this.createHead(this.columnNames);
        for (let row of data){
            this.createRow(row);
        }
    }
}

class RelationalNode{
    constructor(defaultValue){
        this.DEFAULT = defaultValue;
        this.value = this.DEFAULT;
    }
}

class RelationalNodeCollection{
    constructor(){
        this.relationship = [];
    }
}

class RelationalNodeList extends RelationalNodeCollection{
    constructor(nodes){
        this.nodes = nodes;
        
    }
    
    
    
    length(){
        return this.nodes.length;
    }
}

class RelationalStructure extends RelationalNodeList{
    
}

function start(){
    let view = document.getElementById("view");
    let tableView = document.createElement("table");
    view.appendChild(tableView);
    
    let t = new SequenceTable({
        columnNames: ["#", "sym", "mass", "radius", "1st-ion energy", "melt", "boil", "density"],
        data: [
            [1, "H", 1.008, .25, 1312, -259.1, -252.9, 90],
            [2, "He", 4.003, .31, 2372, -272.2, -268.9, 180]
        ],
    });
    
    t.traverse(function(row){
        let rowView = tableView.insertRow(-1);
        for (let column of row){
            let colView = rowView.insertCell(-1);
            colView.innerHTML = column.toString();
        }
    });
}
*/

class Aura{
    constructor(){
        this.data = [];
        //start();
    }
    
    readYAML(data){
        clearObject(this.data);
        let result = jsyaml.load(data);
        Object.assign(this.data, result);
    }
    
    toYAML(){
        return jsyaml.dump(this.data);
    }
}