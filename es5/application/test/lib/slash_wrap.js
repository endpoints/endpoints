'use strict';

var expect = require('chai').expect;

var slashWrap = require('../../lib/slash_wrap');

describe('slashWrap', function () {

  it('should ensure a string is wrapped with a single slash', function () {
    expect(slashWrap()).to.equal('/');
    expect(slashWrap('foo')).to.equal('/foo/');
    expect(slashWrap('/foo')).to.equal('/foo/');
    expect(slashWrap('foo/')).to.equal('/foo/');
    expect(slashWrap('/foo/')).to.equal('/foo/');
    expect(slashWrap('//foo')).to.equal('/foo/');
    expect(slashWrap('foo//')).to.equal('/foo/');
    expect(slashWrap('//foo//')).to.equal('/foo/');
  });
});