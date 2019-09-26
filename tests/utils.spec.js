const expect = require('chai').expect;

describe('utils test', function() {
    it('expect config utils getter to be hidden', function() {
        const config = require('../');
        expect(config.__).to.be.an('object');
        expect(config).to.have.property('__');
        expect(Object.keys(config)).to.not.include('__');
    });

    it('expect substitude to work properly', function() {
        const config = require('../');
        expect(
            config.__.substitute('My name is ${name}. I am ${age} years old.', {
                name: 'Adam',
                age: 18
            })
        ).to.eq('My name is Adam. I am 18 years old.');
        expect(
            config.__.substitute(
                'My name is ${user.name}. I will be ${user.age + 1} years old tomorrow.',
                {
                    user: {
                        name: 'Adam',
                        age: 18
                    }
                },
                true
            )
        ).to.eq('My name is Adam. I will be 19 years old tomorrow.');
    });

    after(function() {
        delete require.cache[require.resolve('../')];
    });
});
