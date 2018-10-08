const expect = require('chai').expect;

describe('array test', function() {
    before(function() {
        process.env.CONFIG_FILE = 'tests/config/array.json';
    });
    it('expect config file to be parsed correctly ', function() {
        const config = require('../');
        expect(config).to.be.an('object');
        expect(config.asce).to.have.lengthOf(5);
        expect(config.asce[0]).to.eq(1);
        expect(config.asce[4]).to.eq(9);
        expect(config.desc).to.have.lengthOf(5);
        expect(config.desc[0]).to.eq(9);
        expect(config.desc[4]).to.eq(1);
        expect(config.rand).to.be.a('number');
        expect(config.rands).to.be.an('array');
        expect(config.reverse[0]).to.eq(3);
        expect(config.slice)
            .to.be.an('array')
            .with.lengthOf(2);
        expect(config.count).to.eq(3);
    });
    after(function() {
        delete process.env.CONFIG_FILE;
        delete require.cache[require.resolve('../')];
    });
});
