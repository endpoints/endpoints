'use strict';

var expect = require('chai').expect;

var throwIfNoModel = require('../../lib/throw_if_no_model');

describe('throwIfNoModel', function () {
  it('should throw if not passed an argument', function () {
    expect(function () {
      throwIfNoModel();
    }).to['throw'](/Unable/);
  });

  it('should throw if passed an error', function () {
    expect(function () {
      throwIfNoModel(new Error());
    }).to['throw']();
    // keep? these rely on internal implementation details
    expect(function () {
      throwIfNoModel(new Error('No rows were affected'));
    }).to['throw']();
    expect(function () {
      throwIfNoModel(new Error('Unable to locate model.'));
    }).to['throw']();
  });

  it('should not throw if passed a non-error argument', function () {
    expect(function () {
      throwIfNoModel({});
    }).to.not['throw']();
  });
});