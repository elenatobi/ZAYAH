'use strict';

const MOUSEMOVE = 'mousemove';
const MOUSEDOWN = 'mousedown';
const MOUSEUP = 'mouseup';
const TOUCHSTART = 'touchstart';
const TOUCHEND = 'touchend';
const TOUCHMOVE = 'touchmove';

const SOLID = [];

function arrayRemoveByValue(array, value){
    for (let i = 0; i < array.length; i++) {
        if (array[i] === value) {
            array.splice(i, 1);
            i--;
        }
    }
}

function arrayIsEmpty(array){
    return (array.length === 0);
}

function objectIsEmpty(object){
    return (Object.keys(object).length === 0);
}

function isFunction(value){
    return typeof value === 'function';
}

function genMouseSimple(name){
    return function (event, hitList, _){
        let {offsetX: x, offsetY: y} = event;
        for (let hitNode of hitList){
            if (hitNode.isInside(x, y)){
                hitNode.fire(name, {x: x, y: y});
            }
        }
    }
}

function genMouseOutside(name){
    return function (event, hitList, _){
        let {offsetX: x, offsetY: y} = event;
        for (let hitNode of hitList){
            if (!hitNode.isInside(x, y)){
                hitNode.fire(name, {x: x, y: y});
            }
        }
    }
}

function genMouseOver(name){
    return function (event, hitList, _){
        let {offsetX: x, offsetY: y} = event;
        for (let i = hitList.length - 1; i >= 0; i--){
            let hitNode = hitList[i];
            if (hitNode.isInside(x, y)){
                hitNode.fire(name, {x: x, y: y});
                break;
            }
        }
    }
}

const eventMap = {
    'mouse:move': ["mousemove", genMouseSimple('mouse:move')],
    'mouse:down': ["mousedown", genMouseSimple('mouse:down')],
    'mouse:up': ['mouseup', genMouseSimple('mouse:up')],
    'mouse:move:out': ["mousemove", genMouseOutside('mouse:move:out')],
    'mouse:down:out': ["mousedown", genMouseOutside('mouse:down:out')],
    'mouse:up:out': ['mouseup', genMouseOutside('mouse:up:out')],
    'mouse:move:over': ["mousemove", genMouseOver('mouse:move:over')],
    'mouse:down:over': ["mousedown", genMouseOver('mouse:down:over')],
    'mouse:up:over': ['mouseup', genMouseOver('mouse:up:over')],
    'drag:start': ['mousedown', function(event, hitList, cargo){
        if (cargo.isDragging){
            return;
        }
        let {offsetX: x, offsetY: y} = event;
        for (let hitNode of hitList){
            if (hitNode.isInside(x, y)){
                hitNode.fire("drag:start", {x: x, y: y});
            }
        }
        cargo.isDragging = true;
    }],
    'drag:move': ['mousemove', function(event, hitList, cargo){
        if (!cargo.isDragging){
            return;
        }
        let {offsetX: x, offsetY: y} = event;
        for (let hitNode of hitList){
            if (hitNode.isInside(x, y)){
                hitNode.fire("drag:move", {x: x, y: y});
            }
        }
    }],
    'drag:end': ['mouseup', function(event, hitList, cargo){
        if (!cargo.isDragging){
            return;
        }
        let {offsetX: x, offsetY: y} = event;
        for (let hitNode of hitList){
            if (hitNode.isInside(x, y)){
                hitNode.fire("drag:end", {x: x, y: y});
            }
        }
        cargo.isDragging = false;
    }],
    'drag:start:over': ['mousedown', function(event, hitList, cargo){
        if (cargo.isDragging){
            return;
        }
        let {offsetX: x, offsetY: y} = event;
        for (let hitNode of hitList){
            if (hitNode.isInside(x, y)){
                hitNode.fire("drag:start:over", {x: x, y: y});
            }
        }
        cargo.isDragging = true;
    }],
    'drag:move:over': ['mousemove', function(event, hitList, cargo){
        if (!cargo.isDragging){
            return;
        }
        let {offsetX: x, offsetY: y} = event;
        for (let hitNode of hitList){
            if (hitNode.isInside(x, y)){
                hitNode.fire("drag:move:over", {x: x, y: y});
            }
        }
    }],
    'drag:end:over': ['mouseup', function(event, hitList, cargo){
        if (!cargo.isDragging){
            return;
        }
        let {offsetX: x, offsetY: y} = event;
        for (let hitNode of hitList){
            if (hitNode.isInside(x, y)){
                hitNode.fire("drag:end:over", {x: x, y: y});
            }
        }
        cargo.isDragging = false;
    }],
    'touch:start': ['touchstart', function(event, hitList, cargo){
        let touch = event.touches[0];
        let rect = event.target.getBoundingClientRect();
        let x = touch.clientX - rect.left;
        let y = touch.clientY - rect.top;
        cargo.x = x;
        cargo.y = y;
        for (let hitNode of hitList){
            if (hitNode.isInside(x, y)){
                hitNode.fire("touch:start", {x: x, y: y});
            }
        }
    }],
    'touch:move': ['touchmove', function(event, hitList, cargo){
        let touch = event.touches[0];
        let rect = event.target.getBoundingClientRect();
        let x = touch.clientX - rect.left;
        let y = touch.clientY - rect.top;
        cargo.x = x;
        cargo.y = y;
        for (let hitNode of hitList){
            if (hitNode.isInside(x, y)){
                hitNode.fire("touch:move", {x: x, y: y});
            }
        }
    }],
    'touch:end': ['touchend', function(event, hitList, cargo){
        let x = cargo.x;
        let y = cargo.y;
        for (let hitNode of hitList){
            if (hitNode.isInside(x, y)){
                hitNode.fire("touch:end", {x: x, y: y});
            }
        }
    }],
};

