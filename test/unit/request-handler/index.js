import {expect} from 'chai';
import sinon from 'sinon';
import RequestHandler from '../../../src/request-handler';

const req = {
  headers: {
    accept: 'application/vnd.api+json'
  },
  body: {}
};

describe('RequestHandler', () => {

  describe('lib', () => {
    require('./lib/collapse_include');
    require('./lib/split_string_props');
    require('./lib/throw_if_model');
    require('./lib/throw_if_no_model');
    require('./lib/verify_client_generated_id');
    require('./lib/verify_content_type');
    require('./lib/verify_data_object');
    require('./lib/verify_full_replacement');
  });

  describe('#create', () => {
    const post = {
      headers: {
        accept: 'application/vnd.api+json'
      },
      method: 'POST',
      params: {},
      body: {
        data: {
          id: 'something',
        }
      }
    };

    it('it should run store#byId to check uniqueness', (done) => {

      const store = {
        byId: sinon.stub().returns(Promise.resolve(true)),
      };

      const config = {
        store,
        model: {},
      };
      const requestHandler = new RequestHandler(config);

      requestHandler.create(post)
      .catch((err) => {
        expect(err.httpStatus).to.equal('409');
        expect(err.message).to.equal('Model with this ID already exists');
        done();
      });

    });

    it('it should return the newly created model instance when passed an id that doesn\'t exist', (done) => {

      const createdModel = {};

      const store = {
        byId: sinon.stub().returns(Promise.resolve(false)),
        create: sinon.stub().returns(Promise.resolve(createdModel)),
      };

      const config = {
        store,
        model: {},
      };
      const requestHandler = new RequestHandler(config);

      requestHandler.create(post)
      .then((model) => {
        expect(model).to.equal(createdModel);
        done();
      });

    });

    it('it should return the newly created model instance when no id is passed', (done) => {

      const createdModel = {};

      const store = {
        create: sinon.stub().returns(Promise.resolve(createdModel)),
      };

      const config = {
        store,
        model: {},
      };
      const requestHandler = new RequestHandler(config);

      var postRequest = Object.assign({}, post);
      postRequest.body.data = {};

      requestHandler.create(postRequest)
      .then((model) => {
        expect(model).to.equal(createdModel);
        done();
      });

    });

  });

  describe('#createRelation', () => {
    const post = {
      headers: {
        accept: 'application/vnd.api+json'
      },
      method: 'POST',
      params: { relation: true, },
      body: {
        data: {
          id: 'something',
        }
      }
    };

    it('it should check if the related model exists', (done) => {

      const store = {
        byId: sinon.stub().returns(Promise.resolve(false)),
        createRelation: sinon.stub().returns(Promise.resolve({})),
      };

      const config = {
        store,
        model: {},
      };
      const requestHandler = new RequestHandler(config);

      requestHandler.createRelation(post)
      .catch((err) => {
        expect(err.httpStatus).to.equal('404');
        expect(err.message).to.equal('Unable to locate model.');
        done();
      });

    });

    it('it should return the newly created model instance when passed an id that doesn\'t exist', (done) => {

      const createdModel = {};

      const store = {
        byId: sinon.stub().returns(Promise.resolve(true)),
        createRelation: sinon.stub().returns(Promise.resolve(createdModel)),
      };

      const config = {
        store,
        model: {},
      };
      const requestHandler = new RequestHandler(config);

      requestHandler.createRelation(post)
      .then((model) => {
        expect(model).to.equal(createdModel);
        done();
      });

    });

    it('it should return the newly created model instance when no id is passed', (done) => {

      const createdModel = {};

      const store = {
        byId: sinon.stub().returns(Promise.resolve(true)),
        createRelation: sinon.stub().returns(Promise.resolve(createdModel)),
      };

      const config = {
        store,
        model: {},
      };
      const requestHandler = new RequestHandler(config);

      var postRequest = Object.assign({}, post);
      postRequest.body.data = {};

      requestHandler.createRelation(postRequest)
      .then((model) => {
        expect(model).to.equal(createdModel);
        done();
      });

    });

  });

  describe('#read', () => {

    it('it should call store#read', () => {
      const store = {
        read: sinon.spy()
      };
      const request = new RequestHandler({
        store,
      });

      request.read({
        params: {
          id: true,
        },
        query: {
          filter: {},
        }
      });

      expect(store.read.calledOnce).to.be.true;
    });

  });

  describe('#readRelated', () => {

    it('it should call store#readRelated', () => {
      const store = {
        readRelated: sinon.spy()
      };
      const request = new RequestHandler({
        store,
      });

      request.readRelated({
        params: {
          id: true,
        },
        query: {
          filter: {},
        }
      });

      expect(store.readRelated.calledOnce).to.be.true;
    });

  });

  describe('#readRelation', () => {

    it('it should call store#readRelation', () => {
      const store = {
        readRelation: sinon.spy()
      };
      const request = new RequestHandler({
        store,
      });

      request.readRelation({
        params: {
          id: true,
        },
        query: {
          filter: {},
        }
      });

      expect(store.readRelation.calledOnce).to.be.true;
    });

  });

  describe('#update', () => {
    const post = {
      headers: {
        accept: 'application/vnd.api+json'
      },
      method: 'PATCH',
      params: {},
      body: {
        data: {
          id: 'something',
        }
      }
    };

    it('it should run store#byId to check uniqueness', (done) => {

      const store = {
        byId: sinon.stub().returns(Promise.resolve(false)),
      };

      const config = {
        store,
        model: {},
      };
      const requestHandler = new RequestHandler(config);

      requestHandler.update(post)
      .catch((err) => {
        expect(err.httpStatus).to.equal('404');
        expect(err.message).to.equal('Unable to locate model.');
        done();
      });

    });

    it('it should return the newly updated model instance when passed an id that doesn\'t exist', (done) => {

      const createdModel = {};

      const store = {
        byId: sinon.stub().returns(Promise.resolve(true)),
        update: sinon.stub().returns(Promise.resolve(createdModel)),
      };

      const config = {
        store,
        model: {},
      };
      const requestHandler = new RequestHandler(config);

      requestHandler.update(post)
      .then((model) => {
        expect(model).to.equal(createdModel);
        done();
      });

    });

  });

  describe('#updateRelation', () => {
    const post = {
      headers: {
        accept: 'application/vnd.api+json'
      },
      method: 'PATCH',
      params: {},
      body: {
        data: {
          id: 'something',
        }
      }
    };

    it('it should run store#byId to check it exists', (done) => {

      const store = {
        byId: sinon.stub().returns(Promise.resolve(false)),
      };

      const config = {
        store,
        model: {},
      };
      const requestHandler = new RequestHandler(config);

      requestHandler.updateRelation(post)
      .catch((err) => {
        expect(err.httpStatus).to.equal('404');
        expect(err.message).to.equal('Unable to locate model.');
        done();
      });

    });

    it('it should return the newly updated relation model instance when passed an id that doesn\'t exist', (done) => {

      const createdModel = {};

      const store = {
        byId: sinon.stub().returns(Promise.resolve(true)),
        update: sinon.stub().returns(Promise.resolve(createdModel)),
      };

      const config = {
        store,
        model: {},
      };
      const requestHandler = new RequestHandler(config);

      requestHandler.updateRelation(post)
      .then((model) => {
        expect(model).to.equal(createdModel);
        done();
      });

    });

  });

  describe('#destroy', () => {
    const post = {
      headers: {
        accept: 'application/vnd.api+json'
      },
      method: 'PATCH',
      params: {},
      body: {
        data: {
          id: 'something',
        }
      }
    };

    it('it should run without error', (done) => {

      const store = {
        byId: sinon.stub().returns(Promise.resolve(true)),
        destroy: sinon.stub().returns(Promise.resolve(true)),
      };

      const config = {
        store,
        model: {},
      };
      const requestHandler = new RequestHandler(config);

      requestHandler.destroy(post)
      .then((value) => {
        expect(value).to.be.true;
        done();
      });

    });

  });

  describe('#destroyRelation', () => {
    const post = {
      headers: {
        accept: 'application/vnd.api+json'
      },
      method: 'PATCH',
      params: {},
      body: {
        data: {
          id: 'something',
        }
      }
    };

    it('it should run without error', (done) => {

      const store = {
        byId: sinon.stub().returns(Promise.resolve(true)),
        destroyRelation: sinon.stub().returns(Promise.resolve(true)),
      };

      const config = {
        store,
        model: {},
      };
      const requestHandler = new RequestHandler(config);

      requestHandler.destroyRelation(post)
      .then((value) => {
        expect(value).to.be.true;
        done();
      });

    });

  });

  describe('#validate', () => {

    it('it should run user supplied validators', () => {
      const validator = sinon.spy();
      const config = {
        validators: [validator]
      };
      const request = new RequestHandler(config);

      expect(request.validate(req)).to.be.undefined;
      expect(validator.calledOnce).to.be.true;
    });


    it('it should return an error if the custom validator errors', () => {
      const config = {
        validators: [() => {
          return {
            message: 'I am an error'
          };
        }]
      };
      const request = new RequestHandler(config);

      const error = request.validate(req);
      expect(error).to.deep.equal({
        message: 'I am an error'
      });
    });

    it('it should validate ids passed by the client', () => {
      const config = {
        allowClientGeneratedIds: false,
        validators: []
      };

      const post = {
        headers: {
          accept: 'application/vnd.api+json'
        },
        method: 'POST',
        params: {},
        body: {
          data: {
            id: 'something',
          }
        }
      };

      const request = new RequestHandler(config);

      const error = request.validate(post);
      expect(error.httpStatus).to.equal('403');
      expect(error.message).to.equal('Client generated IDs are not enabled.');
    });

    it('it should validate replacing relations', () => {
      const config = {
        allowToManyFullReplacement: false,
        validators: []
      };

      const post = {
        headers: {
          accept: 'application/vnd.api+json',
          'content-type': 'application/vnd.api+json'
        },
        method: 'PATCH',
        params: {
          relation: true,
        },
        body: {
          data: [],
          links: {

          }
        }
      };

      const request = new RequestHandler(config);

      const error = request.validate(post);
      expect(error.httpStatus).to.equal('403');
      expect(error.message).to.equal('Full replacement of to-Many relations is not allowed.');
    });

  });

  describe('#query', () => {

    const defaultConfig = {
      include: ['cat', 'dog'],
      filter: {
        id: ['1', '2']
      },
      sort: ['+last', '+first', '-birthday'],
      fields: {
        type: ['id', 'name']
      }
    };

    const request = {
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

    const requestHandler = new RequestHandler(defaultConfig);

    const paramsWithRequest = requestHandler.query(request);
    const paramsWithDefault = requestHandler.query({ query: {} });

    it('should extract and normalize `include` params from a request, or use defaults', () => {
      expect(paramsWithRequest.include).to.deep.equal(defaultConfig.include);
      expect(paramsWithDefault.include).to.deep.equal(defaultConfig.include);
    });

    it('should extract `filter` params from a request, or use defaults', () => {
      expect(paramsWithRequest.filter).to.deep.equal(defaultConfig.filter);
      expect(paramsWithDefault.filter).to.deep.equal(defaultConfig.filter);
    });

    it('should extract `fields` params from a request, or use defaults', () => {
      expect(paramsWithRequest.fields).to.deep.equal(defaultConfig.fields);
      expect(paramsWithDefault.fields).to.deep.equal(defaultConfig.fields);
    });

    it('should extract `sort` params from a request, or use defaults', () => {
      expect(paramsWithRequest.sort).to.deep.equal(defaultConfig.sort);
      expect(paramsWithDefault.sort).to.deep.equal(defaultConfig.sort);
    });

    it('should clone the opts object on each run', () => {
      const handler = new RequestHandler(defaultConfig);
      const params = handler.query({ query: {} });
      params.filter.id = 1;
      expect(defaultConfig.filter).to.not.equal(params.filter);
    });
  });

});
