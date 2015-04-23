'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _destroyer = require('../../lib/destroy');

var _destroyer2 = _interopRequireWildcard(_destroyer);

var destroy = _destroyer2['default'].bind(null, function (data) {
  return data;
});

describe('#destroy', function () {

  it('should return data and code 204', function () {
    var output = destroy({});
    _expect.expect(output.code).to.equal('204');
    _expect.expect(output.data).to.equal(null);
  });
});