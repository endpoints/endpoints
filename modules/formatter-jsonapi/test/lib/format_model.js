const expect = require('chai').expect;

const BookshelfSource = require('../../../source-bookshelf');
const BooksModel = require('../../../../test/fixtures/models/books');
const BooksSource = new BookshelfSource({
  model: BooksModel
});
const DB = require('../../../../test/fixtures/classes/database');

const formatModel = require('../../lib/format_model');

describe('formatModel', function () {

  beforeEach(function () {
    return DB.reset();
  });

  it('should return an array scoped to "data" when there are no errors', function (done) {
    var opts = {
      typeName: 'type'
    };
    // We're passing everything through the formatter now. That requires
    // a Bookshelf model.
    BooksSource.create({
      author_id:1,
      title: 'test book',
      date_published: '2015-02-01'
    }, {method: 'create'}, function(err, book) {
      var seed = {linked:{}};
      var formatted = formatModel(seed, book, opts);
      var flatBook = book.toJSON();
      expect(seed.data).to.be.an('Array');
      expect(seed.data[0].id).to.equal(String(flatBook.id));
      expect(seed.data[0].title).to.equal(flatBook.title);
      expect(seed.data[0].type).to.equal('type');
      expect(seed.data[0].date_published).to.equal(flatBook.date_published);
      expect(seed).to.eql(formatted);
      done();
    });
  });
});
