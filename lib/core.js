/**
 * Get value from environment variables with an optional fallback value
 *
 * @param {string|[string, any]} params
 * @returns {any}
 */
function $env(params, fn, envs) {
    if (params == null) {
        return params;
    }
    if (typeof params === 'string') {
        if (process.env[params] !== undefined) {
            return process.env[params];
        }
        if (envs && envs[params] !== undefined) {
            return envs[params];
        }

        return;
    }
    if (Array.isArray(params) && params.length === 2) {
        const key = params[0];
        if (typeof key === 'string') {
            const value = fn.$env(key, fn, envs);

            return value === undefined ? params[1] : value;
        }
    }
    throw new Error(
        '$env expects a string or an array with two elements of which the first one must be a string'
    );
}

/**
 * Resolve the path to absolute from current working directory
 *
 * @param {string} params
 * @returns {string}
 */
function $path(params) {
    if (params == null) {
        return params;
    }
    if (typeof params === 'string') {
        const path = require('path');
        if (path.isAbsolute(params)) {
            return params;
        }

        return path.resolve(process.cwd(), params);
    }
    throw new Error('$path expects a string');
}

/**
 * Resolve the path and read the file with an optional encoding
 *
 * @param {string|[string, string]} params
 * @returns {string|Buffer}
 */
function $file(params, fn) {
    if (params == null) {
        return params;
    }
    let file, encoding;
    if (typeof params === 'string') {
        file = params;
    } else if (Array.isArray(params) && params.length === 2) {
        file = params[0];
        encoding = params[1];
    }
    if (
        typeof file === 'string' &&
        (encoding === undefined || typeof encoding === 'string')
    ) {
        file = fn.$path(file);
        const fs = require('fs');
        if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
            return fs.readFileSync(file, { encoding });
        }
    }
    throw new Error(
        '$file expects a string or an array with two string elements'
    );
}

/**
 * Parse the given string into object
 *
 * @param {string} params
 * @returns {any}
 */
function $json(params) {
    if (params == null) {
        return params;
    }
    if (typeof params === 'string') {
        return JSON.parse(params);
    }
    throw new Error('$json expects a string');
}

/**
 * Parse the given string into a number
 *
 * @param {string} params
 * @returns {number}
 */
function $number(params) {
    if (params == null) {
        return params;
    }
    if (typeof params === 'number') {
        return params;
    }
    if (typeof params === 'string') {
        return Number(params);
    }
    throw new Error('$number expects a number or string');
}

module.exports = {
    $env,
    $path,
    $file,
    $json,
    $number
};
