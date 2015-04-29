'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _verifyDataObject = require('../../lib/verify_data_object');

var _verifyDataObject2 = _interopRequireDefault(_verifyDataObject);

describe('verifyDataObject', function () {

  it('should return an error if the data does not exist', function () {
    _expect.expect(_verifyDataObject2['default']({ body: {} })).to.be['instanceof'](Error);
  });

  it('should return an error if the data is not an object', function () {
    _expect.expect(_verifyDataObject2['default']({ body: { data: '' } })).to.be['instanceof'](Error);
  });

  it('should return an error if the data type is not a string', function () {
    _expect.expect(_verifyDataObject2['default']({ params: { id: 1 }, body: { data: { type: 1 } } })).to.be['instanceof'](Error);
  });

  it.skip('should return an error if the data type does not match the endpoint type', function () {
    _expect.expect(_verifyDataObject2['default']({ params: { id: 1 }, body: { data: { type: 'authors' } } }, { typeName: 'books' })).to.be['instanceof'](Error);
  });

  it.skip('should return an error if the data id does not match the endpoint id', function () {
    _expect.expect(_verifyDataObject2['default']({ params: { id: 1 }, body: { data: { type: 'books', id: 2 } } }, { typeName: 'books' })).to.be['instanceof'](Error);
  });

  it.skip('should have no return value if the data id and type matches the endpoint id and type', function () {
    _expect.expect(_verifyDataObject2['default']({ params: { id: 1 }, body: { data: { type: 'authors', id: 1 } } }, { typeName: 'authors' })).to.be.undefined;
  });

  it.skip('should have no return value if there is no id in the body and and the type matches the endpoint type', function () {
    _expect.expect(_verifyDataObject2['default']({ params: { id: 1 }, body: { data: { type: 'authors' } } }, { typeName: 'authors' })).to.be.undefined;
  });
});