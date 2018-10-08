const expect = require('chai').expect;

describe('env test', function() {
    before(function() {
        process.env.ENV_FILE = 'tests/config/env';
        process.env.ENV_INJECT = true;
    });
    it('expect .env file to be applied correctly', function() {
        const config = require('../');
        expect(config).to.be.an('object');
        expect(config.name).to.eq('myapp');
        expect(config.comment).to.be.undefined;
    });
    after(function() {
        delete process.env.ENV_INJECT;
        delete process.env.ENV_FILE;
        delete process.env.CONFIG_FILE;
        delete process.env.APP_NAME;
        delete require.cache[require.resolve('../')];
    });
});
