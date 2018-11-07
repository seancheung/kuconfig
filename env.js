/*eslint no-console: off */
const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const envs = utils.env(process.env.ENV_FILE || '.env', process.env.ENV_INJECT);
let dirname = process.env.CONFIG_FILE || envs.CONFIG_FILE;
if (!dirname) {
    dirname = path.resolve(process.cwd(), 'config');
} else if (!path.isAbsolute(dirname)) {
    dirname = path.resolve(process.cwd(), dirname);
}

let config;
if (!fs.existsSync(dirname) || !fs.lstatSync(dirname).isDirectory()) {
    console.warn('config directory not found at path "%s"', dirname);
    config = {};
} else {
    const env = process.env.NODE_ENV || 'development';
    const basefile = path.join(dirname, 'default.json');
    const envfile = path.join(dirname, env + '.json');
    if (fs.existsSync(basefile)) {
        config = utils.load(basefile, envs);
    }
    if (fs.existsSync(envfile)) {
        const envconfig = utils.load(envfile, envs);
        if (config) {
            config = utils.merge(config, envconfig);
        } else {
            config = envconfig;
        }
    }
    if (!config) {
        console.warn(
            'no configs loaded with env "%s" at path "%s"',
            env,
            dirname
        );
        config = {};
    }
}

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
