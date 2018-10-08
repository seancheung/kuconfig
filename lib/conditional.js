/**
 * Return the second or third element based on the boolean value of the first element
 *
 * @param {[boolean, any, any]} params
 * @returns {any}
 */
function $cond(params) {
    if (
        Array.isArray(params) &&
        params.length === 3 &&
        typeof params[0] === 'boolean'
    ) {
        return params[0] ? params[1] : params[2];
    }
    throw new Error(
        '$cond expects an array of three elements of which the first must be a boolean'
    );
}

/**
 * Return true only if both two elements' boolean values are true
 *
 * @param {[boolean, boolean]} params
 * @returns {boolean}
 */
function $and(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        params.every(p => typeof p === 'boolean')
    ) {
        return params[0] && params[1];
    }
    throw new Error('$and expects an array of two booleans');
}

/**
 * Return true if any of the two elements' boolean value is true
 *
 * @param {[boolean, boolean]} params
 * @returns {boolean}
 */
function $or(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        params.every(p => typeof p === 'boolean')
    ) {
        return params[0] || params[1];
    }
    throw new Error('$or expects an array of two booleans');
}

/**
 * Return true only if the given value is false
 *
 * @param {boolean} params
 * @returns {boolean}
 */
function $not(params) {
    if (typeof params === 'boolean') {
        return !params;
    }
    throw new Error('$not expects a boolean');
}

/**
 * Return true if the given value is true or 'true'(case insensitive) or 1
 *
 * @param {boolean|string} params
 * @returns {boolean}
 */
function $true(params) {
    if (typeof params === 'boolean') {
        return params;
    }
    if (typeof params === 'number') {
        return params === 1;
    }
    if (typeof params === 'string') {
        params = params.trim();

        return params.toLowerCase() === 'true' || params === '1';
    }

    return false;
}

/**
 * Return true if the given value is null or undefined
 *
 * @param {any} params
 * @returns {boolean}
 */
function $null(params) {
    return params == null;
}

/**
 * Return true only if the given value is undefined
 *
 * @param {any} params
 * @returns {boolean}
 */
function $undefined(params) {
    return params === undefined;
}

/**
 * Return true only if the given value is of the given type
 *
 * @param {[any, string]} params
 * @returns {boolean}
 */
function $type(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        typeof params[1] === 'string'
    ) {
        return typeof params[0] === params[1];
    }
    throw new Error(
        '$type expects an array of two elements while the second being a string'
    );
}

/**
 * Return boolean test result(!!) of the given value
 *
 * @param {any} params
 * @returns {boolean}
 */
function $test(params) {
    return !!params;
}

module.exports = {
    $cond,
    $and,
    $or,
    $not,
    $true,
    $null,
    $undefined,
    $type,
    $test
};
