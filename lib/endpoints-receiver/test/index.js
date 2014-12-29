global.expect = require('chai').expect;

const EndpointsReceiver = require('../');

const Receiver = new EndpointsReceiver({
  allowedFilters: ['title', 'pageCount'],
  allowedRelations: ['series', 'book', 'chapter'],
  user: function (request) {
    return request.account;
  }
});

const mockRequest = {
  params: { id: 1 },
  query: {
    title: 'foo-bar-baz',
    unSupportedKey: 'something',
    withRelated: 'book,chapter'
  }
};
var filters = {
  id: 1,
  title: 'foo-bar-baz'
};
var relations = ['book', 'chapter'];

describe('Receiver', function () {
  
  require('./lib/extract');
  require('./lib/mutating_traverse');
  require('./lib/normalize_value');
  require('./lib/parse_options');
  require('./lib/search_keys');
  require('./lib/uniq');

  describe('#filters', function () {
    it('should return an array of valid filters for a given request', function () {
      expect(Receiver.filters(mockRequest)).to.deep.equal(filters);
    });
  });

  describe('#relations', function () {
    it('should return an array of valid relations for a given request', function () {
      expect(Receiver.relations(mockRequest)).to.deep.equal(relations);
    });
  });

});