class Transform {
    constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
        this.dirty = false;
        this.T = [a, b, c, d, e, f];
    }

    static zero() {
        return new this(0, 0, 0, 0, 0, 0);
    }

    stain() {
        this.dirty = true;
    }

    clean() {
        this.dirty = false;
    }

    reset() {
        this.T[0] = 1;
        this.T[1] = 0;
        this.T[2] = 0;
        this.T[3] = 1;
        this.T[4] = 0;
        this.T[5] = 0;
    }

    copy() {
        return new Transform(this.T[0], this.T[1], this.T[2], this.T[3], this.T[4], this.T[5]);
    }

    copyInto(other) {
        other.T[0] = this.T[0];
        other.T[1] = this.T[1];
        other.T[2] = this.T[2];
        other.T[3] = this.T[3];
        other.T[4] = this.T[4];
        other.T[5] = this.T[5];
    }

    point(x, y) {
        return [
            this.T[0] * x + this.T[2] * y + this.T[4],
            this.T[1] * x + this.T[3] * y + this.T[5],
        ];
    }

    translate(x, y) {
        this.T[4] += this.T[0] * x + this.T[2] * y;
        this.T[5] += this.T[1] * x + this.T[3] * y;
        return this;
    }

    scale(sx, sy) {
        this.T[0] *= sx;
        this.T[1] *= sx;
        this.T[2] *= sy;
        this.T[3] *= sy;
        return this;
    }

    rotate(angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let T0 = this.T[0] * c + this.T[2] * s;
        let T1 = this.T[1] * c + this.T[3] * s;
        let T2 = this.T[0] * -s + this.T[2] * c;
        let T3 = this.T[1] * -s + this.T[3] * c;
        this.T[0] = T0;
        this.T[1] = T1;
        this.T[2] = T2;
        this.T[3] = T3;
        return this;
    }

    skew(sx, sy) {
        let T0 = this.T[0] + this.T[2] * sy;
        let T1 = this.T[1] + this.T[3] * sy;
        let T2 = this.T[2] + this.T[0] * sx;
        let T3 = this.T[3] + this.T[1] * sx;
        this.T[0] = T0;
        this.T[1] = T1;
        this.T[2] = T2;
        this.T[3] = T3;
        return this;
    }

    mul(other) {
        let a = this.T[0] * other.T[0] + this.T[2] * other.T[1];
        let b = this.T[1] * other.T[0] + this.T[3] * other.T[1];
        let c = this.T[0] * other.T[2] + this.T[2] * other.T[3];
        let d = this.T[1] * other.T[2] + this.T[3] * other.T[3];
        let e = this.T[0] * other.T[4] + this.T[2] * other.T[5] + this.T[4];
        let f = this.T[1] * other.T[4] + this.T[3] * other.T[5] + this.T[5];
        return new Transform(a, b, c, d, e, f);
    }

    imul(other) {
        let a = this.T[0] * other.T[0] + this.T[2] * other.T[1];
        let b = this.T[1] * other.T[0] + this.T[3] * other.T[1];
        let c = this.T[0] * other.T[2] + this.T[2] * other.T[3];
        let d = this.T[1] * other.T[2] + this.T[3] * other.T[3];
        let e = this.T[0] * other.T[4] + this.T[2] * other.T[5] + this.T[4];
        let f = this.T[1] * other.T[4] + this.T[3] * other.T[5] + this.T[5];
        this.T[0] = a;
        this.T[1] = b;
        this.T[2] = c;
        this.T[3] = d;
        this.T[4] = e;
        this.T[5] = f;
        return this;
    }

    rmul(other) {
        let a = other.T[0] * this.T[0] + other.T[2] * this.T[1];
        let b = other.T[1] * this.T[0] + other.T[3] * this.T[1];
        let c = other.T[0] * this.T[2] + other.T[2] * this.T[3];
        let d = other.T[1] * this.T[2] + other.T[3] * this.T[3];
        let e = other.T[0] * this.T[4] + other.T[2] * this.T[5] + other.T[4];
        let f = other.T[1] * this.T[4] + other.T[3] * this.T[5] + other.T[5];
        this.T[0] = a;
        this.T[1] = b;
        this.T[2] = c;
        this.T[3] = d;
        this.T[4] = e;
        this.T[5] = f;
        return this;
    }

    inv() {
        let inv = 1 / (this.T[0] * this.T[3] - this.T[1] * this.T[2]);
        let a = this.T[3] * inv;
        let b = -this.T[1] * inv;
        let c = -this.T[2] * inv;
        let d = this.T[0] * inv;
        let e = inv * (this.T[2] * this.T[5] - this.T[3] * this.T[4]);
        let f = inv * (this.T[1] * this.T[4] - this.T[0] * this.T[5]);
        return new Transform(a, b, c, d, e, f);
    }

    iinv() {
        let inv = 1 / (this.T[0] * this.T[3] - this.T[1] * this.T[2]);
        let a = this.T[3] * inv;
        let b = -this.T[1] * inv;
        let c = -this.T[2] * inv;
        let d = this.T[0] * inv;
        let e = inv * (this.T[2] * this.T[5] - this.T[3] * this.T[4]);
        let f = inv * (this.T[1] * this.T[4] - this.T[0] * this.T[5]);
        this.T[0] = a;
        this.T[1] = b;
        this.T[2] = c;
        this.T[3] = d;
        this.T[4] = e;
        this.T[5] = f;
        return this;
    }

    toString() {
        return `Transform(${this.T})`;
    }
}

