const fs = require('fs');
const path = require('path');
const fsx = require('./fs');

const dir = path.join(__dirname, '../lib');
const fn = {};
fs.readdirSync(dir)
    .filter(f => /.js$/.test(f))
    .forEach(filename => {
        const file = path.join(dir, filename);
        const mod = require(file);
        if (mod && typeof mod === 'object') {
            Object.assign(fn, mod);
        }
    });
fn.resolve = resolve.bind(null, fn);
fn.substitute = substitute;

/**
 * Deep clone an object
 *
 * @param {any} source
 * @returns {any}
 */
function clone(source) {
    return source != null ? JSON.parse(JSON.stringify(source)) : source;
}

/**
 * Make clones of two objects then merge the second one into the first one and returns the merged object
 *
 * @param {any} source
 * @param {any} target
 * @returns {any}
 */
function merge(source, target) {
    if (target == null) {
        return clone(source);
    }
    if (source == null) {
        return clone(target);
    }
    if (typeof source !== 'object' || typeof target !== 'object') {
        return clone(target);
    }
    const merge = (source, target) => {
        Object.keys(target).forEach(key => {
            if (source[key] == null) {
                source[key] = target[key];
            } else if (typeof source[key] === 'object') {
                if (typeof target[key] === 'object') {
                    merge(source[key], target[key]);
                } else {
                    source[key] = target[key];
                }
            } else {
                source[key] = target[key];
            }
        });

        return source;
    };

    return merge(clone(source), clone(target));
}

/**
 * Read envs from file path
 *
 * @param {string} file
 * @param {boolean} [inject]
 * @returns {{[x: string]: string}}
 */
function env(file, inject) {
    const envs = {};
    if (!path.isAbsolute(file)) {
        file = path.resolve(process.cwd(), file);
    }
    if (!fsx.isFile(file)) {
        return envs;
    }
    const content = fs.readFileSync(file, 'utf8');
    content.split('\n').forEach(line => {
        const kv = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (kv) {
            const k = kv[1];
            let v = kv[2] || '';
            if (
                v &&
                v.length > 0 &&
                v.charAt(0) === '"' &&
                v.charAt(v.length - 1) === '"'
            ) {
                v = v.replace(/\\n/gm, '\n');
            }
            v = v.replace(/(^['"]|['"]$)/g, '').trim();
            envs[k] = v;
        }
    });

    if (inject) {
        Object.keys(envs).forEach(k => {
            if (!(k in process.env)) {
                process.env[k] = envs[k];
            }
        });
    }

    return envs;
}

function resolve(fn, source, envs) {
    if (source == null) {
        return source;
    }
    if (typeof source !== 'object') {
        return source;
    }
    if (source['$raw']) {
        delete source['$raw'];
        return source;
    }
    for (const key of Object.keys(source)) {
        let value = resolve(fn, source[key], envs);
        if (key in fn) {
            value = fn[key].call(null, value, fn, envs);

            return value;
        }
        source[key] = value;
    }

    return source;
}

/**
 * Expand variables as in shellscript
 *
 * @param {string} src
 * @param {{[x: string]: any}} envs
 * @param {boolean} deep
 * @returns {string}
 */
function substitute(src, envs, deep) {
    if (src == null) {
        return src;
    }
    let res = src.replace(/\$\{((?:[^{}\\]|\\.)+)\}/g, (t, cap) =>
        cap in envs ? envs[cap] : t
    );
    if (deep) {
        const vm = require('vm');
        const ctx = vm.createContext(envs, {
            codeGeneration: {
                strings: false,
                wasm: false
            }
        });
        res = src.replace(/\$\{((?:[^{}\\]|\\.)+)\}/g, (t, cap) => {
            try {
                return vm.runInNewContext(cap, ctx);
            } catch (error) {
                return `<Error parsing "${cap}": ${error.message}>`;
            }
        });
    }
    return res;
}

/**
 * Load config
 *
 * @param {string} filename
 * @param {{[x: string]: string}} [envs]
 * @returns {any}
 */
function load(filename, envs) {
    const config = {};
    if (!path.isAbsolute(filename)) {
        filename = path.resolve(process.cwd(), filename);
    }
    if (fsx.isFile(filename)) {
        if (/.json$/.test(filename)) {
            const content = fs.readFileSync(filename, 'utf8');
            Object.assign(config, fn.resolve(JSON.parse(content), envs));
        }
    } else if (fsx.isDirectory(filename)) {
        const files = fs
            .readdirSync(filename)
            .filter(
                f => fsx.isFile(path.resolve(filename, f)) && /.json$/.test(f)
            );
        files.forEach(file => {
            const content = fs.readFileSync(
                path.resolve(filename, file),
                'utf8'
            );
            const basename = path.basename(file, path.extname(file));
            Object.assign(config, {
                [basename]: fn.resolve(JSON.parse(content), envs)
            });
        });
    }

    return config;
}

module.exports = {
    /**
     * Deep clone an object
     */
    clone,

    /**
     * Make clones of two objects then merge the second one into the first one and returns the merged object
     */
    merge,

    /**
     * Read envs from file path
     */
    env,

    /**
     * Resolve source
     *
     * @type {(source: any, envs?: {[x: string]: string})=>any}
     */
    resolve: fn.resolve,

    /**
     * Load config
     */
    load,

    /**
     * Parser
     */
    parse: resolve,

    /**
     * Expand variables as in shellscript
     */
    substitute
};
