const { name } = require('../package.json');
const RawModule = require(require.resolve('webpack/lib/RawModule', {
    paths: [process.cwd()]
}));

function resolve(source) {
    return resolver => (data, cb) => {
        const { request } = data;
        if (request === name) {
            return cb(
                null,
                new RawModule(source, `resolved|${name}`, `${name} (resolved)`)
            );
        }
        return resolver(data, cb);
    };
}

class Plugin {
    /**
     * @param {{mode?: 'merge'|'override'}} options
     */
    constructor(options) {
        let mode = (options && options.mode) || 'merge';
        if (mode !== 'merge' && mode !== 'override') {
            throw new Error(`invalid mode ${mode}`);
        }
        const config =
            mode === 'override' ? require('../env') : require('../index');
        this.source = `module.exports=${JSON.stringify(config)
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029')}`;
    }

    apply(compiler) {
        if (compiler.hooks != null) {
            compiler.hooks.normalModuleFactory.tap(name, nmf => {
                nmf.hooks.resolver.tap(name, resolve(this.source));
            });
        } else {
            compiler.plugin('normal-module-factory', nmf => {
                nmf.plugin('resolver', resolve(this.source));
            });
        }
    }
}

module.exports = Plugin;
