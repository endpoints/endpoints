const expect = require('chai').expect;

const _ = require('lodash');

const parseOptions = require('../../lib/parse_options');

describe('parseOptions', function () {

  it('should throw if no source is specified', function () {
    expect(function () {
      parseOptions();
    }).to.throw('No source specified.');
  });

  it('should return the configuration, with supplied options merged over defaults', function () {
    var config = {
      source: true,
      relationKey: 'thing',
    };
    var defaults = _.extend({}, parseOptions.defaults, config);
    expect(parseOptions(config)).to.deep.equal(defaults);
  });

});
