import {expect} from 'chai';

import BookshelfAdapter from '../../adapter-bookshelf';
import BooksModel from '../../../test/app/src/modules/books/model';
import Fixture from '../../../test/app/fixture';

import formatter from '../';

const Books = new BookshelfAdapter({
  model: BooksModel
});

describe('formatter-jsonapi', () => {

  describe('lib', () => {
    require('./lib/link');
    require('./lib/relate');
    require('./lib/to_one_relations');
    require('./lib/format_model');
  });

  var opts;

  before(() => {
    return Fixture.reset();
  });

  beforeEach(() => {
    opts = {};
  });

  it('should accept a model and return an object', () => {
    return Books.create('create', {
      author_id:1,
      title: 'test book',
      date_published: '2015-02-01'
    }).then(function(book) {
      expect(formatter(book, opts)).to.be.an('object');
    });
  });

  it('should accept a collection and return an object', () => {
    return Books.read().then(function(books) {
      expect(books).to.have.property('length');
      expect(formatter(books, opts)).to.be.an('object');
    });
  });

  it('should accept a single-item collection and return an object', () => {
    opts.singleResult = true;
    return Books.read().then(function(books) {
      var coll = BooksModel.collection([books.at(0)]);
      expect(coll.length).to.equal(1);
      expect(formatter(coll, opts)).to.be.an('object');
    });
  });

});
