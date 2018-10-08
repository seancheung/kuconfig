const expect = require('chai').expect;

describe('core test', function() {
    it('expect config utils getter to be hidden', function() {
        const config = require('../');
        expect(config.__).to.be.an('object');
        expect(config).to.have.property('__');
        expect(Object.keys(config)).to.not.include('__');
    });
    after(function() {
        delete require.cache[require.resolve('../')];
    });
});
