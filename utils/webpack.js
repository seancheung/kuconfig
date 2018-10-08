const path = require('path');
const fs = require('fs');

module.exports = class Plugin {

    constructor(options) {
        let filename = options && options.filename;
        if (!filename) {
            throw new Error('filename is missing');
        }
        if (!path.isAbsolute(filename)) {
            filename = path.resolve(process.cwd(), filename);
        }
        if (!fs.existsSync(filename)) {
            throw new Error(`${filename} does not exist`);
        }
        this.filename = filename;
    }

    apply(compiler) {
        compiler.plugin('normal-module-factory', nmf => {
            nmf.plugin('after-resolve', (data, done) => {
                let name = data.resource.split('?')[0];
                name = name.normalize ? name.normalize('NFC') : name;
                if (this.filename === name) {
                    let loader;
                    if (data.loaders.length === 0) {
                        loader = 'json-loader.js';
                    } else {
                        loader = 'file-loader.js';
                    }
                    data.loaders.push({ loader: path.resolve(__dirname, loader) });
                }
                done(null, data);
            });
        });
    }

};