class Context {
    constructor(canvas = document.createElement("canvas")) {
        this.c = canvas;
        this.ctx = this.c.getContext('2d');
        this.dirty = true;
        this.scale = window.devicePixelRatio;
    }

    resize(width, height) {
        this.c.width = width * this.scale;
        this.c.height = height * this.scale;
        this.c.style.width = `${width}px`;
        this.c.style.height = `${height}px`;
        this.ctx.scale(this.scale, this.scale);
    }

    requireRefresh() {
        this.dirty = true;
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    }

    clearRect(x, y, width, height) {
        this.ctx.clearRect(x, y, width, height);
    }

    save() {
        this.ctx.save();
    }

    restore() {
        this.ctx.restore();
    }

    transform(transform) {
        let [a, b, c, d, e, f] = transform.T;
        this.ctx.transform(a, b, c, d, e, f);
    }

    setTransform(transform) {
        let [a, b, c, d, e, f] = transform.T;
        this.ctx.setTransform(a, b, c, d, e, f);
    }

    translate(x, y) {
        this.ctx.translate(x, y);
    }

    scale(x, y) {
        this.ctx.scale(x, y);
    }

    rotate(angle, xc = 0, yc = 0) {
        if (xc === 0 && yc === 0) {
            this.ctx.rotate(angle);
            return;
        }
        this.ctx.translate(xc, yc);
        this.ctx.rotate(angle);
        this.ctx.translate(-xc, -yc);
    }

    setFill(value) {
        this.ctx.fillStyle = value;
    }

    setStroke(value) {
        this.ctx.strokeStyle = value;
    }

    setLineWidth(value) {
        this.ctx.lineWidth = value;
    }

    setLineDash(value) {
        this.ctx.setLineDash(value);
    }

