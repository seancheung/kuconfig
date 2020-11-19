const expect = require('chai').expect;

describe('override mode test', function() {
    before(function() {
        process.env.NODE_ENV = 'test';
        process.env.CONFIG_FILE = 'tests/config';
    });
    it('expect env config file to be loaded correctly ', function() {
        const config = require('../override');
        expect(config).to.be.an('object');
        expect(config.app).to.be.an('object');
        expect(config.app.name).to.eq('myapp');
        expect(config.app.port).to.eq(8080);
        expect(config.app.host).to.eq('myhost');
    });
    after(function() {
        delete process.env.NODE_ENV;
        delete process.env.CONFIG_FILE;
        delete require.cache[require.resolve('../override')];
    });
});
