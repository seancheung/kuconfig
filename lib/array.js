/**
 * Sort the numbers in ascending order
 *
 * @param {number[]} params
 * @returns {number[]}
 */
function $asce(params) {
    if (Array.isArray(params) && params.every(p => typeof p === 'number')) {
        return params.sort((a, b) => a - b);
    }
    throw new Error('$asce expects an array of number');
}

/**
 * Sort the numbers in descending order
 *
 * @param {number[]} params
 * @returns {number[]}
 */
function $desc(params) {
    if (Array.isArray(params) && params.every(p => typeof p === 'number')) {
        return params.sort((a, b) => b - a);
    }
    throw new Error('$desc expects an array of number');
}

/**
 * Return an element at random index
 *
 * @param {any[]} params
 * @returns {any}
 */
function $rand(params) {
    if (Array.isArray(params)) {
        return params[Math.floor(Math.random() * params.length)];
    }
    throw new Error('$rand expects an array');
}

/**
 * Return the given amount of elements at random indices
 *
 * @param {[any[], number]} params
 * @returns {any[]}
 */
function $rands(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        Array.isArray(params[0]) &&
        typeof params[1] === 'number'
    ) {
        return Array(params[1])
            .fill()
            .map(() =>
                params[0].splice(
                    Math.floor(Math.random() * params[0].length),
                    1
                )
            )[0];
    }
    throw new Error(
        '$rands expects an array of two elements of which the first must be an array and the second be a number'
    );
}

/**
 * Reverse an array
 *
 * @param {any[]} params
 * @returns {any}
 */
function $reverse(params) {
    if (Array.isArray(params)) {
        return params.reverse();
    }
    throw new Error('$rev expects an array');
}

/**
 * Slice an array from the given index to an optional end index
 *
 * @param {[any[], number]|[any[], number, number]} params
 * @returns {any[]}
 */
function $slice(params) {
    if (
        Array.isArray(params) &&
        (params.length === 2 || params.length === 3) &&
        Array.isArray(params[0]) &&
        typeof params[1] === 'number' &&
        (params[2] === undefined || typeof params[2] === 'number')
    ) {
        return params[0].slice(params[1], params[2]);
    }
    throw new Error(
        '$slice expects an array of two or three elements of which the first must be an array and the second/third be a number'
    );
}

/**
 * Return the length of an array
 *
 * @param {any[]} params
 * @returns {number}
 */
function $count(params) {
    if (Array.isArray(params)) {
        return params.length;
    }
    throw new Error('$count expects an array');
}

module.exports = {
    $asce,
    $desc,
    $rand,
    $rands,
    $reverse,
    $slice,
    $count
};