    beginPath() {
        this.ctx.beginPath();
    }

    closePath() {
        this.ctx.closePath();
    }

    moveTo(x, y) {
        this.ctx.moveTo(x, y);
    }

    lineTo(x, y) {
        this.ctx.lineTo(x, y);
    }

    rect(transformDim) {
        this.ctx.save();
        this.transform(transformDim);
        this.ctx.rect(0, 0, 1, 1);
        this.ctx.restore();
    }

    ellipse(transformDim, startAngle, endAngle, antiClockWise = false) {
        this.ctx.beginPath();
        this.ctx.save();
        this.transform(transformDim);
        this.ctx.arc(0.5, 0.5, 0.5, startAngle, endAngle, antiClockWise);
        this.ctx.restore();
        this.ctx.closePath();
    }

    fillStroke() {
        this.ctx.fill();
        this.ctx.stroke();
    }

    isPointInPath(x, y) {
        return this.ctx.isPointInPath(x, y);
    }
    
    getImageData(x, y, width, height){
        return this.ctx.getImageData(x, y, width, height).data;
    }
}

class HitManager{
    constructor(canvas){
        this.c = canvas;
        this.dirty = true;
        this.nodes = [];
        this.boundHandlers = {};
        this.handlerCargo = {};
    }
    
    hasBound(name){
        return isFunction(this.boundHandlers[name]);
    }
    
    start(name){
        if (this.hasBound(name)){
            return;
        }
        if (!eventMap[name]){
            console.warn(`Oops, seems like ${name} is not implemented`);
            return;
        }
        let [HTMLname, handler] = eventMap[name];
        let nodes = this.nodes;
        let cargo = this.handlerCargo;
        let wrapper = function(event){
            event.preventDefault();
            if (nodes){
                handler(event, nodes, cargo);
            }
        }
        this.boundHandlers[name] = wrapper;
        this.c.addEventListener(HTMLname, wrapper);
    }
    
    clear(){
        this.nodes = [];
    }
    
    add(node){
        this.nodes.push(node);
    }
}

class GraphWin {
    constructor(n) {
        this.c = document.getElementById(n);
        this.ctx = new Context(this.c);
        this.hit = new Context();
        this.hitManager = new HitManager(this.c);
        this.lowerNodes = [];
        this.start();
    }

    start() {
        let gr = this;
        let ctx = this.ctx;
        let hm = this.hitManager;
        this.resize(this.c.width, this.c.height);
        window.setInterval(function () {
            if (ctx.dirty) {
                gr.render(ctx);
                ctx.dirty = false;
            }
            if (hm.dirty){
                for (let node of gr.lowerNodes){
                    node.traverse(hm.add.bind(hm));
                }
                hm.dirty = false;
            }
        }, 1000 / 24);
    }

    render(ctx) {
        ctx.clearAll();
        for (let lowerNode of this.lowerNodes) {
            lowerNode.render(ctx);
        }
    }
    
    requireRefresh(){
        this.ctx.requireRefresh();
    }

    resize(width, height) {
        this.ctx.resize(width, height);
    }

    add(node) {
        node.inject(this);
        this.lowerNodes.push(node);
    }
}

class Node {
    constructor() {
        this.fill = 'black';
        this.rotation = 0;
        this.stroke = 'transparent';
        this.lineWidth = 0;
        this.lineDash = SOLID;
        this.handlers = {};
        this.hitContext = null;
        this.outerTransform = new Transform();
        this.__glob = null;
    }

    inject(glob) {
        this.__glob = glob;
    }

    requireRefresh() {
        if (this.__glob) {
            this.__glob.requireRefresh();
        }
    }

    transform(transform) {
        throw new Error('.transform() not implemented');
    }

    getBoundingRect() {
        throw new Error('.getBoundingRect() not implemented');
    }
    
    traverse(handler){
        handler(this);
    }

    render(ctx) {
        if (!this.sceneFunc) {
            return;
        }
        ctx.setFill(this.fill);
        ctx.setStroke(this.stroke);
        ctx.setLineWidth(this.lineWidth);
        ctx.setLineDash(this.lineDash);
        let [x, y] = this.pivot();
        ctx.save();
        ctx.rotate(this.rotation, x, y);
        this.sceneFunc(ctx);
        ctx.restore();
    }

