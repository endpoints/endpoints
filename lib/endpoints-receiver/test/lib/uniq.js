const uniq = require('../../lib/uniq');

describe('uniq', function () {

  var arrWithDups = ['foo', 'bar', 'baz', 'baz', 'foo'];
  var origArrWithDups = arrWithDups.slice();
  var arrUnique = ['foo', 'bar', 'baz'];

  it('should return a copy of an array with duplicates removed', function () {
    expect(uniq(arrWithDups)).to.deep.equal(arrUnique);
    expect(arrWithDups).to.deep.equal(origArrWithDups);
  });

});
