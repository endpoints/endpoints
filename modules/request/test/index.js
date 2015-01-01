global.expect = require('chai').expect;

const Endpoints = require('../');

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

const mockRequest = {
  params: { id: 1 },
  query: {
    title: 'foo-bar-baz',
    unSupportedKey: 'something',
    include: 'book,chapter'
  }
};
var filters = {
  id: 1,
  title: 'foo-bar-baz'
};
var relations = ['book', 'chapter'];

const Request = new Endpoints({
  source: mockSource,
  allowedFilters: ['title', 'pageCount'],
  allowedRelations: ['series', 'book', 'chapter']
});

describe('Endpoints', function () {

  require('./lib/extract');
  require('./lib/mutating_traverse');
  require('./lib/normalize_value');
  require('./lib/parse_options');
  require('./lib/search_keys');
  require('./lib/uniq');

  describe('#filters', function () {
    it('should return an array of valid filters for a given request', function () {
      expect(Request.filters(mockRequest)).to.deep.equal(filters);
    });
  });

  describe('#relations', function () {
    it('should return an array of valid relations for a given request', function () {
      expect(Request.relations(mockRequest)).to.deep.equal(relations);
    });
  });

  describe('#create', function () {

  });

  describe('#read', function () {

  });

  describe('#update', function () {

  });

  describe('#destroy', function () {

  });

});
