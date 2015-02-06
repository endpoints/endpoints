const expect = require('chai').expect;

const linkToOne = require('../../lib/link_to_one');

const DB = require('../../../../test/fixtures/classes/database');
const Books = require('../../../../test/fixtures/models/books');
const Authors = require('../../../../test/fixtures/models/authors');

const authorLink = {
  href: '/authors/1',
  id: 1,
  type: 'authors'
};

const seriesLink = {
  id: null,
  type: 'series'
};

const bookLinks = {
  author: authorLink,
  series: seriesLink
};

describe('linkToOne', function () {

  var model;

  before(function () {
    return DB.reset().then(function () {
      return new Books({id:11}).fetch({
        withRelated: Books.relations
      }).then(function (result) {
        model = result;
      });
    });
  });

  it('should throw if a model is not provided', function () {
    expect(function () {
      linkToOne();
    }).to.throw(/No model/);
  });

  it('should throw if an array of relations is not provided', function () {
    expect(function () {
      linkToOne(model);
    }).to.throw(/No relations/);
  });

  it('should generate links entry for all belongsTo relations on a model', function () {
    expect(linkToOne(model, Books.relations)).to.deep.equal(bookLinks);
  });

  it('should throw on invalid relations', function () {
    expect(function () {
      linkToOne(model, ['invalid']);
    }).to.throw;
  });

  it('should ignore nested relations', function () {
    var relations = Books.relations.slice();
    relations.push('authors.books');
    expect(linkToOne(model, relations)).to.deep.equal(bookLinks);
  });

  it('should ignore toMany relations', function () {
    return new Authors({id:1}).fetch({withRelated:['books']}).then(function (author) {
      expect(linkToOne(author, ['books'])).to.deep.equal({});
    });
  });

});
