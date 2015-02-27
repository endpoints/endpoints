const expect = require('chai').expect;

const BookshelfSource = require('../../../../source-bookshelf');
const BooksModel = require('../../../../../test/fixtures/models/books');
const BooksSource = new BookshelfSource({
  model: BooksModel
});
const DB = require('../../../../../test/fixtures/classes/database');

const create = require('../../../lib/payloads/create');

describe('create', function () {

  beforeEach(function () {
    return DB.reset();
  });

  it('should return scoped data and code 201 when there are no errors', function (done) {
    // We're passing everything through the formatter now. That requires
    // a Bookshelf model.
    BooksSource.create('create', {
      author_id:1,
      title: 'test book',
      date_published: '2015-02-01'
    }).then(function(book) {
      var result = create(null, book, {typeName:BooksSource.typeName()});
      var flatBook = book.toJSON();
      expect(result.code).to.equal(201);
      expect(result.data.data.id).to.equal(String(flatBook.id));
      expect(result.data.data.title).to.equal(flatBook.title);
      expect(result.data.data.type).to.equal(BooksSource.typeName());
      expect(result.data.data.date_published).to.equal(flatBook.date_published);
      done();
    });
  });

  it('should return errors and default to code 422 when there is an error', function () {
    var errMsg = 'Create error.';
    var data = {
      errors: {
        title: 'Unprocessable Entity',
        detail: errMsg
      }
    };
    var result = create(new Error(errMsg));
    expect(result.code).to.equal(422);
    expect(result.data).to.deep.equal(data);
  });

  it('should return specific status codes when included as an error property', function() {
    var err = new Error('404 Error');
    err.httpStatus = 404;
    var result = create(err);
    expect(result.code).to.equal(404);
  });

});
