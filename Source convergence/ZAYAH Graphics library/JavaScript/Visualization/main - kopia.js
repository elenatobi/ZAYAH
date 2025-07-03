//"use strict";

function readFile(element, handler) {
    $(element).change(function (evt) {
        const file = evt.target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = function () {
            console.log(fileReader.result);
        };
        fileReader.readAsText(file);
    });
}

/*
readFile("#fileInput", function(result){
    console.log(result)
});
*/

const TRANSPARENT = "transparent";

const B_SIZE = 0;
const B_PATTERN = 1;
const B_COLOR = 2;


class Transform {
    constructor(m = [1, 0, 0, 1, 0, 0]) {
        this.dirty = false;
        this.m = (m && m.slice()) || [1, 0, 0, 1, 0, 0];
    }
    
    reset() {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 1;
        this.m[4] = 0;
        this.m[5] = 0;
    }
    
    copy() {
        return new Transform(this.m);
    }
    copyInto(tr) {
        tr.m[0] = this.m[0];
        tr.m[1] = this.m[1];
        tr.m[2] = this.m[2];
        tr.m[3] = this.m[3];
        tr.m[4] = this.m[4];
        tr.m[5] = this.m[5];
    }
    
    point(x, y) {
        var m = this.m;
        return [
            m[0] * x + m[2] * y + m[4],
            m[1] * x + m[3] * y + m[5]
        ];
    }
    
    translate(x, y) {
        this.m[4] += this.m[0] * x + this.m[2] * y;
        this.m[5] += this.m[1] * x + this.m[3] * y;
        return this;
    }
    
    scale(sx, sy) {
        this.m[0] *= sx;
        this.m[1] *= sx;
        this.m[2] *= sy;
        this.m[3] *= sy;
        return this;
    }
    
    rotate(rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        var m11 = this.m[0] * c + this.m[2] * s;
        var m12 = this.m[1] * c + this.m[3] * s;
        var m21 = this.m[0] * -s + this.m[2] * c;
        var m22 = this.m[1] * -s + this.m[3] * c;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    }
    
    getTranslation() {
        return [
            this.m[4],
            this.m[5]
        ];
    }
    
    skew(sx, sy) {
        var m11 = this.m[0] + this.m[2] * sy;
        var m12 = this.m[1] + this.m[3] * sy;
        var m21 = this.m[2] + this.m[0] * sx;
        var m22 = this.m[3] + this.m[1] * sx;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    }
    
    multiply(matrix) {
        var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
        var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
        var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
        var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
        var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
        var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        this.m[4] = dx;
        this.m[5] = dy;
        return this;
    }
    
    invert() {
        var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
        var m0 = this.m[3] * d;
        var m1 = -this.m[1] * d;
        var m2 = -this.m[2] * d;
        var m3 = this.m[0] * d;
        var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
        var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
        this.m[0] = m0;
        this.m[1] = m1;
        this.m[2] = m2;
        this.m[3] = m3;
        this.m[4] = m4;
        this.m[5] = m5;
        return this;
    }
    
    getMatrix() {
        return this.m;
    }
}

const MAT_CE = math.matrix([[0.5], [0.5], [1]]);
const MAT_TL = math.matrix([[0], [0], [1]]);
const MAT_TR = math.matrix([[1], [0], [1]]);
const MAT_BL = math.matrix([[0], [1], [1]]);
const MAT_BR = math.matrix([[1], [1], [1]]);
const X = [0, 0];
const Y = [1, 0];

function decompose(matrix) {
    return [
        matrix.get([0, 0]),
        matrix.get([1, 0]),
        matrix.get([0, 1]),
        matrix.get([1, 1]),
        matrix.get([0, 2]),
        matrix.get([1, 2]),
    ];
}

class GraphWin {
    constructor(width, height, layout) {
        this.canvas = document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");
        this.layout = layout;
        this.setSize(width, height);
        this.start();
    }

    setSize(width, height) {
        const scale = window.devicePixelRatio;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.canvas.width = Math.floor(width * scale);
        this.canvas.height = Math.floor(height * scale);
        this.context.scale(scale, scale);
    }
    
