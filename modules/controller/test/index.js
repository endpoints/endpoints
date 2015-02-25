const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const bluebird = require('bluebird');

chai.use(require('chai-as-promised'));

const Controller = require('../');

const source = require('./mocks/source');
const controller = new Controller({
  source: source
});

describe('Controller', function () {

  it('should be an object', function() {
    expect(controller).to.be.an('object');
  });

  describe('lib', function () {

    describe('payloads', function () {

      require('./lib/payloads/create');
      require('./lib/payloads/destroy');
      require('./lib/payloads/read');
      require('./lib/payloads/update');

    });

    require('./lib/extract');
    require('./lib/normalize_value');
    require('./lib/parse_options');
    require('./lib/request_handler');
    require('./lib/responder');
    require('./lib/search_keys');
    require('./lib/source_has');
    require('./lib/verify_accept');
    require('./lib/verify_content_type');
    require('./lib/verify_data_object');
  });

  describe('#_throwIfModel', function() {
    it('should throw if passed an argument', function() {
      expect(function() {controller._throwIfModel({});}).to.throw(/Model/);
    });

    it('should not throw if not passed an argument', function() {
      expect(function() {controller._throwIfModel();}).to.not.throw();
    });
  });

  describe('#_throwIfNoModel', function() {
    it('should throw if not passed an argument', function() {
      expect(function() {controller._throwIfNoModel();}).to.throw(/Unable/);
    });

    it('should throw if passed an error', function() {
      expect(function() {controller._throwIfNoModel(new Error());}).to.throw();
      expect(function() {controller._throwIfNoModel(new Error('No rows were affected'));}).to.throw();
      expect(function() {controller._throwIfNoModel(new Error('Unable to locate model.'));}).to.throw();
    });

    it('should not throw if passed a non-error argument', function() {
      expect(function() {controller._throwIfNoModel({});}).to.not.throw();
    });
  });

  describe('#_validateController', function() {
    var config;
    beforeEach(function() {
      config = {
        sourceMethod: 'create',
        filters: {},
        include: []
      };
    });

    it('should return an empty array if filters are valid', function() {
      config.filters.id = 1;
      var result = controller._validateController(config);
      expect(result).to.be.an('array');
      expect(result.length).to.equal(0);
    });

    it('should return an empty array if relations are valid', function() {
      config.include = ['relation'];
      var result = controller._validateController(config);
      expect(result).to.be.an('array');
      expect(result.length).to.equal(0);
    });

    it('should return an array with content if passed a bad filter', function() {
      config.filters.badFilter = 1;
      var result = controller._validateController(config);
      expect(result).to.be.an('array');
      expect(result.length).to.equal(1);
    });

    it('should return an array with content if passed a bad relation', function() {
      config.include = ['badRelation'];
      var result = controller._validateController(config);
      expect(result).to.be.an('array');
      expect(result.length).to.equal(1);
    });

    it('should not return an error on the read method even if it is not on the model', function() {
      config.sourceMethod = 'read';
      var result = controller._validateController(config);
      expect(source.model.read).to.be.undefined;
      expect(source.model.prototype.read).to.be.undefined;
      expect(result.length).to.equal(0);
    });

    it('should not return an error on the readRelation method even if it is not on the model', function() {
      config.sourceMethod = 'readRelation';
      var result = controller._validateController(config);
      expect(source.model.readRelation).to.be.undefined;
      expect(source.model.prototype.readRelation).to.be.undefined;
      expect(result.length).to.equal(0);
    });

    it('should look for the create method on the model', function() {
      config.sourceMethod = 'create';
      var result = controller._validateController(config);
      expect(source.model.create).to.exist;
      expect(source.model.prototype.create).to.be.undefined;
      expect(result.length).to.equal(0);
    });

    it('should look for the destroy method on the model prototype', function() {
      config.sourceMethod = 'destroy';
      var result = controller._validateController(config);
      expect(source.model.destroy).to.be.undefined;
      expect(source.model.prototype.destroy).to.exist;
      expect(result.length).to.equal(0);
    });

    it('should look for the update method on the model prototype', function() {
      config.sourceMethod = 'update';
      var result = controller._validateController(config);
      expect(source.model.update).to.be.undefined;
      expect(source.model.prototype.update).to.exist;
      expect(result.length).to.equal(0);
    });
  });

  describe('#_configureController', function() {

    it('should set a sourceMethod property that matches the passed-in method', function() {
      var method = 'read';
      expect(controller._configureController(method).sourceMethod).to.equal(method);
    });

    it('should set the method property to opts.method if opts.method exists', function() {
      expect(controller._configureController('read', {method:'other'}).method).to.equal('other');
    });

    it('should set the method property to the method argument if opts.method does not exist', function() {
      expect(controller._configureController('read').method).to.equal('read');
    });

    it('should set the payload property to a function', function() {
      expect(controller._configureController('read').payload).to.be.a('function');
    });

    it('should set the responder property to a function', function() {
      expect(controller._configureController('read').responder).to.be.a('function');
    });

    it('should set the controller property to a function', function() {
      expect(controller._configureController('read').controller).to.be.a('function');
    });

    it('should set the include property to a array', function() {
      expect(controller._configureController('read').include).to.be.an('array');
    });

    it('should set the filters property to an object', function() {
      expect(controller._configureController('read').filters).to.be.an('object');
    });

    it('should set the type property to a string', function() {
      expect(controller._configureController('read').type).to.be.a('string');
    });

    it('should call _validateController', function() {
      var stub = sinon.stub(controller, '_validateController').returns([]);
      controller._configureController('read');
      expect(stub.calledOnce).to.be.true;
      stub.restore();
    });

    it('should throw if _validateController returns an array with elements', function() {
      var stub = sinon.stub(controller, '_validateController').returns([1]);
      expect(function() {
        controller._configureController('read');
      }).to.throw();
      stub.restore();
    });
  });

  describe('public CRUD methods', function() {
    var configStub;
    var handlerStub;
    var config = {configProp: true};

    beforeEach(function() {
      configStub = sinon.stub(controller.__proto__, '_configureController').returns(config);
      handlerStub = sinon.stub(controller.__proto__, '_requestHandler').returnsThis();
    });

    afterEach(function() {
      configStub.restore();
      handlerStub.restore();
    });

    describe('#create', function () {

      it('should call _configureController with "create" as the first argument', function() {
        controller.create();
        expect(configStub.calledOnce).to.be.true;
        expect(configStub.getCall(0).args[0]).to.equal('create');
      });

      it('should call _configureController with its own "opts" argument it passes in', function() {
        var opts = {myOpt: 1};
        controller.create(opts);
        expect(configStub.getCall(0).args[1]).to.equal(opts);
      });

      it('should call requestHandler with the output from _configureController', function() {
        controller.create();
        expect(handlerStub.getCall(0).args[0]).to.equal(config);
      });
    });

    describe('#read', function () {

      it('should call _configureController with "read" as the first argument', function() {
        controller.read();
        expect(configStub.calledOnce).to.be.true;
        expect(configStub.getCall(0).args[0]).to.equal('read');
      });

      it('should call _configureController with its own "opts" argument it passes in', function() {
        var opts = {myOpt: 1};
        controller.read(opts);
        expect(configStub.getCall(0).args[1]).to.equal(opts);
      });

      it('should call requestHandler with the output from _configureController', function() {
        controller.read();
        expect(handlerStub.getCall(0).args[0]).to.equal(config);
      });
    });

    describe('#readRelation', function () {

      it('should call _configureController with "readRelation" as the first argument', function() {
        controller.readRelation();
        expect(configStub.calledOnce).to.be.true;
        expect(configStub.getCall(0).args[0]).to.equal('readRelation');
      });

      it('should call _configureController with its own "opts" argument it passes in', function() {
        var opts = {myOpt: 1};
        controller.readRelation(opts);
        expect(configStub.getCall(0).args[1]).to.equal(opts);
      });

      it('should call requestHandler with the output from _configureController', function() {
        controller.readRelation();
        expect(handlerStub.getCall(0).args[0]).to.equal(config);
      });
    });

    describe('#update', function () {

      it('should call _configureController with "update" as the first argument', function() {
        controller.update();
        expect(configStub.calledOnce).to.be.true;
        expect(configStub.getCall(0).args[0]).to.equal('update');
      });

      it('should call _configureController with its own "opts" argument it passes in', function() {
        var opts = {myOpt: 1};
        controller.update(opts);
        expect(configStub.getCall(0).args[1]).to.equal(opts);
      });

      it('should call requestHandler with the output from _configureController', function() {
        controller.update();
        expect(handlerStub.getCall(0).args[0]).to.equal(config);
      });
    });

    describe('#destroy', function () {

      it('should call _configureController with "destroy" as the first argument', function() {
        controller.destroy();
        expect(configStub.calledOnce).to.be.true;
        expect(configStub.getCall(0).args[0]).to.equal('destroy');
      });

      it('should call _configureController with its own "opts" argument it passes in', function() {
        var opts = {myOpt: 1};
        controller.destroy(opts);
        expect(configStub.getCall(0).args[1]).to.equal(opts);
      });

      it('should call requestHandler with the output from _configureController', function() {
        controller.destroy();
        expect(handlerStub.getCall(0).args[0]).to.equal(config);
      });
    });
  });

  describe('#_create', function() {
    var createStub, byIdStub, opts, req;

    beforeEach(function() {
      createStub = sinon.stub(controller.source, 'create').returnsThis();
      byIdStub = sinon.stub(controller.source, 'byId').returns(new bluebird.Promise(function(resolve, reject) {
        resolve();
      }));
      opts = {method:'create'};
      req = {body:{data:{}}};
    });

    afterEach(function() {
      createStub.restore();
      byIdStub.restore();
    });

    it('should call source.create when no id is included in the data', function() {
      controller._create(opts, req);
      expect(createStub.calledOnce).to.be.true;
    });

    it('should call source.byId when an id is included in the data', function() {
      req.body.data.id = 1;
      controller._create(opts, req);
      expect(byIdStub.calledOnce).to.be.true;
      expect(byIdStub.getCall(0).args[0]).to.equal(1);
    });

    it('should call source.create if an id is included that does not match an existing model');
  });

  describe('#_read', function() {
    var includesStub, filtersStub, readStub;

    beforeEach(function() {
      includesStub = sinon.stub(controller.__proto__, '_includes');
      filtersStub = sinon.stub(controller.__proto__, '_filters');
      readStub = sinon.stub(controller.source, 'read');
    });

    afterEach(function() {
      readStub.restore();
      includesStub.restore();
      filtersStub.restore();
    });

    it('should call source.read with includes returned by _includes if any', function() {
      var includes = [1];
      includesStub.returns(includes);
      filtersStub.returns({});
      controller._read({});
      expect(readStub.getCall(0).args[0].relations).to.equal(includes);
    });

    it('should call source.read with opts.include if _includes returns an empty array', function() {
      var includes = [1];
      includesStub.returns([]);
      filtersStub.returns({});
      controller._read({include: includes});
      expect(readStub.getCall(0).args[0].relations).to.equal(includes);
    });

    it('should call source.read with filters returned by _filters if any', function() {
      var filters = {a:1};
      includesStub.returns([]);
      filtersStub.returns(filters);
      controller._read({});
      expect(readStub.getCall(0).args[0].filters).to.equal(filters);
    });

    it('should call source.read with opts.include if _filters returns an empty array', function() {
      var filters = {a:1};
      includesStub.returns([]);
      filtersStub.returns([]);
      controller._read({filters: filters});
      expect(readStub.getCall(0).args[0].filters).to.equal(filters);
    });
  });

  describe('#_readRelation', function() {
    var byIdStub;

    beforeEach(function() {
      byIdStub = sinon.stub(controller.source, 'byId').returns(new bluebird.Promise(function(resolve, reject) {
        resolve({related: function() {return true;}});
      }));
    });

    afterEach(function() {
      byIdStub.restore();
    });

    it('should call source.byId', function() {
      controller._readRelation({}, {params: {id: 1}});
      expect(byIdStub.calledOnce).to.be.true;
    });

    it('should throw if no model is returned from source.byId');
    it('should throw if source.byId errors out');
  });

  describe('#_update', function() {
    var opts, req, byIdStub;

    beforeEach(function() {
      opts = {
        method: 'update',
        sourceMethod: 'update'
      };
      req = {
        params: {
          id: 1
        },
        body: {
          data: {}
        }
      };
      byIdStub = sinon.stub(controller.source, 'byId').returns(new bluebird.Promise(function(resolve, reject) {
        resolve({related: function() {return true;}});
      }));
    });

    afterEach(function() {
      byIdStub.restore();
    });

    it('should call source.byId', function() {
      controller._update(opts, req);
      expect(byIdStub.calledOnce).to.be.true;
    });

    it('should throw if no model is returned from source.byId');
    it('should throw if source.byId errors out');
  });

  describe('#_destroy', function() {
    var opts, req, byIdStub;

    beforeEach(function() {
      opts = {
        method: 'destroy',
        sourceMethod: 'destroy'
      };
      req = {
        params: {
          id: 1
        },
        body: {
          data: {}
        }
      };
      byIdStub = sinon.stub(controller.source, 'byId').returns(new bluebird.Promise(function(resolve, reject) {
        resolve({related: function() {return true;}});
      }));
    });

    afterEach(function() {
      byIdStub.restore();
    });

    it('should call source.byId', function() {
      controller._destroy(opts, req);
      expect(byIdStub.calledOnce).to.be.true;
    });

    it('should throw if no model is returned from source.byId');
    it('should throw if source.byId errors out');
  });

  describe('#_filters', function() {
    it('should return the result of the _extract method', function() {
      var extractStub = sinon.stub(controller.__proto__, '_extract').returns('result');
      expect(controller._filters({params:{}})).to.equal('result');
      extractStub.restore();
    });
  });

  describe('#_includes', function() {
    var extractStub;

    beforeEach(function() {
      extractStub = sinon.stub(controller.__proto__, '_extract');
    });

    afterEach(function() {
      extractStub.restore();
    });

    it('should return an array if extract returns undefined', function() {
      expect(controller._includes()).to.be.an('array');
    });

    it('should return an array if extract returns an array', function() {
      extractStub.returns([]);
      expect(controller._includes()).to.be.an('array');
    });

    it('should return an array if extract returns a non-array value', function() {
      extractStub.returns({});
      expect(controller._includes()).to.be.an('array');
    });
  });
});
