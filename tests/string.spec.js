const expect = require('chai').expect;

describe('string test', function() {
    before(function() {
        process.env.CONFIG_FILE = 'tests/config/string.json';
    });
    it('expect config file to be parsed correctly ', function() {
        const config = require('../');
        expect(config).to.be.an('object');
        expect(config.upper).to.eq('TOUPPERCASE');
        expect(config.lower).to.eq('tolowercase');
        expect(config.split1).to.eql(['a', 'b', 'c']);
        expect(config.split2).to.eql(['a', 'b', 'c']);
        expect(config.split3).to.eql(['a', 'b']);
    });
    after(function() {
        delete process.env.CONFIG_FILE;
        delete require.cache[require.resolve('../')];
    });
});
