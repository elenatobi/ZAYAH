class ApproxFunction {
    constructor(f) {
        this.f = f;
    }

    root(lower, upper, precision = 0.001) {
        while (upper - lower > precision) {
            const middle = (lower + upper) / 2;
            if (this.f(lower) * this.f(middle) < 0) {
                upper = middle;
            } else {
                lower = middle;
            }
        }
        return middle;
    }

    derivate(value) {
        const h = 0.1;
        return (this.f(value + h) - this.f(value)) / h;
    }
}

class CASNode {}
class CASSymbol extends CASNode {
    constructor(name) {
        super();
        this.name = name;
    }

    toString() {
        return this.name;
    }
}

class CASExpr extends CASNode {
    constructor(values) {
        super();
        this.values = values;
    }

    toString() {
        const values = this.values.map((value) => value.toString());
        return values.join(this.OPERATOR);
    }

    evaluate(symbolMap) {
        throw new Error(".evaluate() not implemented");
    }

    simplify(symbolMap) {
        throw new Error(".simplify() not implemented");
    }
}

class AddExpr extends CASExpr {
    OPERATOR = "+";
}
