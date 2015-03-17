describe('v1', function () {
  require('./base-format');
  // require('./extensions');
  // require('./recommendations');

  it('must ignore request object members not recognized by the specification');

  // http://jsonapi.org/format/#document-structure-top-level
  it('must represent a logical collection of resources as an array, even if it only contains one item');
  it('must represent a logically singular resource as a single resource object');
});
