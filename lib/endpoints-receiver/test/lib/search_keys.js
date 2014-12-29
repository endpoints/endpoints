const searchKeys = require('../../lib/search_keys');

describe('searchKeys', function () {

  it('should search for a value in an object under many keys', function () {
    var keys = ['foo', 'bar', 'baz'];
    var ctx = {
      foo: { all: 'i am in foo' },
      bar: { all: 'i am in bar', inBar: 'i am only in bar' },
      baz: { all: 'i am in baz' }
    };
    expect(searchKeys(ctx, keys, 'all')).to.equal(ctx.foo.all);
    expect(searchKeys(ctx, keys, 'inBar')).to.equal(ctx.bar.inBar);
  });

});
