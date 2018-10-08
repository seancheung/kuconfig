/**
 * Return the max number in the array
 *
 * @param {number[]} params
 * @returns {number}
 */
function $max(params) {
    if (Array.isArray(params) && params.every(p => typeof p === 'number')) {
        return Math.max(...params);
    }
    throw new Error('$max expects an array of number');
}

/**
 * Return the min number in the array
 *
 * @param {number[]} params
 * @returns {number}
 */
function $min(params) {
    if (Array.isArray(params) && params.every(p => typeof p === 'number')) {
        return Math.min(...params);
    }
    throw new Error('$min expects an array of number');
}

/**
 * Sum the numbers in the array
 *
 * @param {number[]} params
 * @returns {number}
 */
function $sum(params) {
    if (Array.isArray(params) && params.every(p => typeof p === 'number')) {
        return params.reduce((t, n) => t + n, 0);
    }
    throw new Error('$sum expects an array of number');
}

/**
 * Return the average value of the array
 *
 * @param {number[]} params
 * @returns {number}
 */
function $avg(params) {
    if (Array.isArray(params) && params.every(p => typeof p === 'number')) {
        return params.reduce((t, n) => t + n, 0) / params.length;
    }
    throw new Error('$avg expects an array of number');
}

/**
 * Return the first element in the array
 *
 * @param {any[]} params
 * @returns {any}
 */
function $first(params) {
    if (Array.isArray(params)) {
        return params[0];
    }
    throw new Error('$first expects an array');
}

/**
 * Return the last element in the array
 *
 * @param {any[]} params
 * @returns {any}
 */
function $last(params) {
    if (Array.isArray(params)) {
        return params[params.length - 1];
    }
    throw new Error('$last expects an array');
}

/**
 * Return element in the array at the given index
 *
 * @param {[any[], number]} params
 * @returns {any}
 */
function $at(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        Array.isArray(params[0]) &&
        typeof params[1] === 'number'
    ) {
        return params[0][params[1]];
    }
    throw new Error(
        '$at expects an array with two elements of which the first must be an array and the second be a number'
    );
}

/**
 * Concat strings or arrays
 *
 * @param {string[]|[][]} params
 * @returns {string|any[]}
 */
function $concat(params) {
    if (
        Array.isArray(params) &&
        (params.every(p => typeof p === 'string') ||
            params.every(p => Array.isArray(p)))
    ) {
        return params[0].concat(...params.slice(1));
    }
    throw new Error('$concat expects an array of array or string');
}

module.exports = {
    $max,
    $min,
    $sum,
    $avg,
    $first,
    $last,
    $at,
    $concat
};
