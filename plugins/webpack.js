const { name } = require('../package.json');
const RawModule = require(require.resolve('webpack/lib/RawModule', {
    paths: [process.cwd()]
}));

function resolve(ctx) {
    let config;
    return resolver => (data, cb) => {
        const { request } = data;
        if (request === name) {
            if (!config) {
                config = ctx.getConfig();
            }
            return cb(
                null,
                new RawModule(config, `resolved|${name}`, `${name} (resolved)`)
            );
        }
        return resolver(data, cb);
    };
}

class Plugin {
    constructor(opts) {
        this.opts = opts;
    }
    getConfig() {
        const id = this.opts?.mode === 'envs' ? '../override' : '../index';
        return `module.exports=${JSON.stringify(id)
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029')}`;
    }

    apply(compiler) {
        if (compiler.hooks != null) {
            compiler.hooks.normalModuleFactory.tap(name, nmf => {
                nmf.hooks.resolver.tap(name, resolve(this));
            });
        } else {
            compiler.plugin('normal-module-factory', nmf => {
                nmf.plugin('resolver', resolve(this));
            });
        }
    }
}

module.exports = Plugin;
