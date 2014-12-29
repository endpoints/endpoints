const extend = require('extend');

const parseOptions = require('../../lib/parse_options');

describe('parseOptions', function () {

  it('should throw if allowedFilters is defined but not an array', function () {
    expect(function () {
      parseOptions({
        allowedFilters: {}
      });
    }).to.throw('Allowed filters must be an array.');
  });

  it('should throw if allowedRelations is defined but not an array', function () {
    expect(function () {
      parseOptions({
        allowedRelations: {}
      });
    }).to.throw('Allowed relations must be an array.');
  });

  it('should return the configuration, with supplied options merged over defaults', function () {
    var config = {
      source: true,
      relationKey: 'thing'
    };
    var defaults = extend({}, parseOptions.defaults, config);
    expect(parseOptions(config)).to.deep.equal(defaults);
  });

});
