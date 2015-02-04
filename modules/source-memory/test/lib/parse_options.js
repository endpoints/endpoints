const expect = require('chai').expect;

const parseOptions = require('../../lib/parse_options');

describe('parseOptions', function () {

  it('should throw if no model is specified', function () {
    expect(function () {
      parseOptions();
    }).to.throw('No memory model specified.');
  });

});
