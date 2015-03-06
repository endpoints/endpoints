const expect = require('chai').expect;

const BookshelfSource = require('../../source-bookshelf');
const BooksModel = require('../../../test/fixtures/models/books');
const BooksSource = new BookshelfSource({
  model: BooksModel
});
const DB = require('../../../test/fixtures/classes/database');

const formatter = require('../');

describe('formatter-jsonapi', function () {

  describe('lib', function () {
    require('./lib/link');
    require('./lib/relate');
    require('./lib/to_one_relations');
    require('./lib/format_model');
  });

  var opts;

  beforeEach(function () {
    opts = {};
    return DB.reset();
  });

  it('should accept a model and return an object', function(done) {
    BooksSource.create('create', {
      author_id:1,
      title: 'test book',
      date_published: '2015-02-01'
    }).then(function(book) {
      expect(formatter(book, opts)).to.be.an('object');
      done();
    });
  });

  it('should accept a collection and return an object', function(done) {
    BooksSource.read().then(function(books) {
      expect(books).to.have.property('length');
      expect(formatter(books, opts)).to.be.an('object');
      done();
    });
  });

  it('should accept a single-item collection and return an object', function(done) {
    opts.singleResult = true;
    BooksSource.read().then(function(books) {
      var coll = BooksModel.collection([books.at(0)]);
      expect(coll.length).to.equal(1);
      expect(formatter(coll, opts)).to.be.an('object');
      done();
    });
  });

});
