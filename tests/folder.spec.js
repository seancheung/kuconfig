const expect = require('chai').expect;

describe('folder test', function() {
    before(function() {
        process.env.CONFIG_FILE = 'tests/config/folder';
        process.env.APP_NAME = 'myapp';
    });
    it('expect config folder to be loaded correctly', function() {
        const config = require('../');
        expect(config).to.be.an('object');
        expect(config.app).to.exist;
        expect(config.app.name).to.eq('myapp');
    });
    after(function() {
        delete process.env.CONFIG_FILE;
        delete process.env.APP_NAME;
        delete require.cache[require.resolve('../')];
    });
});
