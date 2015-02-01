const normalizeValue = require('../../lib/normalize_value');

describe('normalizeValue', function () {

  it('should convert string "true" in any case to boolean', function () {
    expect(normalizeValue('true')).to.equal(true);
    expect(normalizeValue('TRUE')).to.equal(true);
  });

  it('should convert string "false" in any case to boolean', function () {
    expect(normalizeValue('false')).to.equal(false);
    expect(normalizeValue('FALSE')).to.equal(false);
  });

  it('should split strings on a specified delimiter', function () {
    expect(normalizeValue('1,2,3')).to.deep.equal(['1','2','3']);
  });

});
