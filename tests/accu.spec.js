const expect = require('chai').expect;

describe('accumulator test', function() {
    before(function() {
        process.env.CONFIG_FILE = 'tests/config/accu.json';
    });
    it('expect config file to be parsed correctly ', function() {
        const config = require('../');
        expect(config).to.be.an('object');
        expect(config.max).to.eq(5);
        expect(config.min).to.eq(1);
        expect(config.sum).to.eq(15);
        expect(config.avg).to.eq(3);
        expect(config.first).to.eq(1);
        expect(config.last).to.eq(5);
        expect(config.at).to.eq(4);
        expect(config.string).to.eq('thisisatest');
        expect(config.array).to.have.lengthOf(5);
    });
    after(function() {
        delete process.env.CONFIG_FILE;
        delete require.cache[require.resolve('../')];
    });
});
