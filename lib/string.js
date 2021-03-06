/**
 * Transform input string to upper case
 *
 * @param {string} params
 * @returns {string}
 */
function $upper(params) {
    if (params == null) {
        return params;
    }
    if (typeof params === 'string') {
        return params.toUpperCase();
    }
    throw new Error('$upper expects a string');
}

/**
 * Transform input string to lower case
 *
 * @param {string} params
 * @returns {string}
 */
function $lower(params) {
    if (params == null) {
        return params;
    }
    if (typeof params === 'string') {
        return params.toLowerCase();
    }
    throw new Error('$lower expects a string');
}

/**
 * Split input string into an array
 *
 * @param {string|[string, string]|[string, string, number]} params
 * @returns {number[]}
 */
function $split(params) {
    if (typeof params === 'string') {
        return params.split(/\s+/);
    }
    if (
        Array.isArray(params) &&
        (params.length === 2 || params.length === 3) &&
        typeof params[0] === 'string' &&
        typeof params[1] === 'string' &&
        (params[3] == null || typeof params[3] === 'number')
    ) {
        return params[0].split(params[1], params[2]);
    }
    throw new Error(
        '$split expects an array of two string elements with an additional number element'
    );
}

/**
 * Expand variables as in shellscript
 *
 * @param {string} params
 * @returns {string}
 */
function $expand(params, fn, envs) {
    if (params == null) {
        return params;
    }
    if (typeof params === 'string') {
        return fn.substitute(params, envs);
    }
    throw new Error('$expand expects a string');
}

/**
 * Transform string to regex with optional flags
 *
 * @param {string|[string, string]} params
 * @returns {RegExp}
 */
function $regex(params) {
    if (params == null) {
        return params;
    }
    if (typeof params === 'string') {
        return new RegExp(params);
    }
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        typeof params[0] === 'string' &&
        typeof params[1] === 'string'
    ) {
        return new RegExp(params[0], params[1]);
    }
    throw new Error(
        '$lower expects a string or an array of two string elements'
    );
}

module.exports = {
    $upper,
    $lower,
    $split,
    $expand,
    $regex
};
