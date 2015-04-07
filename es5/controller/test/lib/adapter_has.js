'use strict';

var expect = require('chai').expect;

var adapterHas = require('../../lib/adapter_has');

describe('adapterHas', function () {
  it('should return undefined if there "request" argument', function () {
    expect(adapterHas([1], null, 'number')).to.be.undefined;
  });

  it('should return an empty array if the members of the requested array is in the array', function () {
    expect(adapterHas([1], [1], 'number')).to.be.an('array');
  });

  it('should return null if the requested item is an existing object property', function () {
    expect(adapterHas({ '1': 'a' }, '1', 'property')).to.be['null'];
  });

  it('should return an error message if the requested item is not in the array', function () {
    expect(adapterHas([1], [2], 'number')).to.match(/Model does not have/);
    expect(adapterHas({ '1': 'a' }, '2', 'property')).to.match(/Model does not have/);
  });
});