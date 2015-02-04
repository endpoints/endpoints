const expect = require('chai').expect;

const Controller = require('../');

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

const TestController = new Controller({
  source: mockSource,
  allowedFilters: ['title', 'pageCount']
});

describe('Controller', function () {

  describe('lib', function () {
    require('./lib/extract');
    require('./lib/mutating_traverse');
    require('./lib/normalize_value');
    require('./lib/parse_options');
    require('./lib/search_keys');
    require('./lib/uniq');
    require('./lib/responder');
  });

  describe('#filters', function () {
    it('should return an array of valid filters for a given request', function () {
      expect(TestController.filters(mockRequest)).to.deep.equal(filters);
    });
  });

  describe('#relations', function () {
    it('should return an array of valid relations for a given request', function () {
      expect(TestController.relations(mockRequest)).to.deep.equal(relations);
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