    clear(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    start() {
        let layout = this.layout;
        let isDragging = false;
        this.canvas.addEventListener("mousedown", function (event) {
            event.preventDefault();
            layout.mouse("down", event.offsetX, event.offsetY, event);
        });
        this.canvas.addEventListener("mouseup", function (event) {
            event.preventDefault();
            layout.mouse("up", event.offsetX, event.offsetY, event);
        });
        this.canvas.addEventListener("mousemove", function (event) {
            event.preventDefault();
            layout.mouse("move", event.offsetX, event.offsetY, event);
        });
        this.canvas.addEventListener("mousedown", function (event) {
            event.preventDefault();
            isDragging = true;
            layout.mouse("dragstart", event.offsetX, event.offsetY, event);
        });
        this.canvas.addEventListener("mouseup", function (event) {
            event.preventDefault();
            isDragging = false;
            layout.mouse("dragend", event.offsetX, event.offsetY, event);
        });
        this.canvas.addEventListener("mousemove", function (event) {
            event.preventDefault();
            if (isDragging){
                layout.mouse("drag", event.offsetX, event.offsetY, event);
            }
        });
        /*
        this.canvas.addEventListener("touchstart", function (event) {
            layout.mouse("move", event.offsetX, event.offsetY, event);
        });
        this.canvas.addEventListener("touchend", function (event) {
            layout.mouse("move", event.offsetX, event.offsetY, event);
        });
        this.canvas.addEventListener("mousemove", function (event) {
            layout.mouse("move", event.offsetX, event.offsetY, event);
        });
        */
    }
}

class Shape {
    constructor(color) {
        if (this.constructor === Shape) {
            throw new Error("Cannot instance abstract class Shape");
        }
        this.color = color;
        this.border = [0, "solid", "transparent"];
        this.rotation = 0;
        this.mouseHandlers = {};
        this.handlers = {};
    }

    render(ctx) {
        if (this.isFullTransparent()) {
            return;
        }
        ctx.save();
        ctx.transform(...decompose(this.getTransform()));
        this.__render(ctx);
        ctx.restore();
        ctx.lineWidth = this.border[B_SIZE];
        ctx.strokeStyle = this.border[B_COLOR];
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }

    __render() {
        throw new Error(".__render() not implemented");
    }

    transform(matrix) {
        throw new Error(".transform() not implemented");
    }

    isInside(x, y) {
        throw new Error(".isInside() not implemented");
    }

    getBoundRect() {
        throw new Error(".getBoundRect() not implemented");
    }

    getPivot() {
        throw new Error(".getPivot() not implemented");
    }

    getTransform() {
        let [x, y] = this.getPivot();
        
        let sin = Math.sin(this.rotation);
        let cos = Math.cos(this.rotation);
        let t1 = math.matrix([
            [1, 0, -x],
            [0, 1, -y],
            [0, 0, 1],
        ]);
        let t = math.matrix([
            [cos, -sin, 0],
            [sin, cos, 0],
            [0, 0, 1],
        ]);
        let t2 = math.matrix([
            [1, 0, x],
            [0, 1, y],
            [0, 0, 1],
        ]);
        return math.multiply(t2, t, t1);
    }

    isFullTransparent() {
        return this.color === TRANSPARENT && this.border.color === TRANSPARENT;
    }

    mouse(eventName, ...param) {
        if (param.length === 1 && typeof param[0] === "function") {
            this.mouseHandlers[eventName] = param[0];
            return this;
        }
        if (param.length !== 3) {
            throw new Error(
                "Parameters must be (eventName, handler) or (eventName, x, y, event)"
            );
        }
        let [x, y, event] = param;
        let hasHandler = Object.hasOwn(this.mouseHandlers, eventName)
        let hasAntiHandler = Object.hasOwn(this.mouseHandlers, eventName + "out");
        if (!(hasHandler || hasAntiHandler)){
            return;
        }
        let handler = null;
        if (this.isInside(x, y)){
            handler = this.mouseHandlers[eventName];
        }
        else{
            handler = this.mouseHandlers[eventName + "out"];
        }
        if (handler){
            handler(x, y, event);
        }
    }

