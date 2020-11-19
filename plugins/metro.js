const path = require('path');

let upstreamTransformer = null;
const _require = file =>
    require(require.resolve(file, { paths: [process.cwd()] }));

const { version } = _require('react-native/package.json');
const [major, minor, patch] = version.split('.');
if (minor >= 59) {
    upstreamTransformer = _require('metro-react-native-babel-transformer');
} else if (minor >= 56) {
    upstreamTransformer = _require('metro/src/reactNativeTransformer');
} else if (minor >= 52) {
    upstreamTransformer = _require('metro/src/transformer');
} else if (minor >= 47) {
    upstreamTransformer = _require('metro-bundler/src/transformer');
} else if (minor == 46) {
    upstreamTransformer = _require('metro-bundler/build/transformer');
} else {
    // handle RN <= 0.45
    const oldUpstreamTransformer = _require(
        'react-native/packager/transformer'
    );
    upstreamTransformer = {
        transform({ src, filename, options }) {
            return oldUpstreamTransformer.transform(src, filename, options);
        }
    };
}

const { name } = require('../package.json');
const defaultPath = path.relative(
    process.cwd(),
    require.resolve(name, { paths: [process.cwd()] })
);
const overridePath = path.relative(
    process.cwd(),
    require.resolve(name + '/override', { paths: [process.cwd()] })
);

module.exports.transform = function (src, filename, options) {
    if (typeof src === 'object') {
        // handle RN >= 0.46
        ({ src, filename, options } = src);
    }
    let config, override;
    if (filename === defaultPath) {
        if (!config) {
            config = `module.exports=${JSON.stringify(require('../index'))
                .replace(/\u2028/g, '\\u2028')
                .replace(/\u2029/g, '\\u2029')}`;
        }
        return upstreamTransformer.transform({
            src: config,
            filename,
            options
        });
    } else if (filename === overridePath) {
        if (!override) {
            override = `module.exports=${JSON.stringify(require('../override'))
                .replace(/\u2028/g, '\\u2028')
                .replace(/\u2029/g, '\\u2029')}`;
        }
        return upstreamTransformer.transform({
            src: override,
            filename,
            options
        });
    }
    return upstreamTransformer.transform({ src, filename, options });
};
