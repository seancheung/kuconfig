const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const envs = utils.env(process.env.ENV_FILE || '.env', process.env.ENV_INJECT);
let filename = process.env.CONFIG_FILE;
if (!filename) {
    filename = path.resolve(process.cwd(), 'config');
    if (!fs.existsSync(filename) || !fs.lstatSync(filename).isDirectory()) {
        filename = path.resolve(process.cwd(), 'config.json');
    }
} else if (!path.isAbsolute(filename)) {
    filename = path.resolve(process.cwd(), filename);
}

const config = utils.load(filename, envs);

const __ = Object.assign(
    { desolve: () => delete require.cache[__filename] },
    utils
);

Object.defineProperty(config, '__', {
    configurable: false,
    enumerable: false,
    get() {
        return __;
    }
});

module.exports = config;
