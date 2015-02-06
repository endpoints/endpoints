const expect = require('chai').expect;

const linkToMany = require('../../lib/link_to_many');

const DB = require('../../../../test/fixtures/classes/database');
const Authors = require('../../../../test/fixtures/models/authors');

describe('linkToMany', function () {

  var model;

  before(function () {
    return DB.reset().then(function () {
      return new Authors({id:1}).fetch({
        withRelated: Authors.relations
      }).then(function (result) {
        model = result;
      });
    });
  });

  it('should throw if a model is not provided', function () {
    expect(function () {
      linkToMany();
    }).to.throw(/No model/);
  });

  it('should throw if an array of relations are not provided', function () {
    expect(function () {
      linkToMany(model);
    }).to.throw(/No relations/);
  });

  it('should throw if an exporter callback is not provided', function () {
    expect(function () {
      linkToMany(model, Authors.relations);
    }).to.throw(/No exporter/);
  });

});
