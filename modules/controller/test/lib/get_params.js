const expect = require('chai').expect;

const getParams = require('../../lib/get_params');

describe('getParams', function () {

  var request = {
    query: {
      include: 'cat,dog',
      filter: {
        type: {
          id: 1
        }
      },
      sort: '+last,+first,-birthday',
      fields: {
        type: 'id,name'
      }
    }
  };

  var defaultConfig = {
    include: ['cat', 'dog'],
    filter: {
      type: {
        id: 1
      }
    },
    sort: ['+last', '+first', '-birthday'],
    fields: {
      type: ['id', 'name']
    }
  };

  var paramsWithRequest = getParams(request, defaultConfig);
  var paramsWithDefault = getParams({}, defaultConfig);

  it('should extract and normalize `include` params from a request, or use defaults', function () {
    expect(paramsWithRequest.include).to.deep.equal(request.query.include.split(','));
    expect(paramsWithDefault.include).to.deep.equal(defaultConfig.include);
  });

  it('should extract `filter` params from a request, or use defaults', function () {
    expect(paramsWithRequest.filter).to.deep.equal(request.query.filter);
    expect(paramsWithDefault.filter).to.deep.equal(defaultConfig.filter);
  });

  it('should extract `fields` params from a request, or use defaults', function () {
    expect(paramsWithRequest.fields).to.deep.equal(request.query.fields);
    expect(paramsWithDefault.fields).to.deep.equal(defaultConfig.fields);
  });

  it('should extract `sort` params from a request, or use defaults', function () {
    expect(paramsWithRequest.sort).to.deep.equal(request.query.sort.split(','));
    expect(paramsWithDefault.sort).to.deep.equal(defaultConfig.sort);
  });


});
