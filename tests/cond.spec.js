const expect = require('chai').expect;

describe('conditional test', function() {
    before(function() {
        process.env.CONFIG_FILE = 'tests/config/cond.json';
    });
    it('expect config file to be parsed correctly ', function() {
        const config = require('../');
        expect(config).to.be.an('object');
        expect(config.cond).to.eq(2);
        expect(config.and).to.be.false;
        expect(config.or).to.be.true;
        expect(config.not).to.be.false;
    });
    after(function() {
        delete process.env.CONFIG_FILE;
        delete require.cache[require.resolve('../')];
    });
});
