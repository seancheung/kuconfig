const fs = require('fs');

function isFile(file) {
    if (!fs.existsSync(file)) {
        return false;
    }
    let stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) {
        stat = fs.lstatSync(fs.realpathSync(file));
    }
    return stat.isFile();
}

function isDirectory(file) {
    if (!fs.existsSync(file)) {
        return false;
    }
    let stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) {
        stat = fs.lstatSync(fs.realpathSync(file));
    }
    return stat.isDirectory();
}

module.exports = {
    isFile,
    isDirectory
};