    isInside(x, y) {
        if (!this.sceneFunc) {
            return false;
        }
        if (!this.hitContext){
            this.hitContext = new Context();
        }
        let ctx = this.hitContext;
        //let ctx = this.__glob.hit;
        if (ctx.dirty){
            console.log("Hit dirty! Refreshing hit")
            let [xP, yP] = this.pivot();
            ctx.clearAll();
            ctx.save();
            ctx.transform(this.outerTransform);
            ctx.rotate(this.rotation, xP, yP);
            this.sceneFunc(ctx);
            ctx.restore();
            ctx.dirty = false;
        }
        return ctx.isPointInPath(x, y);
    }

    fire(name, event) {
        if (!this.handlers[name]) {
            return;
        }
        for (let handler of this.handlers[name]) {
            handler.call(this, event);
        }
    }

    bind(name, handler) {
        if (this.handlers[name]) {
            this.handlers[name].push(handler);
        }
        else{
            this.__glob.hitManager.start(name);
            this.handlers[name] = [handler];
        }
    }
    
    unbind(name, handler){
        if (!this.handlers[name]){
            return;
        }
        let handlers = this.handlers[name];
        arrayRemoveByValue(handlers, handler);
        if (arrayIsEmpty(handlers)){
            delete this.handlers[name];
        }
    }

    sceneFunc(ctx) {
        throw new Error('.sceneFunc() not implemented');
    }
}

class BoxNode extends Node {
    constructor(config) {
        super();
        this.dim = Transform.zero();
        Object.assign(this, config);
    }

    pivot() {
        return this.dim.point(0.5, 0.5);
    }

    set x(value) {
        if (this.x === value) {
            return;
        }
        this.dim.T[4] = value;
        this.requireRefresh();
    }

    get x() {
        return this.dim.T[4];
    }

    set y(value) {
        if (this.y === value) {
            return;
        }
        this.dim.T[5] = value;
        this.requireRefresh();
    }

    get y() {
        return this.dim.T[5];
    }

    set width(value) {
        if (this.width === value) {
            return;
        }
        this.dim.T[0] = value;
        this.requireRefresh();
    }

    get width() {
        return this.dim.T[0];
    }

    set height(value) {
        if (this.height === value) {
            return;
        }
        this.dim.T[3] = value;
        this.requireRefresh();
    }

    get height() {
        return this.dim.T[3];
    }

    set skewX(value) {
        if (this.skewX === value) {
            return;
        }
        this.dim.T[1] = value;
        this.requireRefresh();
    }

    get skewX() {
        return this.dim.T[1];
    }

    set skewY(value) {
        if (this.skewY === value) {
            return;
        }
        this.dim.T[2] = value;
        this.requireRefresh();
    }

    get skewY() {
        return this.dim.T[2];
    }
}

class Rect extends BoxNode {
    sceneFunc(ctx) {
        ctx.beginPath();
        ctx.rect(this.dim);
        ctx.closePath();
        ctx.fillStroke();
    }
}

let g = new GraphWin('myCanvas');
g.resize(500, 200);

let r1 = new Rect({
    x: 320,
    y: 50,
    width: 75,
    height: 35,
    skewX: 10,
    skewY: 20,
    fill: 'red',
    stroke: 'green',
    lineWidth: 1,
    lineDash: [5],
    rotation: Math.PI/3
});

let r2 = new Rect({
    x: 365,
    y: 35,
    width: 37,
    height: 57,
    fill: 'yellow'
})

g.add(r1);
g.add(r2);


r1.bind('mouse:move:over', function (evt) {
    this.fill = "orange";
    this.requireRefresh();
});

r1.bind('mouse:move:out', function(evt){
    this.fill = "red";
    this.requireRefresh()
})


/*
r2.bind('mouse:move:over', function (evt) {
    console.log('mouse:down over 2');
});
*/


/*
r1.bind("touch:start", function(evt){
    console.log("touch:start", evt.x, evt.y)
})
*/

r1.bind('mouse:down', function (evt) {
    console.log('mouse:down over 1');
});

r1.bind("touch:move", function(evt){
    console.log("touch:move1", evt.x, evt.y)
})

r2.bind("touch:move", function(evt){
    console.log("touch:move2", evt.x, evt.y)
})

/*
r1.bind("touch:end", function(evt){
    console.log("touch:end", evt.x, evt.y)
})
*/

window.g = g;
window.r1 = r1;
window.r2 = r2;