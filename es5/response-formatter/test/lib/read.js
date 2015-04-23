'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _reader = require('../../lib/read');

var _reader2 = _interopRequireWildcard(_reader);

var read = _reader2['default'].bind(null, function (data) {
  return data;
});

describe('#read', function () {

  it('should return data and code 200', function () {
    var input = {
      type: 'test'
    };
    var config = {
      typeName: 'thing'
    };
    var output = read(config, input);
    _expect.expect(output.code).to.equal('200');
    _expect.expect(output.data).to.deep.equal(input);
  });

  it('should return data and code 404', function () {
    var opts = {
      typeName: 'thing'
    };
    var output = read(null, opts);
    _expect.expect(output.code).to.equal('404');
    // TOOD: test this
    //expect(output.data).to.equal(null);
  });
});