const extract = require('../../lib/extract');

describe('extract', function () {

  var keys = ['all', 'content', 'id', 'active', 'missing'];
  var context = {
    params: { all: 'fooInParams', id: 1 },
    body: { all: 'fooInBody', content: 'body' },
    query: { all: 'fooInQuery', active: 'true' }
  };
  var contextKeysToSearch = ['params', 'body', 'query'];

  var filters = {
    all: context.params.all,
    content: context.body.content,
    id: 1,
    active: 'true'
  };
  var normalizedfilters = {
    all: filters.all,
    content: filters.content,
    id: filters.id,
    active: true
  };

  it('should throw if no context is specified', function () {
    expect(function () {
      extract();
    }).to.throw('No context specified to read values from.');
  });

  it('should throw if no keys to find are specified', function () {
    expect(function () {
      extract({
        context: context
      });
    }).to.throw('No keys specified to find in context.');
  });

  it('should throw if no context keys are specified to find values in', function () {
    expect(function () {
      extract({
        context: context,
        find: keys
      });
    }).to.throw('No context keys specified to find values in.');
  });

  it('should throw if a normalizing function is provided that isn\'t a function', function () {
    expect(function () {
      extract({
        context: context,
        contextKeysToSearch: contextKeysToSearch,
        find: keys,
        normalizer: true
      });
    }).to.throw('Invalid normalizing function.');
  });

  it('should return an object w/ found keys and their values', function () {
     expect(extract({
       context: context,
       contextKeysToSearch: contextKeysToSearch,
       find: keys,
       locations: contextKeysToSearch
     })).to.deep.equal(filters);
  });

  it('should return an object w/ found keys and their values, normalized', function () {
    expect(extract({
      context: context,
      contextKeysToSearch: contextKeysToSearch,
      find: keys,
      normalizer: function (value) {
        if (value === 'true') {
          value = true;
        }
        return value;
      }
    })).to.deep.equal(normalizedfilters);
  });

  it('should return a single value if only one finder is specified', function () {
    expect(extract({
      context: context,
      contextKeysToSearch: contextKeysToSearch,
      find: 'active'
    })).to.deep.equal(filters.active);
  });

});
