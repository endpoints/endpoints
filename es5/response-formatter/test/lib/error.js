'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _Kapow = require('kapow');

var _Kapow2 = _interopRequireWildcard(_Kapow);

var _expect = require('chai');

var _error = require('../../lib/error');

var _error2 = _interopRequireWildcard(_error);

describe('error', function () {

  it('should accept a single error and return an object with code and data members', function () {
    var err = _Kapow2['default']();
    var result = _error2['default'](err);
    _expect.expect(result).to.have.property('code');
    _expect.expect(result).to.have.property('data');
    _expect.expect(result.data.errors).to.be.an('array');
  });

  it('should accept an array of errors and return an object with code and data members', function () {
    var errs = [_Kapow2['default'](), _Kapow2['default'](), _Kapow2['default']()];
    var result = _error2['default'](errs);
    _expect.expect(result).to.have.property('code');
    _expect.expect(result).to.have.property('data');
    _expect.expect(result.data.errors).to.be.an('array');
  });

  it('should set the returned code for a single error to that error\'s httpStatus', function () {
    _expect.expect(_error2['default'](_Kapow2['default'](404)).code).to.equal('404');
  });

  it('should default to status code 400', function () {
    _expect.expect(_error2['default']().code).to.equal('400');
  });

  it('should default to the passed-in default status', function () {
    _expect.expect(_error2['default'](null, 416).code).to.equal('416');
  });

  it('should set code to the httpStatus with the greatest number of errors', function () {
    var errs = [_Kapow2['default'](404), _Kapow2['default'](415), _Kapow2['default'](416), _Kapow2['default'](415), _Kapow2['default'](404), _Kapow2['default'](404)];
    _expect.expect(_error2['default'](errs, 415).code).to.equal('404');
  });

  it('should set code for equal numbers of errors to the first status', function () {
    var errs = [_Kapow2['default'](404), _Kapow2['default'](415), _Kapow2['default'](404), _Kapow2['default'](415), _Kapow2['default'](404), _Kapow2['default'](415)];
    _expect.expect(_error2['default'](errs, 415).code).to.equal('404');
  });
});