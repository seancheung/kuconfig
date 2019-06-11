const expect = require('chai').expect;

describe('string test', function() {
    before(function() {
        process.env.CONFIG_FILE = 'tests/config/string.json';
        process.env.ENV_FILE = 'tests/config/env.string';
    });
    it('expect config file to be parsed correctly ', function() {
        const config = require('../');
        expect(config).to.be.an('object');
        expect(config.upper).to.eq('TOUPPERCASE');
        expect(config.lower).to.eq('tolowercase');
        expect(config.split1).to.eql(['a', 'b', 'c']);
        expect(config.split2).to.eql(['a', 'b', 'c']);
        expect(config.split3).to.eql(['a', 'b']);
        expect(config.expand1).to.eql('Tom is very good');
        expect(config.expand2).to.eql('Tom and ${expandvar2} are very good');
    });
    after(function() {
        delete process.env.CONFIG_FILE;
        delete process.env.ENV_FILE;
        delete require.cache[require.resolve('../')];
    });
});
