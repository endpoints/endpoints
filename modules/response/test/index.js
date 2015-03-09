const expect = require('chai').expect;

const Responder = require('../');
const TestResponder = new Responder({
  formatter: function (data) {
    return data;
  }
});

describe('Responder', function () {

  describe('lib', function () {

    require('./lib/error');
    require('./lib/send');

  });

  describe('#create', function () {

    it('should return data and code 201', function () {
      var input = {
        id: '1',
        type: 'test'
      };
      var opts = {
        typeName: 'thing'
      };
      var output = TestResponder.create(input, opts);
      expect(output.code).to.equal('201');
      expect(output.data).to.deep.equal(input);
      expect(output.headers).to.deep.equal({
        location: '/' + opts.typeName + '/' + input.id
      });
    });

  });

  describe('#read', function () {

    it('should return data and code 200', function () {
      var input = {
        type: 'test'
      };
      var opts = {
        typeName: 'thing'
      };
      var output = TestResponder.read(input, opts);
      expect(output.code).to.equal('200');
      expect(output.data).to.deep.equal(input);
    });

    it('should return data and code 404', function () {
      var opts = {
        typeName: 'thing'
      };
      var output = TestResponder.read(null, opts);
      expect(output.code).to.equal('404');
      // TOOD: test this
      //expect(output.data).to.equal(null);
    });

  });

  describe('#update', function () {

    it('should return data and code 200', function () {
      var input = {
        data: {
          id: '1',
          type: 'test'
        }
      };
      var opts = {
        typeName: 'thing'
      };
      var output = TestResponder.read(input, opts);
      expect(output.code).to.equal('200');
      expect(output.data).to.deep.equal(input);
    });

  });

  describe('#destroy', function () {

    it('should return data and code 204', function () {
      var output = TestResponder.destroy({});
      expect(output.code).to.equal('204');
      expect(output.data).to.equal(null);
    });

  });

});
