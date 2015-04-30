"use strict";

/*import {expect} from 'chai';

import ResponseFormatter from '../';

const Formatter = new ResponseFormatter(function (data) {
  return 'yup';
});

describe('ResponseFormatter', function () {

  describe('lib', function () {

    require('./lib/error');
    require('./lib/send');

  });

  describe('#create', function () {

    const expect = require('chai').expect;

    const create = require('../../lib/create').bind(null, function (data) {
      return data;
    });

    describe('create', function () {

      it('should return data and code 201', function () {
        var input = {
          id: '1',
          type: 'test'
        };
        var config = {
          typeName: 'thing'
        };
        var output = create(config, input);
        expect(output.code).to.equal('201');
        expect(output.data).to.deep.equal(input);
        expect(output.headers).to.deep.equal({
          location: '/' + config.typeName + '/' + input.id
        });
      });

    });


  });

  describe('#read', function () {

    it('should return data and code 200', function () {
      var input = {
        type: 'test'
      };
      var config = {
        typeName: 'thing'
      };
      var output = read(config, input);
      expect(output.code).to.equal('200');
      expect(output.data).to.deep.equal(input);
    });

    it('should return data and code 404', function () {
      var opts = {
        typeName: 'thing'
      };
      var output = read(null, opts);
      expect(output.code).to.equal('404');
      // TOOD: test this
      //expect(output.data).to.equal(null);
    });

  });

  describe('#update', function () {

    it('should return data and code 200', function () {
      var input = {
        data: {
          id: '1',
          type: 'test'
        }
      };
      var opts = {
        typeName: 'thing'
      };
      var output = update(input, opts);
      expect(output.code).to.equal('200');
      expect(output.data).to.deep.equal(input);
    });

  });

  describe('#destroy', function () {

    it('should return data and code 204', function () {
      var output = destroy({});
      expect(output.code).to.equal('204');
      expect(output.data).to.equal(null);
    });
  });

  describe('::error', function () {
    it('should accept a single error and return an object with code and data members', function() {
      var err = Kapow();
      var result = error(err);
      expect(result).to.have.property('code');
      expect(result).to.have.property('data');
      expect(result.data.errors).to.be.an('array');
    });

    it('should accept an array of errors and return an object with code and data members', function() {
      var errs = [Kapow(), Kapow(), Kapow()];
      var result = error(errs);
      expect(result).to.have.property('code');
      expect(result).to.have.property('data');
      expect(result.data.errors).to.be.an('array');
    });

    it('should set the returned code for a single error to that error\'s httpStatus', function() {
      expect(error(Kapow(404)).code).to.equal('404');
    });

    it('should default to status code 400', function() {
      expect(error().code).to.equal('400');
    });

    it('should default to the passed-in default status', function() {
      expect(error(null, 416).code).to.equal('416');
    });

    it('should set code to the httpStatus with the greatest number of errors', function() {
      var errs = [Kapow(404), Kapow(415), Kapow(416), Kapow(415), Kapow(404), Kapow(404)];
      expect(error(errs, 415).code).to.equal('404');
    });

    it('should set code for equal numbers of errors to the first status', function() {
      var errs = [Kapow(404), Kapow(415), Kapow(404), Kapow(415), Kapow(404), Kapow(415)];
      expect(error(errs, 415).code).to.equal('404');
    });
  });

});
*/