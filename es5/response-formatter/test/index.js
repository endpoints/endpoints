'use strict';

var expect = require('chai').expect;

var ResponseFormatter = require('../');

var Formatter = new ResponseFormatter(function (data) {
  return 'yup';
});

describe('ResponseFormatter', function () {

  describe('lib', function () {

    require('./lib/error');
    require('./lib/send');
  });

  describe('#create', function () {

    it('should have the instance\'s formatter partially applied', function () {
      expect(Formatter.create({}, {}).data).to.equal('yup');
    });
  });

  describe('#read', function () {

    it('should have the instance\'s formatter partially applied', function () {
      expect(Formatter.read({}, {}).data).to.equal('yup');
    });
  });

  describe('#update', function () {

    it('should have the instance\'s formatter partially applied', function () {
      expect(Formatter.update({}, {}).data).to.equal('yup');
    });
  });

  describe('#destroy', function () {

    it('should have the instance\'s formatter partially applied', function () {
      expect(Formatter.destroy({}, {}).data).to.equal(null);
    });
  });
});