    on(eventName, handler = null) {
        if (handler) {
            this.handlers[eventName] = handler;
        }
        return this.handlers[eventName];
    }
}

class BoxShape extends Shape {
    constructor(x, y, width, height, color = "black", skewX = 0, skewY = 0) {
        super(color);
        if (this.constructor === BoxShape) {
            throw new Error("Cannot instance abstract class BoxShape");
        }
        this.__dim = math.matrix([
            [width, skewX, x],
            [skewY, height, y],
            [0, 0, 1],
        ]);
    }

    __render(ctx) {
        ctx.fillStyle = this.color;
        ctx.transform(...decompose(this.__dim));
    }

    transform(matrix) {
        this.__dim = math.multiply(matrix, this.getTransform(), this.__dim);
        let t = math.inv(this.getTransform());
        this.__dim = math.multiply(t, this.__dim);
    }

    getBoundRect() {
        let R = math.multiply(this.getTransform(), this.__dim);
        let P1 = math.multiply(R, MAT_TL);
        let P2 = math.multiply(R, MAT_TR);
        let P3 = math.multiply(R, MAT_BL);
        let P4 = math.multiply(R, MAT_BR);
        let xArr = [P1.get(X), P2.get(X), P3.get(X), P4.get(X)];
        let yArr = [P1.get(Y), P2.get(Y), P3.get(Y), P4.get(Y)];
        return [
            Math.min(...xArr),
            Math.min(...yArr),
            Math.max(...xArr),
            Math.max(...yArr),
        ];
    }

    isInside(x, y) {
        let newPos = math.multiply(
            math.inv(math.multiply(this.getTransform(), this.__dim)),
            math.matrix([[x], [y], [1]])
        );
        return this.__isInside(newPos.get(X), newPos.get(Y));
    }

    __isInside(x, y) {
        throw new Error(".__isInside not implemented");
    }

    getPivot() {
        let pivot = math.multiply(this.__dim, MAT_CE);
        return [pivot.get(X), pivot.get(Y)];
    }
}

class Rect extends BoxShape {
    __render(ctx) {
        super.__render(ctx);
        ctx.beginPath();
        ctx.rect(0, 0, 1, 1);
        ctx.closePath();
    }

    __isInside(x, y) {
        return 0 <= x && x <= 1 && 0 <= y && y <= 1;
    }
}

class Ellipse extends BoxShape{
    __render(ctx){
        super.__render(ctx);
        ctx.beginPath();
        ctx.arc(0.5, 0.5, 0.5, 0, 2*Math.PI);
        ctx.closePath();
    }
    
    __isInside(x, y){
        return (x - 0.5)**2 + (y - 0.5)**2 < 0.25;
    }
}

let s = new Ellipse(80, 50, 200, 250, "rgba(255, 0, 0, 0.5)", 50, 25);
s.rotation = Math.PI / 3;
let [xLeft, yLeft, ,] = s.getBoundRect();
s.transform(
    math.multiply(
        math.matrix([
            [1, 0, xLeft],
            [0, 1, yLeft],
            [0, 0, 1],
        ]),
        math.matrix([
            [1.3, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ]),
        math.matrix([
            [1, 0, -xLeft],
            [0, 1, -yLeft],
            [0, 0, 1],
        ])
    )
);

let [x1, y1, x2, y2] = s.getBoundRect();
console.log(x1, y1, x2, y2);

let b = new Rect(x1, y1, x2 - x1, y2 - y1, "transparent");
s.border = [1, "solid", "silver"];
b.border = [1, "solid", "blue"];

/*
s.mouse("downout", function (x, y, event) {
    console.log("mousedown", x, y, event);
});
s.mouse("up", function (x, y, event) {
    console.log("mouseup", x, y, event);
});
*/
s.mouse("move", function (x, y, event) {
    s.color = "green";
    render();
});

s.mouse("moveout", function(x, y, event){
   s.color =  "rgba(255, 0, 0, 0.5)";
   render();
});

/*
s.mouse("dragstart", function (x, y, event) {
    console.log("dragstart", x, y, event);
});
s.mouse("drag", function (x, y, event) {
    console.log("drag", x, y, event);
});
s.mouse("dragend", function (x, y, event) {
    console.log("dragend", x, y, event);
});
*/

console.log(s);

const g = new GraphWin(1050, 750, s);
let ctx = g.context;
function render(){
    g.clear();
    b.render(ctx);
    s.render(ctx);

}
render();