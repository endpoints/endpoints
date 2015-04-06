const expect = require('chai').expect;

const Agent = require('../../../app/agent');
const Fixture = require('../../../app/fixture');

beforeEach(function() {
  return Fixture.reset();
});

describe('v1', function () {
  it('must ignore request object members not recognized by the specification', function() {
    return Agent.request('PATCH', '/books/1')
      .send({
        data: {
          type: 'books',
          id: '1',
          title: 'tiddlywinks'
        },
        notData: {
          what: 'a bad piece of data this is'
        }
      })
      .promise()
      .then(function(res) {
        expect(res.status).to.be.within(200, 299);
      });
  });

  // A logical collection of resources (e.g., the target of a to-many relationship) MUST be represented as an array, even if it only contains one item.
  // TODO: unit test to ensure to-Many relationships always represented as arrays
  // http://jsonapi.org/format/#document-structure-top-level
  it('must represent a logical collection of resources as an array, even if it only contains one item', function() {
    return Agent.request('GET', '/books/?filter[date_published]=1954-07-29')
      .promise()
      .then(function(res) {
        expect(res.status).to.equal(200);
        expect(res.body)
          .to.have.property('data')
            .that.is.a('array');
        expect(res.body.data.length).to.equal(1);
      });
  });

  // A logically singular resource (e.g., the target of a to-one relationship) MUST be represented as a single resource object.
  // TODO: unit test to ensure to-One relationships always represented as single objects
  // it('must represent a logically singular resource as a single resource object');

  require('./base-format');
  // require('./extensions');
  // require('./recommendations');

});
