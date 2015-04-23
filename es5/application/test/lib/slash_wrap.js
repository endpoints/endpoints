'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _slashWrap = require('../../lib/slash_wrap');

var _slashWrap2 = _interopRequireWildcard(_slashWrap);

describe('slashWrap', function () {

  it('should ensure a string is wrapped with a single slash', function () {
    _expect.expect(_slashWrap2['default']()).to.equal('/');
    _expect.expect(_slashWrap2['default']('foo')).to.equal('/foo/');
    _expect.expect(_slashWrap2['default']('/foo')).to.equal('/foo/');
    _expect.expect(_slashWrap2['default']('foo/')).to.equal('/foo/');
    _expect.expect(_slashWrap2['default']('/foo/')).to.equal('/foo/');
    _expect.expect(_slashWrap2['default']('//foo')).to.equal('/foo/');
    _expect.expect(_slashWrap2['default']('foo//')).to.equal('/foo/');
    _expect.expect(_slashWrap2['default']('//foo//')).to.equal('/foo/');
  });
});