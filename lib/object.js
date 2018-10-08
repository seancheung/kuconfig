/**
 * Return the merge of two objects
 *
 * @param {[any, any]} params
 * @returns {any}
 */
function $merge(params, fn) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        params.every(p => typeof p === 'object')
    ) {
        return fn.merge(params[0], params[1]);
    }
    throw new Error('$merge expects an array of two objects');
}

/**
 * Return the keys of an object
 *
 * @param {any} params
 * @returns {string[]}
 */
function $keys(params) {
    if (params != null && typeof params === 'object') {
        return Object.keys(params);
    }
    throw new Error('$keys expects object');
}

/**
 * Return the values of an object
 *
 * @param {any} params
 * @returns {any[]}
 */
function $vals(params) {
    if (params != null && typeof params === 'object') {
        return Object.keys(params).map(k => params[k]);
    }
    throw new Error('$vals expects object');
}

/**
 * Merge a series of key-value pairs into an object
 *
 * @param {[any, any][]} params
 * @returns {any}
 */
function $zip(params) {
    if (
        Array.isArray(params) &&
        params.every(p => Array.isArray(p) && p.length === 2)
    ) {
        return params.reduce((o, p) => Object.assign(o, { [p[0]]: p[1] }), {});
    }
    throw new Error('$zip expects an array of two-element-array');
}

/**
 * Split an object into key-value pairs
 *
 * @param {any} params
 * @returns {[any, any][]}
 */
function $zap(params) {
    if (params != null && typeof params === 'object') {
        return Object.keys(params).map(k => [k, params[k]]);
    }
    throw new Error('$zap expects object');
}

module.exports = {
    $merge,
    $keys,
    $vals,
    $zip,
    $zap
};
