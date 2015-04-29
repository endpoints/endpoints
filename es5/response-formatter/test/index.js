'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _ResponseFormatter = require('../');

var _ResponseFormatter2 = _interopRequireDefault(_ResponseFormatter);

var Formatter = new _ResponseFormatter2['default'](function (data) {
  return 'yup';
});

describe('ResponseFormatter', function () {

  describe('lib', function () {

    require('./lib/error');
    require('./lib/send');
  });

  describe('#create', function () {

    it('should have the instance\'s formatter partially applied', function () {
      _expect.expect(Formatter.create({}, {}).data).to.equal('yup');
    });
  });

  describe('#read', function () {

    it('should have the instance\'s formatter partially applied', function () {
      _expect.expect(Formatter.read({}, {}).data).to.equal('yup');
    });
  });

  describe('#update', function () {

    it('should have the instance\'s formatter partially applied', function () {
      _expect.expect(Formatter.update({}, {}).data).to.equal('yup');
    });
  });

  describe('#destroy', function () {

    it('should have the instance\'s formatter partially applied', function () {
      _expect.expect(Formatter.destroy({}, {}).data).to.equal(null);
    });
  });
});