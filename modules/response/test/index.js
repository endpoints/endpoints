const expect = require('chai').expect;

const Responder = require('../');

const TestResponder = new Responder({}, function (data) {
  return 'yup';
});

describe('Responder', function () {

  describe('lib', function () {

    require('./lib/error');
    require('./lib/send');

  });

  describe('#create', function () {

    it('should have the instance\'s formatter partially applied', function () {
      expect(TestResponder.create({}, {}).data).to.equal('yup');
    });

  });

  describe('#read', function () {

    it('should have the instance\'s formatter partially applied', function () {
      expect(TestResponder.read({}, {}).data).to.equal('yup');
    });

  });

  describe('#update', function () {

    it('should have the instance\'s formatter partially applied', function () {
      expect(TestResponder.update({}, {}).data).to.equal('yup');
    });

  });

  describe('#destroy', function () {

    it('should have the instance\'s formatter partially applied', function () {
      expect(TestResponder.destroy({}, {}).data).to.equal(null);
    });

  });

});
