'use strict';

const MOUSEMOVE = 'mousemove';
const MOUSEDOWN = 'mousedown';
const MOUSEUP = 'mouseup';
const TOUCHSTART = 'touchstart';
const TOUCHEND = 'touchend';
const TOUCHMOVE = 'touchmove';

const SOLID = [];

function arrayRemoveByValue(array, value) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === value) {
            array.splice(i, 1);
            i--;
        }
    }
}

function arrayIsEmpty(array) {
    return array.length === 0;
}

function objectIsEmpty(object) {
    return Object.keys(object).length === 0;
}

function isFunction(value) {
    return typeof value === 'function';
}

function getRandomColor() {
    let r = Math.round(Math.random() * 255);
    let g = Math.round(Math.random() * 255);
    let b = Math.round(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
}

function genMouse(name) {
    return function (event, hit, col) {
        let x = event.offsetX;
        let y = event.offsetY;
        let pixel = hit.getImageData(x, y, 1, 1).data;
        let target = col.get(pixel[0], pixel[1], pixel[2]);
        if (target) {
            target.fire(name, { x: x, y: y });
        }
    };
}

function genMouseOut(name) {
    return function (event, hit, col) {
        let x = event.offsetX;
        let y = event.offsetY;
        let pixel = hit.getImageData(x, y, 1, 1).data;
        let target = col.get(pixel[0], pixel[1], pixel[2]);
        for (let color in col.colorsHash) {
            let node = col.colorsHash[color];
            if (node != target) {
                node.fire(name, { x: x, y: y });
            }
        }
    };
}

const eventMap = {
    mousemove: ['mousemove', genMouse('mousemove')],
    mousedown: ['mousedown', genMouse('mousedown')],
    mouseup: ['mouseup', genMouse('mouseup')],
    mousemoveout: ['mousemove', genMouseOut('mousemoveout')],
    mousedownout: ['mousedown', genMouseOut('mousedownout')],
    mouseupout: ['mouseup', genMouseOut('mouseupout')],
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

class ColorKeyManager {
    constructor() {
        this.colorsHash = {};
    }

    get(r, g, b) {
        let color = `rgb(${r},${g},${b})`;
        let node = this.colorsHash[color];
        if (node) {
            return node;
        }
        return null;
    }

    assignColor(node) {
        let colorKey = getRandomColor();
        if (this.colorsHash[colorKey]) {
            colorKey = getRandomColor();
        }
        node.colorKey = colorKey;
        this.colorsHash[colorKey] = node;
    }

    removeByColor(colorKey) {
        delete this.colorsHash[colorKey];
    }
}

class Context {
    constructor(canvas = document.createElement('canvas')) {
        this.c = canvas;
        this.ctx = this.c.getContext('2d', { willReadFrequently: true });
        this.dirty = true;
    }

    sharpResize(width, height) {
        let scale = window.devicePixelRatio;
        this.c.width = width * scale;
        this.c.height = height * scale;
        this.c.style.width = `${width}px`;
        this.c.style.height = `${height}px`;
        this.ctx.scale(scale, scale);
    }

    resize(width, height) {
        this.c.width = width;
        this.c.height = height;
        this.c.style.width = `${width}px`;
        this.c.style.height = `${height}px`;
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

    drawImage(img, x, y, width, height) {
        this.ctx.drawImage(img, x, y, width, height);
    }

    fillStroke() {
        this.ctx.fill();
        this.ctx.stroke();
    }

    isPointInPath(x, y) {
        return this.ctx.isPointInPath(x, y);
    }

    getImageData(x, y, width, height) {
        return this.ctx.getImageData(x, y, width, height);
    }
}

class GraphWin {
    constructor(n) {
        this.c = document.getElementById(n);
        this.ctx = new Context(this.c);
        this.hit = new Context();
        this.col = new ColorKeyManager();
        this.fps = 24;
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
        }, 1000 / this.fps);
    }

    startEvent(name) {
        let gr = this;
        let [eventName, handler] = eventMap[name];
        let hit = this.hit;
        let col = this.col;
        this.c.addEventListener(eventName, function (event) {
            if (hit.dirty) {
                gr.renderHit(hit);
                hit.dirty = false;
            }
            handler(event, hit, col);
        });
    }

    render(ctx) {
        ctx.clearAll();
        for (let lowerNode of this.lowerNodes) {
            lowerNode.render(ctx);
        }
    }

    renderHit(ctx) {
        ctx.clearAll();
        for (let lowerNode of this.lowerNodes) {
            lowerNode.renderHit(ctx);
        }
    }

    requireRefresh() {
        this.ctx.requireRefresh();
        this.hit.requireRefresh();
    }

    resize(width, height) {
        this.ctx.sharpResize(width, height);
        this.hit.resize(width, height);
    }

    add(node) {
        node.inject(this);
        this.lowerNodes.push(node);
    }
}

class Node {
    constructor() {
        this.colorKey = 'rgb(0, 0, 0)';
        this.fill = 'black';
        this.rotation = 0;
        this.stroke = 'transparent';
        this.lineWidth = 0;
        this.lineDash = SOLID;
        this.handlers = {};
        this.outerTransform = new Transform();
        this.__glob = null;
    }

    inject(glob) {
        this.__glob = glob;
        this.__glob.col.assignColor(this);
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

    getRotateTransform() {
        let transform = new Transform();
        let [x, y] = this.pivot();
        transform.translate(x, y);
        transform.rotate(this.rotation);
        transform.translate(-x, -y);
        return transform;
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

    renderHit(ctx) {
        if (!this.sceneFunc) {
            return;
        }
        if (this.fill === 'transparent') {
            ctx.setFill('transparent');
        } else {
            ctx.setFill(this.colorKey);
        }
        ctx.setStroke(this.colorKey);
        if (this.lineWidth < 5) {
            ctx.setLineWidth(5);
        } else {
            ctx.setLineWidth(this.lineWidth);
        }
        let [x, y] = this.pivot();
        ctx.save();
        ctx.rotate(this.rotation, x, y);
        this.hitFunc(ctx);
        ctx.restore();
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
        } else {
            this.__glob.startEvent(name);
            this.handlers[name] = [handler];
        }
    }

    unbind(name, handler) {
        if (!this.handlers[name]) {
            return;
        }
        let handlers = this.handlers[name];
        arrayRemoveByValue(handlers, handler);
    }

    sceneFunc(ctx) {
        throw new Error('.sceneFunc() not implemented');
    }

    hitFunc(ctx) {
        this.sceneFunc(ctx);
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

    getBoundingRect() {
        let full = this.getRotateTransform().mul(this.dim);
        let [p1x, p1y] = full.point(0, 0);
        let [p2x, p2y] = full.point(0, 1);
        let [p3x, p3y] = full.point(1, 0);
        let [p4x, p4y] = full.point(1, 1);
        let xMin = Math.min(p1x, p2x, p3x, p4x);
        let yMin = Math.min(p1y, p2y, p3y, p4y);
        let xMax = Math.max(p1x, p2x, p3x, p4x);
        let yMax = Math.max(p1y, p2y, p3y, p4y);
        return [xMin, yMin, xMax - xMin, yMax - yMin];
    }

    transform(transform) {
        this.dim.rmul(this.getRotateTransform());
        this.dim.rmul(transform);
        this.dim.rmul(this.getRotateTransform().iinv());
        this.requireRefresh();
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

class Ellipse extends BoxNode {
    constructor(config) {
        super();
        this.startAngle = 0;
        this.endAngle = Math.PI * 2;
        this.antiClockwise = false;
        Object.assign(this, config);
    }

    sceneFunc(ctx) {
        ctx.beginPath();
        ctx.ellipse(this.dim, this.startAngle, this.endAngle, this.antiClockwise);
        ctx.closePath();
        ctx.fillStroke();
    }
}

class Image extends BoxNode {
    constructor(config) {
        super();
        this.element = null;
        Object.assign(this, config);
    }

    set src(value) {
        this.element = document.createElement('img');
        this.element.src = value;
        this.element.onload = () => {
            if (this.width === 0 || this.height === 0) {
                this.width = this.element.width;
                this.height = this.element.height;
            }
        };
    }

    get src() {
        return this.element.src;
    }

    sceneFunc(ctx) {
        ctx.transform(this.dim);
        ctx.drawImage(this.element, 0, 0, 1, 1);
    }

    hitFunc(ctx) {
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
    rotation: Math.PI / 3,
});
g.add(r1);

let r2 = new Rect({
    x: 365,
    y: 35,
    width: 37,
    height: 57,
    fill: 'yellow',
});
g.add(r2);

let e1 = new Ellipse({
    x: 132,
    y: 50,
    width: 75,
    height: 35,
    startAngle: 0,
    endAngle: Math.PI / 2,
    antiClockwise: true,
    rotation: Math.PI / 3,
    fill: 'blue',
});
g.add(e1);

let i1 = new Image({
    x: 25,
    y: 10,
    width: 75,
    height: 35,
    rotation: Math.PI / 2,
    src: 'https://www.gstatic.com/webp/gallery/1.jpg',
});
g.add(i1);

let [xBound, yBound, wBound, hBound] = r1.getBoundingRect();

let r1b = new Rect({
    x: xBound,
    y: yBound,
    width: wBound,
    height: hBound,
    fill: 'transparent',
    stroke: 'aquamarine',
});
g.add(r1b);

let r1t = new Rect({
    x: 320,
    y: 50,
    width: 75,
    height: 35,
    skewX: 10,
    skewY: 20,
    fill: 'rgba(255, 0, 0, 0.3)',
    stroke: 'green',
    lineWidth: 1,
    lineDash: [5],
    rotation: Math.PI / 3,
});
g.add(r1t);

let m = new Transform().translate(xBound, yBound).scale(2, 1.5).translate(-xBound, -yBound);

r1t.transform(m);

r1.bind('mousemove', function (evt) {
    if (this.fill != 'orange') {
        this.fill = 'orange';
        this.requireRefresh();
    }
});

r1.bind('mousemoveout', function (evt) {
    if (this.fill != 'red') {
        this.fill = 'red';
        this.requireRefresh();
    }
});

r1b.bind('mousemove', function (evt) {
    if (this.stroke != 'violet') {
        this.stroke = 'violet';
        this.requireRefresh();
    }
});

r1b.bind('mousemoveout', function (evt) {
    if (this.stroke != 'aquamarine') {
        this.stroke = 'aquamarine';
        this.requireRefresh();
    }
});

e1.bind('mousemove', function (evt) {
    if (this.fill != 'lightblue') {
        this.fill = 'lightblue';
        this.requireRefresh();
    }
});

e1.bind('mousemoveout', function (evt) {
    if (this.fill != 'blue') {
        this.fill = 'blue';
        this.requireRefresh();
    }
});

window.g = g;
window.r1 = r1;
window.e1 = e1;

document.body.appendChild(g.hit.c);
