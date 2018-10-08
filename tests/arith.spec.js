const expect = require('chai').expect;

describe('arithmetic test', function() {
    before(function() {
        process.env.CONFIG_FILE = 'tests/config/arith.json';
    });
    it('expect config file to be parsed correctly ', function() {
        const config = require('../');
        expect(config).to.be.an('object');
        expect(config.abs).to.eq(1);
        expect(config.add).to.eq(3);
        expect(config.sub).to.eq(9);
        expect(config.mul).to.eq(20);
        expect(config.div).to.eq(5);
        expect(config.mod).to.eq(4);
        expect(config.ceil).to.eq(5);
        expect(config.floor).to.eq(3);
        expect(config.round).to.eq(4);
        expect(config.trunc).to.eq(4);
        expect(config.sign).to.eq(-1);
    });
    after(function() {
        delete process.env.CONFIG_FILE;
        delete require.cache[require.resolve('../')];
    });
});
