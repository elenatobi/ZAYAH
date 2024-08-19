function isNull(value) {
    return value === null;
}

function isString(value) {
    return typeof value === "string";
}

function isArray(value) {
    return Array.isArray(value);
}

function isObject(value) {
    return value.constructor === Object;
}

function arrayHas(array, value) {
    return array.indexOf(value) !== -1;
}

function arrayMove(array, srcIndex, destIndex) {
    array.splice(destIndex, 0, array.splice(srcIndex, 1)[0]);
}

function arrayDelete(array, value) {
    let i = 0;
    while (i < array.length) {
        if (array[i] === value) {
            array.splice(i, 1);
        } else {
            i++;
        }
    }
}

function arrayClear(array) {
    array.splice(0, array.length);
}

function sum(array) {
    return array.reduce(function (partialSum, x) {
        return partialSum + x;
    }, 0);
}
