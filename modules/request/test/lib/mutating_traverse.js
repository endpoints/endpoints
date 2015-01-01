const mutatingTraverse = require('../../lib/mutating_traverse');

describe('mutatingTraverse', function () {

  var from = {
    foo: 'foo',
    bar: 'bar',
    nested: {
      baz: 'baz',
    }
  };
  var to = {
    foo: 'FOO',
    bar: 'BAR',
    nested: {
      baz: 'BAZ'
    }
  };

  it('should traverse an object, mutating its values with a provided function', function () {
    expect(mutatingTraverse(from, function (value) {
      if (typeof value === 'string') {
        value = value.toUpperCase();
      }
      return value;
    })).to.deep.equal(to);
  });

});
