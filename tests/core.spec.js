const expect = require('chai').expect;
const path = require('path');

describe('core test', function() {
    before(function() {
        process.env.CONFIG_FILE = 'tests/config/core.json';
        process.env.APP_NAME = 'myapp';
    });
    it('expect config file to be parsed correctly', function() {
        const config = require('../');
        expect(config).to.be.an('object');
        expect(config.env).to.eq('myapp');
        expect(path.relative(process.cwd(), config.path)).to.eq(
            path.normalize('storage/content')
        );
        expect(config.file).to.eq('this is a test');
        expect(config.json)
            .to.be.an('object')
            .with.property('count')
            .that.is.a('number');
        expect(config.number).to.eq(1);
        expect(config.number2).to.eq(2);
        expect(config.number3).to.be.null;
        expect(config.__.desolve);
    });
    after(function() {
        delete process.env.CONFIG_FILE;
        delete process.env.APP_NAME;
        delete require.cache[require.resolve('../')];
    });
});
