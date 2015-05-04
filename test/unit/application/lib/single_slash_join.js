import {expect} from 'chai';
import singleSlashJoin from '../../../../src/application/lib/single_slash_join';

describe('singleSlashJoin', () => {

  it('should throw if input is not an array', () => {
    expect(() => { singleSlashJoin(''); }).to.throw(/Input must be an/);
  });

  it('should return an leading / for an array of empty strings', () => {
    expect(singleSlashJoin(['', ''])).to.equal('/');
  });

  it('should have no leading or trailing slashes', () => {
    expect(singleSlashJoin(['foo'])).to.equal('/foo');
    expect(singleSlashJoin(['/foo'])).to.equal('/foo');
    expect(singleSlashJoin(['foo/'])).to.equal('/foo');
    expect(singleSlashJoin(['/foo/'])).to.equal('/foo');
    expect(singleSlashJoin(['//foo'])).to.equal('/foo');
    expect(singleSlashJoin(['foo//'])).to.equal('/foo');
    expect(singleSlashJoin(['//foo//'])).to.equal('/foo');
  });

  it('should join arrays of strings together with single slashes', () => {
    expect(singleSlashJoin(['foo', 'bar'])).to.equal('/foo/bar');
    expect(singleSlashJoin(['foo/', 'bar'])).to.equal('/foo/bar');
    expect(singleSlashJoin(['foo//', 'bar'])).to.equal('/foo/bar');
    expect(singleSlashJoin(['foo/', '/bar'])).to.equal('/foo/bar');
    expect(singleSlashJoin(['foo//', '/bar'])).to.equal('/foo/bar');
    expect(singleSlashJoin(['foo//', '//bar'])).to.equal('/foo/bar');
  });

  it('should not add slashes for empty strings', () => {
    expect(singleSlashJoin(['foo', '', 'bar'])).to.equal('/foo/bar');
    expect(singleSlashJoin(['foo/', '', 'bar'])).to.equal('/foo/bar');
    expect(singleSlashJoin(['foo//', '', 'bar'])).to.equal('/foo/bar');
    expect(singleSlashJoin(['foo/', '', '/bar'])).to.equal('/foo/bar');
    expect(singleSlashJoin(['foo//', '', '/bar'])).to.equal('/foo/bar');
    expect(singleSlashJoin(['foo//', '', '//bar'])).to.equal('/foo/bar');
  });

});
