const extend = require('extend');

const parseOptions = require('../../lib/parse_options');

const mockSource = {
  filters: function () {
    return {
      filter: 'value'
    };
  },
  relations: function () {
    return {
      relation: 'value'
    };
  }
};

describe('parseOptions', function () {

  it('should throw if no source is specified', function () {
    expect(function () {
      parseOptions();
    }).to.throw('No source specified.');
  });

  it('should infer allowedFilters from the source if none are explicitly provided', function () {
    expect(parseOptions({
      source: mockSource
    }).allowedFilters).to.deep.equal(Object.keys(mockSource.filters()));
  });

  it('should infer allowedRelations from the source if none are explicitly provided', function () {
    expect(parseOptions({
      source: mockSource
    }).allowedRelations).to.deep.equal(Object.keys(mockSource.relations()));
  });

  it('should throw if allowedFilters is defined but not an array', function () {
    expect(function () {
      parseOptions({
        source: mockSource,
        allowedFilters: {}
      });
    }).to.throw('Allowed filters must be an array.');
  });

  it('should throw if allowedRelations is defined but not an array', function () {
    expect(function () {
      parseOptions({
        source: mockSource,
        allowedRelations: {}
      });
    }).to.throw('Allowed relations must be an array.');
  });


  it('should return the configuration, with supplied options merged over defaults', function () {
    var config = {
      source: true,
      relationKey: 'thing',
      allowedFilters: ['foo'],
      allowedRelations: ['bar']
    };
    var defaults = extend({}, parseOptions.defaults, config);
    expect(parseOptions(config)).to.deep.equal(defaults);
  });

});
