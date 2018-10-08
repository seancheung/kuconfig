const expect = require('chai').expect;

describe('core test', function() {
    before(function() {
        process.env.CONFIG_FILE = 'tests/config/nest.json';
        process.env.PROP_KEY = 'myprop';
        process.env.ARRAY_FIRST = 1;
        process.env.CHILD_SECOND = 'second';
    });
    it('expect config file to be parsed correctly', function() {
        const config = require('../');
        expect(config).to.be.an('object');
        expect(config.prop)
            .to.have.property('key')
            .that.eqls('myprop');
        expect(config.prop)
            .to.have.property('value')
            .that.eqls(3);
        expect(config.array)
            .to.be.an('array')
            .that.includes('1');
        expect(config.child).to.eq('second');
    });
    after(function() {
        delete process.env.CONFIG_FILE;
        delete process.env.PROP_KEY;
        delete process.env.ARRAY_FIRST;
        delete process.env.CHILD_SECOND;
        delete require.cache[require.resolve('../')];
    });
});
