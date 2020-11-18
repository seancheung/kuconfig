let upstreamTransformer = null;

const { version } = require('react-native/package.json');
const [major, minor, patch] = version.split('.');
if (minor >= 59) {
    upstreamTransformer = require('metro-react-native-babel-transformer');
} else if (minor >= 56) {
    upstreamTransformer = require('metro/src/reactNativeTransformer');
} else if (minor >= 52) {
    upstreamTransformer = require('metro/src/transformer');
} else if (minor >= 47) {
    upstreamTransformer = require('metro-bundler/src/transformer');
} else if (minor == 46) {
    upstreamTransformer = require('metro-bundler/build/transformer');
} else {
    // handle RN <= 0.45
    const oldUpstreamTransformer = require('react-native/packager/transformer');
    upstreamTransformer = {
        transform({ src, filename, options }) {
            return oldUpstreamTransformer.transform(src, filename, options);
        }
    };
}

const { name } = require('../package.json');
const modulePath = path.resolve(
    require.resolve(name, { paths: [process.cwd()] })
);
const config = mode === 'override' ? require('../env') : require('../index');
const moduleContent = `module.exports=${JSON.stringify(config)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')}`;

module.exports.transform = function (src, filename, options) {
    if (typeof src === 'object') {
        // handle RN >= 0.46
        ({ src, filename, options } = src);
    }
    if (filename === modulePath) {
        return upstreamTransformer.transform({
            src: moduleContent,
            filename,
            options
        });
    }
    return upstreamTransformer.transform({ src, filename, options });
};
