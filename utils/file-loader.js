module.exports = function(source) {
    const utils = require('./');
    const envs = utils.env(process.env.ENV_FILE || '.env');

    return JSON.stringify(utils.resolve(JSON.parse(source), envs))
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
};
