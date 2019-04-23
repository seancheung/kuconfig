const expect = require('chai').expect;

describe('raw test', function() {
    before(function() {
        process.env.CONFIG_FILE = 'tests/config/raw.json';
        process.env.MY_ID = '123';
    });
    it('expect raw file to be skipped without parsing ', function() {
        const config = require('../');
        expect(config).to.be.an('object');
        expect(config.$raw).to.not.exist;
        expect(config.id)
            .be.an('object')
            .with.property('$env')
            .which.is.a('string');
        const parsed = config.__.resolve(config, { name: 'Alex' });
        expect(parsed).to.be.an('object');
        expect(parsed.id).to.eq('123');
        expect(parsed.name).to.eq('Alex');
    });
    after(function() {
        delete process.env.MY_ID;
        delete process.env.CONFIG_FILE;
        delete require.cache[require.resolve('../')];
    });
});
