function kuconfigPlugin(opts) {
    const { name } = require('../package.json');
    const regex = new RegExp(`${name}\\/index.js(\\?\\S+)?$`)
  
    return {
        name: 'kuconfig',
        load(source) {
            if (regex.test(source)) {
                const id =
                    opts?.mode === 'envs' ? '../override' : '../index';
                return `export default ${JSON.stringify(require(id))
                    .replace(/\u2028/g, '\\u2028')
                    .replace(/\u2029/g, '\\u2029')}`;
            }
        }
    };
  }
  module.exports = kuconfigPlugin;
  kuconfigPlugin['default'] = kuconfigPlugin;
  