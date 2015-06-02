/*import {expect} from 'chai';
import sinon from 'sinon';
import RequestHandler from '../../../src/request-handler';

var req = {
  headers: {
    accept: 'application/vnd.api+json'
  },
  body: {}
};
var source = {
  typeName: function() {}
};
*/
describe('RequestHandler', function () {

  describe('lib', function () {
    require('../../../src/request-handler/lib/collapse_include');
    require('../../../src/request-handler/lib/split_string_props');
    require('../../../src/request-handler/lib/throw_if_model');
    require('../../../src/request-handler/lib/throw_if_no_model');
    require('../../../src/request-handler/lib/verify_client_generated_id');
    require('../../../src/request-handler/lib/verify_content_type');
    require('../../../src/request-handler/lib/verify_data_object');
    require('../../../src/request-handler/lib/verify_full_replacement');
  });

  describe('#include', function () {

  });

  describe('#filter', function () {

  });

  describe('#fields', function () {

  });

  describe('#sort', function () {

  });

  describe('#params', function () {

  });

});
/**import {expect} from 'chai';
/*
  describe('#validate', function () {

    it('it should run user supplied validators', () => {
      var validator = sinon.spy();
      var config = {
        validators: [validator]
      };
      var request = new RequestHandler(source, config);

      expect(request.validate(req)).to.be.undefined;
      expect(validator.calledOnce).to.be.true;
    });


    it('it should return an error if the custom validator errors', () => {
      var config = {
        validators: [function() {
          return {
            message: 'I am an error'
          };
        }]
      };
      var request = new RequestHandler(source, config);

      var error = request.validate(req);
      expect(error).to.deep.equal({
        message: 'I am an error'
      });
    });

  });
import getParams from '../../lib/get_params';

describe('getParams', function () {

  var request = {
    query: {
      include: 'cat,dog',
      filter: {
        id: '1,2'
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
      id: ['1', '2']
    },
    sort: ['+last', '+first', '-birthday'],
    fields: {
      type: ['id', 'name']
    }
  };

  var paramsWithRequest = getParams(request, defaultConfig);
  var paramsWithDefault = getParams({}, defaultConfig);

  it('should extract and normalize `include` params from a request, or use defaults', function () {
    expect(paramsWithRequest.include).to.deep.equal(defaultConfig.include);
    expect(paramsWithDefault.include).to.deep.equal(defaultConfig.include);
  });

  it('should extract `filter` params from a request, or use defaults', function () {
    expect(paramsWithRequest.filter).to.deep.equal(defaultConfig.filter);
    expect(paramsWithDefault.filter).to.deep.equal(defaultConfig.filter);
  });

  it('should extract `fields` params from a request, or use defaults', function () {
    expect(paramsWithRequest.fields).to.deep.equal(defaultConfig.fields);
    expect(paramsWithDefault.fields).to.deep.equal(defaultConfig.fields);
  });

  it('should extract `sort` params from a request, or use defaults', function () {
    expect(paramsWithRequest.sort).to.deep.equal(defaultConfig.sort);
    expect(paramsWithDefault.sort).to.deep.equal(defaultConfig.sort);
  });

  it('should clone the opts object on each run', function () {
    var params = getParams({}, defaultConfig);
    params.filter.id = 1;
    expect(defaultConfig.filter).to.not.equal(params.filter);
  });
*?
});
*/
