require("source-map-support").install();
(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.Application = __webpack_require__(1);
	exports.Controller = __webpack_require__(2);
	exports.BookshelfAdapter = __webpack_require__(3);
	exports.ValidateJsonSchema = __webpack_require__(4);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _ = __webpack_require__(5);
	
	var parseOptions = __webpack_require__(11);
	var parseResource = __webpack_require__(12);
	var slashWrap = __webpack_require__(13);
	
	var Application = (function () {
	  function Application(opts) {
	    _classCallCheck(this, Application);
	
	    this._resources = {};
	    this._endpoints = [];
	    _.extend(this, parseOptions(opts));
	  }
	
	  _createClass(Application, [{
	    key: 'resource',
	    value: (function (_resource) {
	      function resource(_x) {
	        return _resource.apply(this, arguments);
	      }
	
	      resource.toString = function () {
	        return resource.toString();
	      };
	
	      return resource;
	    })(function (name) {
	      var resource = this._resources[name];
	      if (!resource) {
	        throw new Error('Resource "' + name + '" has not been registered.');
	      }
	      return resource;
	    })
	  }, {
	    key: 'register',
	    value: function register(input) {
	      if (Array.isArray(input)) {
	        input.forEach(this.register.bind(this));
	        return this;
	      }
	
	      var resource = parseResource(input, this.searchPaths);
	      var resourceName = resource.name;
	      if (this._resources[resourceName]) {
	        throw new Error('Resource "' + resourceName + '" registered twice');
	      }
	      this._resources[resourceName] = resource;
	      return this;
	    }
	  }, {
	    key: 'endpoint',
	    value: function endpoint(resourceName, prefix) {
	      var resource = this.resource(resourceName);
	      var url = slashWrap(prefix) + resourceName;
	      var output = this.routeBuilder(resource.routes, url);
	      this._endpoints.push({
	        name: resourceName,
	        url: url,
	        router: output,
	        resource: resource
	      });
	      return output;
	    }
	  }, {
	    key: 'manifest',
	    value: function manifest() {
	      return this._endpoints.reduce(function (result, endpoint) {
	        var resource = endpoint.resource;
	        var capabilities = resource.controller.capabilities;
	        result.push(_.extend({
	          name: resource.name,
	          url: endpoint.url
	        }, capabilities));
	        return result;
	      }, []);
	    }
	  }, {
	    key: 'index',
	    value: function index() {
	      return this.manifest().reduce(function (result, resource) {
	        var definition = resource.url;
	        var includes = resource.includes;
	        var filters = resource.filters;
	        if (includes.length) {
	          definition += '?include={' + includes.join(',') + '}';
	        }
	        if (filters.length) {
	          definition += definition === resource.url ? '?' : '&';
	          definition += '{' + filters.join(',') + '}';
	        }
	        result[resource.name] = definition;
	        return result;
	      }, {});
	    }
	  }]);
	
	  return Application;
	})();
	
	module.exports = Application;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _ = __webpack_require__(5);
	var validate = __webpack_require__(9);
	var handle = __webpack_require__(10);
	
	/**
	  Provides methods for generating request handling functions that can
	  be used by any node http server.
	*/
	
	var Controller = (function () {
	
	  /**
	    The constructor.
	     @constructs Controller
	    @param {Object} opts - opts.adapter: An endpoints adapter
	    @param {Object} opts - opts.model: A model compatible with the adapter.
	    @param {Object} opts - opts.validators: An array of validating methods.
	    @param {Object} opts - opts.allowClientGeneratedIds: boolean indicating this
	  */
	
	  function Controller() {
	    var opts = arguments[0] === undefined ? {} : arguments[0];
	
	    _classCallCheck(this, Controller);
	
	    if (!opts.adapter) {
	      throw new Error('No adapter specified.');
	    }
	    if (!opts.model) {
	      throw new Error('No model specified.');
	    }
	    var config = this.config = _.extend({
	      validators: [],
	      allowClientGeneratedIds: false
	    }, opts);
	
	    this._adapter = new config.adapter({
	      model: config.model
	    });
	  }
	
	  _createClass(Controller, [{
	    key: 'capabilities',
	    get: function () {
	      // TODO: include this.config?
	      return {
	        filters: this._adapter.filters(),
	        includes: this._adapter.relations()
	      };
	    }
	  }], [{
	    key: 'method',
	
	    /**
	      Used for generating CRUD (create, read, update, destroy) methods.
	       @param {String} method - The name of the function to be created.
	      @returns {Function} - function (req, res) { } (node http compatible request handler)
	    */
	    value: (function (_method) {
	      function method(_x) {
	        return _method.apply(this, arguments);
	      }
	
	      method.toString = function () {
	        return method.toString();
	      };
	
	      return method;
	    })(function (method) {
	      return function (opts) {
	        var config = _.extend({
	          method: method,
	          include: [],
	          filter: {},
	          fields: {},
	          sort: [],
	          schema: {} }, this.config, opts);
	        var validationFailures = validate(method, config, this._adapter);
	        if (validationFailures.length) {
	          throw new Error(validationFailures.join('\n'));
	        }
	        return handle(config, this._adapter);
	      };
	    })
	  }, {
	    key: 'extend',
	    value: function extend() {
	      var props = arguments[0] === undefined ? {} : arguments[0];
	
	      return (function (_ref) {
	        function Controller() {
	          var opts = arguments[0] === undefined ? {} : arguments[0];
	
	          _classCallCheck(this, Controller);
	
	          _get(Object.getPrototypeOf(Controller.prototype), 'constructor', this).call(this, _.extend({}, props, opts));
	        }
	
	        _inherits(Controller, _ref);
	
	        return Controller;
	      })(this);
	    }
	  }]);
	
	  return Controller;
	})();
	
	/**
	  Returns a request handling function customized to handle create requests.
	*/
	Controller.prototype.create = Controller.method('create');
	
	/**
	  Returns a request handling function customized to handle read requests.
	*/
	Controller.prototype.read = Controller.method('read');
	
	/**
	  Returns a request handling function customized to handle update requests.
	*/
	Controller.prototype.update = Controller.method('update');
	
	/**
	  Returns a request handling function customized to handle destroy requests.
	*/
	Controller.prototype.destroy = Controller.method('destroy');
	
	module.exports = Controller;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _ = __webpack_require__(5);
	
	var bPromise = __webpack_require__(6);
	var baseMethods = __webpack_require__(14);
	var processFilter = __webpack_require__(15);
	var processSort = __webpack_require__(16);
	var destructureRequest = __webpack_require__(17);
	var Kapow = __webpack_require__(7);
	
	// FIXME: decide if this responsibility lives in the adapter or
	// in the formatter. i think adapter? this would mean a wholesale
	// refactoring of the jsonapi formatter to work with adapters
	// rather than bookshelf models. that might make a lot of sense.
	var relate = __webpack_require__(18);
	
	/**
	  An adapter that allows endpoints to interact with a Bookshelf model.
	*/
	
	var BookshelfAdapter = (function () {
	
	  /**
	    The constructor.
	    @constructs BookshelfAdapter
	    @param {Object} opts - opts.model: a bookshelf model.
	  */
	
	  function BookshelfAdapter() {
	    var opts = arguments[0] === undefined ? {} : arguments[0];
	
	    _classCallCheck(this, BookshelfAdapter);
	
	    var model = opts.model;
	    if (!model) {
	      throw new Error('No bookshelf model specified.');
	    }
	    this.model = model;
	
	    // add missing methods on the model if needed. eventually something
	    // like this should exist in bookshelf or another higher order library
	    // natively.
	    if (!model.create) {
	      baseMethods.addCreate(this);
	    }
	    if (!model.prototype.update) {
	      baseMethods.addUpdate(this);
	    }
	  }
	
	  _createClass(BookshelfAdapter, [{
	    key: 'filters',
	
	    /**
	      An array of filters available on the underlying model. This controls
	      which filters will be recognized by a request.
	       For example, `GET /authors?filter[name]=John` would only filter by name
	      if 'name' was included in the array returned by this function.
	       @returns {Array} An array of object ids.
	    */
	    value: (function (_filters) {
	      function filters() {
	        return _filters.apply(this, arguments);
	      }
	
	      filters.toString = function () {
	        return filters.toString();
	      };
	
	      return filters;
	    })(function () {
	      var filters = Object.keys(this.model.filters || {});
	      // TODO: remove this and have the id filter be present by
	      // default on all bookshelf models. the alternative to this
	      // is putting the id filter in every model as boilerplate
	      // or waiting until the next version of bookshelf, where
	      // something like this can be added by default.
	      if (filters.indexOf('id') === -1) {
	        filters.push('id');
	      }
	      return filters;
	    })
	  }, {
	    key: 'relations',
	
	    /**
	      Provides an array of valid relations on the underlying model. This controls
	      which relations can be included in a request.
	       For example, `GET /authors/1?include=books` would only include related
	      books if `books` was included in the array returned by this function.
	       @returns {Array} An array containing relations on the model.
	     */
	    value: function relations() {
	      return this.model.relations || [];
	    }
	  }, {
	    key: 'typeName',
	
	    /**
	      Provides the type name of the underlying model. This controls the
	      value of the `type` property in responses.
	       @returns {String}
	    */
	    value: function typeName() {
	      return this.model.typeName;
	    }
	  }, {
	    key: 'related',
	
	    /**
	      Returns the model or collection of models related to a given model. This
	      makes it possible to support requests like:
	      GET /chapters/1/book.stores?filter[opened_after]=2015-01-01
	       Currently, this is extremely inefficient. Here's why:
	       Bookshelf cannot compose a query like this
	      ```sql
	      SELECT stores.*
	      FROM stores
	      INNER JOIN books_stores ON (books_stores.store_id = stores.id)
	      WHERE books_stores.book_id = (SELECT book_id FROM chapters WHERE id=1);
	      AND stores.opening_date > '2015-01-01'
	      ```
	       In order to make this work (for now), the approach is to fetch all of
	      the intermediate tables directly, ultimately winding up with a list of
	      ids which are valid for the final node in the relation string. Then,
	      using this list of IDs, we can further filter the request.
	       ```sql
	      SELECT book_id FROM chapter WHERE id = 1;
	      SELECT store_id FROM books_stores WHERE book_id = <book_id>
	      SELECT * FROM stores WHERE id = <store_id> AND opening_date > '2015-01-01'
	      ```
	       Note that even if Bookshelf could do the above, it would still have to
	      query for intermediate tables when polymorphic relations were involved.
	      One more reason not to use polymorphic relations.
	       @todo investigate this form to see if we can clean up some:
	      ```js
	      this.model.collection().fetch({
	        withRelated: [
	          {
	            'nested.relation': function (qb) {
	              // perform read filtering here
	            }
	          }
	        ]
	      })
	      ```
	       This will be resolved in a future version of Bookshelf.
	       @param {Object}
	        opts - the result of running RequestHandler#query for the request.
	      @param {String}
	        relation - A dot notated relation to find relative to the provided model.
	      @param {Bookshelf.Model} model
	       @returns {Promise(Bookshelf.Model)|Promise(Bookshelf.Collection)} related models.
	    */
	    value: (function (_related) {
	      function related(_x, _x2, _x3, _x4) {
	        return _related.apply(this, arguments);
	      }
	
	      related.toString = function () {
	        return related.toString();
	      };
	
	      return related;
	    })(function (opts, relation, mode, model) {
	      var related = relate(model, relation);
	      var relatedModel, relatedIds;
	      if (related.models) {
	        relatedModel = related.model;
	        relatedIds = related.map(function (m) {
	          return m.id;
	        });
	      } else {
	        relatedModel = related.constructor;
	        relatedIds = related.id;
	      }
	
	      if (mode === 'relation') {
	        opts.baseType = this.typeName();
	        opts.baseId = model.id;
	        opts.baseRelation = relation;
	        opts.fields = {};
	        opts.fields[relatedModel.typeName] = ['id', 'type'];
	      }
	
	      // @todo fix this
	      // currently, the route param :id winds up represented
	      // as filter.id. this can cause collisions when doing
	      // requests like GET /book/1/stores?filter[id]=2
	      // the intent is to limit the stores related to the book to those
	      // with the id one, but the actual impact is that it looks up
	      // book id #2. see RequestHandler#read
	      opts.filter.id = opts.filter.id ? _.intersection(relatedIds, opts.filter.id) : relatedIds;
	
	      return new this.constructor({
	        model: relatedModel
	      }).read(opts, mode);
	    })
	  }, {
	    key: 'byId',
	
	    /**
	      A convenience method to find a single model by id.
	       @param {int} id - the id of the model
	      @param {Array} relations - the relations to fetch with the model
	       @returns {Promise(Bookshelf.Model)} A model and its related models.
	    */
	    value: function byId(id) {
	      var relations = arguments[1] === undefined ? [] : arguments[1];
	
	      return this.model.collection().query(function (qb) {
	        return qb.where({ id: id });
	      }).fetchOne({
	        withRelated: relations
	      })['catch'](TypeError, function (e) {
	        // A TypeError here most likely signifies bad relations passed into withRelated
	        throw Kapow(404, 'Unable to find relations');
	      });
	    }
	  }, {
	    key: 'create',
	
	    /**
	      Creates an object in the database. Returns an instance of the new object.
	       @param {String} method - The name of the method on the model constructor to use for creation.
	      @param {Object} params - The attributes to use for the new model.
	       @returns {Promise(Bookshelf.Model)} A new model.
	    */
	    value: function create(method, params) {
	      if (!method) {
	        throw new Error('No method provided to create with.');
	      }
	      if (!params) {
	        params = {};
	      }
	      var self = this;
	      return destructureRequest(this.model.forge(), params).then(function (destructured) {
	        return self.model[method](destructured.data, destructured.toManyRels);
	      });
	    }
	  }, {
	    key: 'read',
	
	    /**
	      Retrieves a collection of models from the database.
	       @param {Object} opts - the output of Request#query
	       @returns {Promise(Bookshelf.Collection)} Models that match the provided opts.
	    */
	    value: function read(opts, mode) {
	      if (!opts) {
	        opts = {};
	      }
	      var self = this;
	      var model = this.model;
	      var ready = bPromise.resolve();
	      var singleResult = mode === 'single' || (mode === 'related' || mode === 'relation') && !Array.isArray(opts.filter.id);
	
	      // populate the field listing for a table so we know which columns
	      // we can use for sparse fieldsets.
	      if (!this.columns) {
	        ready = model.query().columnInfo().then(function (info) {
	          self.columns = Object.keys(info);
	        });
	      }
	
	      return ready.then(function () {
	        var fields = opts.fields && opts.fields[self.typeName()];
	        // this has to be done here because we can't statically analyze
	        // the columns on a table yet.
	        if (fields) {
	          fields = _.intersection(self.columns, fields);
	          // ensure we always select id as the spec requires this to be present
	          if (!_.contains(fields, 'id')) {
	            fields.push('id');
	          }
	        }
	
	        return model.collection().query(function (qb) {
	          qb = processFilter(model, qb, opts.filter);
	          qb = processSort(self.columns, qb, opts.sort);
	        }).fetch({
	          // adding this in the queryBuilder changes the qb, but fetch still
	          // returns all columns
	          columns: fields,
	          withRelated: _.intersection(self.relations(), opts.include || [])
	        }).then(function (result) {
	          // This is a lot of gross in order to pass this data into the
	          // formatter later. Need to formalize this in some other way.
	          result.mode = mode;
	          result.relations = opts.include;
	          result.singleResult = singleResult;
	          result.baseType = opts.baseType;
	          result.baseId = opts.baseId;
	          result.baseRelation = opts.baseRelation;
	          return result;
	        });
	      });
	    }
	  }, {
	    key: 'update',
	
	    /**
	      Updates a provided model using the provided method.
	       @param {Bookshelf.Model} model
	      @param {String} method - The method on the model instance to use when updating.
	      @param {Object} params - An object containing the params from the request.
	       @returns {Promise(Bookshelf.Model)} The updated model.
	    */
	    value: function update(model, method, params) {
	      if (!method) {
	        throw new Error('No method provided to update or delete with.');
	      }
	      return destructureRequest(model, params).then(function (destructured) {
	        return model[method](destructured.data, destructured.toManyRels, model.toJSON({ shallow: true }));
	      });
	    }
	  }, {
	    key: 'destroy',
	
	    /**
	      Deletes a model. Same implementation as update.
	       @param {Bookshelf.Model} model
	      @param {String} method - The method on the model instance to use when updating.
	      @param {Object} params - An object containing the params from the request.
	       @returns {Promise.Bookshelf.Model} The deleted model.
	    */
	    value: function destroy(model, method, params) {
	      if (!method) {
	        throw new Error('No method provided to update or delete with.');
	      }
	      return destructureRequest(model, params).then(function (destructured) {
	        return model[method](destructured.data, destructured.toManyRels, model.toJSON({ shallow: true }));
	      });
	    }
	  }]);
	
	  return BookshelfAdapter;
	})();
	
	module.exports = BookshelfAdapter;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Kapow = __webpack_require__(7);
	
	var validator = __webpack_require__(8);
	
	function transformErrorFields(input, errors) {
	  return errors.map(function (error) {
	    var field = error.field.replace(/^data/, input);
	    return Kapow(400, field + ' ' + error.message, error);
	  });
	}
	
	module.exports = function (request, endpoint) {
	  var err;
	  var schema = endpoint.schema || {};
	
	  for (var prop in schema) {
	    var validate = validator(schema[prop] || {});
	    if (!validate(request[prop])) {
	      err = transformErrorFields(prop, validate.errors);
	      break;
	    }
	  }
	  return err;
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("lodash");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("bluebird");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("kapow");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("is-my-json-valid");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(5);
	
	var adapterHas = __webpack_require__(21);
	
	module.exports = function (method, config, adapter) {
	  return _.compose(_.flatten, _.compact)([adapterHas(adapter.relations(), config.include, 'relations'), adapterHas(adapter.filters(), Object.keys(config.filter), 'filters'),
	  // this is crap
	  method === 'read' ? null : adapterHas(method === 'create' ? adapter.model : adapter.model.prototype, config.method, 'method')]);
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var RequestHandler = __webpack_require__(23);
	var ResponseFormatter = __webpack_require__(24);
	var jsonApi = __webpack_require__(25);
	var send = __webpack_require__(22);
	
	module.exports = function (config, adapter) {
	  var method = config.method;
	  var responder = config.responder;
	  var handler = new RequestHandler(adapter, config);
	  var formatter = new ResponseFormatter(jsonApi);
	
	  return function (request, response) {
	    var server = 'express'; // detect if hapi or express here
	    var handle = handler[method].bind(handler);
	    var format = formatter[method].bind(formatter, config);
	    var sender = responder ? responder : send[server];
	    var respond = sender.bind(null, response);
	    var errors = handler.validate(request);
	
	    if (errors) {
	      respond(formatter.error(errors));
	    } else {
	      handle(request).then(format).then(respond)['catch'](function (err) {
	        //throw err;
	        return respond(formatter.error(err));
	      });
	    }
	  };
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = function () {
	  var opts = arguments[0] === undefined ? {} : arguments[0];
	
	  if (!opts.routeBuilder) {
	    throw new Error('No route builder specified.');
	  }
	  if (!opts.searchPaths) {
	    opts.searchPaths = [];
	  } else if (!Array.isArray(opts.searchPaths)) {
	    opts.searchPaths = [opts.searchPaths];
	  }
	  return opts;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var path = __webpack_require__(19);
	
	var requireSearch = __webpack_require__(26);
	var requireSilent = __webpack_require__(27);
	
	module.exports = function (name, searchPaths) {
	  var routeModulePath, moduleBasePath;
	  if (typeof name === 'string') {
	    routeModulePath = requireSearch(path.join(name, 'routes'), searchPaths);
	    moduleBasePath = path.dirname(routeModulePath);
	    return {
	      name: name,
	      routes: __webpack_require__(20)(routeModulePath),
	      controller: requireSilent(path.join(moduleBasePath, 'controller'))
	    };
	  }
	  if (!name) {
	    name = {};
	  }
	  if (!name.name) {
	    throw new Error('Unable to parse a module without a name.');
	  }
	  if (!name.routes) {
	    throw new Error('Unable to parse a module without a routes object.');
	  }
	  return name;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = function (input) {
	  return ('/' + (input || '') + '/').replace(/\/\/+/g, '/');
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(5);
	var bPromise = __webpack_require__(6);
	
	exports.addCreate = function (adapter) {
	  adapter.model.create = function (params, toManyRels) {
	    // this should be in a transaction but we don't have access to it yet
	    return this.forge(params).save(null, { method: 'insert' }).tap(function (model) {
	      return bPromise.map(toManyRels, function (rel) {
	        return model.related(rel.name).attach(rel.id);
	      });
	    }).then((function (model) {
	      return this.forge({ id: model.id }).fetch();
	    }).bind(this));
	  };
	};
	
	exports.addUpdate = function (adapter) {
	  // this should be in a transaction but we don't have access to it yet
	  adapter.model.prototype.update = function (params, toManyRels, previous) {
	    var clientState = _.extend(previous, params);
	    return this.save(params, { patch: true, method: 'update' }).tap(function (model) {
	      return bPromise.map(toManyRels, function (rel) {
	        return model.related(rel.name).detach().then(function () {
	          return model.related(rel.name).attach(rel.id);
	        });
	      });
	    }).then(function (model) {
	      // Bookshelf .previousAttributes() doesn't work
	      // See: https://github.com/tgriesser/bookshelf/issues/326#issuecomment-76637186
	      if (_.isEqual(model.toJSON({ shallow: true }), clientState)) {
	        return null;
	      }
	      return model;
	    });
	  };
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(5);
	
	var idFilter = function idFilter(qb, value) {
	  return qb.whereIn('id', value);
	};
	
	module.exports = function (model, query, filterBy) {
	  var filters = model.filters;
	  return _.transform(filterBy, function (result, value, key) {
	    var filter = filters[key];
	    if (key === 'id' && !filter) {
	      filter = idFilter;
	    }
	    return filter ? filter.call(filters, result, value) : result;
	  }, query);
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(5);
	
	// TODO: investigate how to deal with express's query parser
	// converting + into a space.
	function isAscending(key) {
	  return key[0] === '+' || key[0] === ' ';
	}
	
	module.exports = function (validFields, query, sortBy) {
	  return _.chain(sortBy).filter(function (key) {
	    var hasSortDir = key[0] === ' ' || key[0] === '+' || key[0] === '-';
	    var isValidField = _.contains(validFields, key.substring(1));
	    return hasSortDir && isValidField;
	  }).reduce(function (result, key) {
	    var column = key.substring(1);
	    var dir = isAscending(key) ? 'ASC' : 'DESC';
	    return column ? result.orderBy(column, dir) : result;
	  }, query).value();
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(5);
	var bPromise = __webpack_require__(6);
	var Kapow = __webpack_require__(7);
	
	var sanitizeRequestData = __webpack_require__(28);
	
	module.exports = function (model, params) {
	  if (!params) {
	    return bPromise.resolve({});
	  }
	
	  var relations = params.links;
	  var toManyRels = [];
	
	  if (relations) {
	    return bPromise.reduce(Object.keys(relations), function (result, key) {
	      if (!model.related(key)) {
	        throw Kapow(404, 'Unable to find relation "' + key + '"');
	      }
	
	      var fkey;
	      var relation = relations[key].linkage;
	      var relatedData = model.related(key).relatedData;
	      var relationType = relatedData.type;
	
	      // toOne relations
	      if (relationType === 'belongsTo' || relationType === 'hasOne') {
	        fkey = relatedData.foreignKey;
	
	        return relatedData.target.collection().query(function (qb) {
	          if (relation === null) {
	            return qb;
	          }
	          return qb.where({ id: relation.id });
	        }).fetchOne().then(function (model) {
	          if (model === null) {
	            throw Kapow(404, 'Unable to find relation "' + key + '" with id ' + relation.id);
	          }
	          params[fkey] = relation === null ? relation : relation.id;
	          return params;
	        });
	      }
	
	      // toMany relations
	      if (relationType === 'belongsToMany' || relationType === 'hasMany') {
	        return bPromise.map(relation, function (rel) {
	          return relatedData.target.collection().query(function (qb) {
	            return qb.where({ id: rel.id });
	          }).fetchOne().then(function (model) {
	            if (model === null) {
	              throw Kapow(404, 'Unable to find relation "' + key + '" with id ' + rel.id);
	            }
	            return params;
	          });
	        }).then(function () {
	          toManyRels.push({
	            name: key,
	            id: _.pluck(relation, 'id')
	          });
	          return params;
	        });
	      }
	    }, params).then(function (params) {
	      return {
	        data: sanitizeRequestData(params),
	        toManyRels: toManyRels
	      };
	    });
	  }
	
	  return bPromise.resolve({
	    data: sanitizeRequestData(params),
	    toManyRels: toManyRels
	  });
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// Given a Bookshelf model or collection, return a related
	// collection or model.
	'use strict';
	
	function getRelated(relationName, input) {
	  var collection;
	  if (input.models) {
	    // this is fully ridiculous. when looking for the related thing from
	    // a collection of models, i need a single collection to put them in
	    // and this is the only way to make one.
	    collection = input.model.forge().related(relationName).relatedData.target.collection();
	    // now that i have a collection for the relation we're retreiving,
	    // iterate each model and add its related models to the collection
	    return input.reduce(function (result, model) {
	      var related = model.related(relationName);
	      return result.add(related.models ? related.models : related);
	    }, collection);
	  }
	
	  return input.related(relationName);
	}
	
	// Take a Bookshelf model or collection + dot-notated relation
	// string and iterate through it, returning the model(s) in the
	// last relation only.
	module.exports = function (model, relation) {
	  // Bookshelf relations can be requested arbitarily deep as
	  // dot notated strings. Here, we traverse the relation until
	  // we reach the final node. The models in this node are then
	  // returned.
	  var relationSegments = relation.split('.');
	  return relationSegments.reduce(function (source, segment) {
	    return getRelated(segment, source);
	  }, model);
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("path");

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./parse_options": 11,
		"./parse_options.js": 11,
		"./parse_resource": 12,
		"./parse_resource.js": 12,
		"./require_search": 26,
		"./require_search.js": 26,
		"./require_silent": 27,
		"./require_silent.js": 27,
		"./slash_wrap": 13,
		"./slash_wrap.js": 13
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 20;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(5);
	
	function error(type, key) {
	  return 'Model does not have ' + type + ': ' + key + '.';
	}
	
	module.exports = function (available, requested, type) {
	  var message = error.bind(null, type);
	  if (!requested) {
	    return;
	  }
	  if (_.isArray(requested) && _.isArray(available)) {
	    return _.difference(requested, available).map(message);
	  }
	  return available[requested] ? null : message(requested);
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.express = express;
	exports.hapi = hapi;
	var TYPE = 'application/vnd.api+json';
	
	function applyHeaders(response, headers) {
	  Object.keys(headers).forEach(function (header) {
	    response.set(header, headers[header]);
	  });
	}
	
	function express(response, payload) {
	  var code = payload.code;
	  var data = payload.data;
	  var headers = payload.headers;
	  if (headers) {
	    applyHeaders(response, payload.headers);
	  }
	  return response.set('content-type', TYPE).status(code).send(data);
	}
	
	function hapi(response, payload) {
	  var code = payload.code;
	  var data = payload.data;
	  var headers = payload.headers;
	  if (headers) {
	    applyHeaders(response, payload.headers);
	  }
	  return response(data).type(TYPE).code(code);
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var COLLECTION_MODE = 'collection';
	var SINGLE_MODE = 'single';
	var RELATION_MODE = 'relation';
	var RELATED_MODE = 'related';
	
	var _ = __webpack_require__(5);
	var Kapow = __webpack_require__(7);
	
	var throwIfModel = __webpack_require__(29);
	var throwIfNoModel = __webpack_require__(30);
	var verifyAccept = __webpack_require__(31);
	var verifyContentType = __webpack_require__(32);
	var verifyDataObject = __webpack_require__(33);
	var splitStringProps = __webpack_require__(34);
	var verifyClientGeneratedId = __webpack_require__(35);
	
	/**
	  Provides methods for pulling out json-api relevant data from
	  express or hapi request instances. Also provides route level
	  validation.
	*/
	
	var RequestHandler = (function () {
	
	  /**
	    The constructor.
	     @constructs RequestHandler
	    @param {Endpoints.Adapter} adapter
	  */
	
	  function RequestHandler(adapter) {
	    var config = arguments[1] === undefined ? {} : arguments[1];
	
	    _classCallCheck(this, RequestHandler);
	
	    this.config = config;
	    this.adapter = adapter;
	    this.method = config.method;
	
	    // this used to happen in the configureController step
	    // TODO: is this even needed? i believe we're only using
	    // it to generate the location header response for creation
	    // which is brittle and invalid anyway.
	    config.typeName = adapter.typeName();
	  }
	
	  _createClass(RequestHandler, [{
	    key: 'validate',
	
	    /**
	      A function that, given a request, validates the request.
	       @returns {Object} An object containing errors, if any.
	    */
	    value: (function (_validate) {
	      function validate(_x) {
	        return _validate.apply(this, arguments);
	      }
	
	      validate.toString = function () {
	        return validate.toString();
	      };
	
	      return validate;
	    })(function (request) {
	
	      var err;
	      var validators = [verifyAccept];
	
	      if (request.body && request.body.data) {
	        var clientIdCheck = request.method === 'POST' &&
	        // posting to a relation endpoint is for appending
	        // relationships and and such is allowed (must have, really)
	        // ids
	        this.mode(request) !== RELATION_MODE && !this.config.allowClientGeneratedIds;
	        if (clientIdCheck) {
	          validators.push(verifyClientGeneratedId);
	        }
	        validators = validators.concat([verifyContentType, verifyDataObject]);
	      }
	
	      // does this.validators needs a better name? controllerValidator, userValidators?
	      validators = validators.concat(this.config.validators);
	
	      for (var validate in validators) {
	        err = validators[validate](request, this);
	        if (err) {
	          break;
	        }
	      }
	      return err;
	    })
	  }, {
	    key: 'query',
	
	    /**
	      Builds a query object to be passed to Endpoints.Adapter#read.
	       @returns {Object} The query object on a request.
	     */
	    value: (function (_query) {
	      function query(_x2) {
	        return _query.apply(this, arguments);
	      }
	
	      query.toString = function () {
	        return query.toString();
	      };
	
	      return query;
	    })(function (request) {
	      // bits down the chain can mutate this config
	      // on a per-request basis, so we need to clone
	      var config = _.cloneDeep(this.config);
	
	      var query = request.query;
	      var include = query.include;
	      var filter = query.filter;
	      var fields = query.fields;
	      var sort = query.sort;
	      return {
	        include: include ? include.split(',') : config.include,
	        filter: filter ? splitStringProps(filter) : config.filter,
	        fields: fields ? splitStringProps(fields) : config.fields,
	        sort: sort ? sort.split(',') : config.sort
	      };
	    })
	  }, {
	    key: 'mode',
	
	    /**
	      Determines mode based on what request.params are available.
	       @returns {String} the read mode
	    */
	    value: function mode(request) {
	      var hasIdParam = !!request.params.id;
	      var hasRelationParam = !!request.params.relation;
	      var hasRelatedParam = !!request.params.related;
	
	      if (!hasIdParam) {
	        return COLLECTION_MODE;
	      }
	
	      if (!hasRelationParam && !hasRelatedParam) {
	        return SINGLE_MODE;
	      }
	
	      if (hasRelationParam) {
	        return RELATION_MODE;
	      }
	
	      if (hasRelatedParam) {
	        return RELATED_MODE;
	      }
	
	      throw Kapow(400, 'Unable to determine mode based on `request.params` keys.');
	    }
	  }, {
	    key: 'create',
	
	    /**
	      Creates a new instance of a model.
	       @returns {Promise(Bookshelf.Model)} Newly created instance of the Model.
	    */
	    value: function create(request) {
	      var adapter = this.adapter;
	      var method = this.method;
	      var data = request.body.data;
	
	      if (data && data.id) {
	        return adapter.byId(data.id).then(throwIfModel).then(function () {
	          return adapter.create(method, data);
	        });
	      } else {
	        return adapter.create(method, data);
	      }
	    }
	  }, {
	    key: 'read',
	
	    /**
	      Queries the adapter for matching models.
	       @returns {Promise(Bookshelf.Model)|Promise(Bookshelf.Collection)}
	    */
	    value: function read(request) {
	      var adapter = this.adapter;
	      var query = this.query(request);
	      var mode = this.mode(request);
	
	      var params = request.params;
	      var id = params.id;
	
	      var related, findRelated;
	
	      if (mode === RELATED_MODE || mode === RELATION_MODE) {
	        related = params.related || params.relation;
	        findRelated = adapter.related.bind(adapter, query, related, mode);
	        return adapter.byId(id, related).then(throwIfNoModel).then(findRelated);
	      }
	
	      if (id) {
	        // FIXME: this could collide with filter[id]=#
	        query.filter.id = id;
	      }
	      return adapter.read(query, mode);
	    }
	  }, {
	    key: 'update',
	
	    /**
	      Edits a model.
	       @returns {Promise(Bookshelf.Model)}
	    */
	    value: function update(request) {
	      var adapter = this.adapter;
	      var method = this.method;
	      var id = request.params.id;
	      var relation = request.params.relation;
	      var data = request.body.data;
	
	      if (relation) {
	        data = {
	          id: id,
	          type: adapter.typeName(),
	          links: {}
	        };
	        data.links[relation] = { linkage: request.body.data };
	      }
	
	      return adapter.byId(id, [relation]).then(throwIfNoModel).then(function (model) {
	        if (request.method !== 'PATCH') {
	          // FIXME: This will break heterogeneous relations
	          var relationType = data.links[relation].linkage[0].type;
	          var existingRels = model.toJSON()[relation].map(function (rel) {
	            return {
	              id: String(rel.id),
	              type: relationType
	            };
	          });
	
	          if (request.method === 'POST') {
	            data.links[relation].linkage = _.uniq(data.links[relation].linkage.concat(existingRels));
	          }
	
	          if (request.method === 'DELETE') {
	            data.links[relation].linkage = _.reject(existingRels, function (rel) {
	              return _.findWhere(data.links[relation].linkage, rel);
	            });
	          }
	        }
	
	        return adapter.update(model, method, data);
	      })['catch'](function (e) {
	        // FIXME: This may only work for SQLITE3, but tries to be general
	        if (e.message.toLowerCase().indexOf('null') !== -1) {
	          Kapow.wrap(e, 409);
	        }
	        throw e;
	      });
	    }
	  }, {
	    key: 'destroy',
	
	    /**
	      Deletes a model.
	       @returns {Promise(Bookshelf.Model)}
	    */
	    value: function destroy(request) {
	      var method = this.method;
	      var adapter = this.adapter;
	      var id = request.params.id;
	
	      return adapter.byId(id).then(function (model) {
	        if (model) {
	          return adapter.destroy(model, method);
	        }
	      });
	    }
	  }]);
	
	  return RequestHandler;
	})();
	
	module.exports = RequestHandler;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	/**
	  Provides methods for formatting create/read/update/delete requests to
	  json-api compliance. This is mostly concerned about status codes, it
	  passes all the formatting work to a provided formatter.
	*/
	
	var ResponseFormatter = (function () {
	
	  /**
	    The constructor.
	     @constructs ResponseFormatter
	    @param {Function} formatter
	  */
	
	  function ResponseFormatter(formatter) {
	    _classCallCheck(this, ResponseFormatter);
	
	    if (!formatter) {
	      throw new Error('No formatter specified.');
	    }
	    this.formatter = formatter;
	  }
	
	  _createClass(ResponseFormatter, null, [{
	    key: 'method',
	
	    /**
	      Partially applies this.formatter to each method.
	       @param {Function} fn - The method to which the formatter should be applied.
	    */
	    // partially apply this.formatter to each method
	    // this is pretty stupid.
	    value: function method(fn) {
	      return function () {
	        var args = Array.prototype.slice.call(arguments);
	        args.unshift(this.formatter);
	        return fn.apply(null, args);
	      };
	    }
	  }]);
	
	  return ResponseFormatter;
	})();
	
	ResponseFormatter.prototype.error = __webpack_require__(36);
	
	/**
	  Convenience method for creating a new element
	
	  @todo: missing params listing
	*/
	ResponseFormatter.prototype.create = ResponseFormatter.method(__webpack_require__(37));
	
	/**
	  Convenience method for retrieving an element or a collection using
	  the underlying adapter.
	
	  @todo: missing params listing
	*/
	ResponseFormatter.prototype.read = ResponseFormatter.method(__webpack_require__(38));
	
	/**
	  Convenience method for updating one or more attributes on an element
	  using the underlying adapter..
	
	  @todo: missing params listing
	 */
	ResponseFormatter.prototype.update = ResponseFormatter.method(__webpack_require__(39));
	
	/**
	  Convenience method for deleting an element using the underlying adapter.
	
	  @todo: missing params listing
	 */
	ResponseFormatter.prototype.destroy = ResponseFormatter.method(__webpack_require__(40));
	
	module.exports = ResponseFormatter;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(5);
	
	var formatModel = __webpack_require__(41);
	
	/**
	  The role of this module is to take a single model or collection of models
	  and convert them into a representation that is json-api compliant.
	
	  @param {Bookshelf.Model|Bookshelf.Collection} input
	  @param {Object} opts -
	     singleResult: boolean indicating if result should be singular
	                     this is needed because the querying system always
	                     returns a collection--but sometimes you only want
	                     a single item (e.g. /authors/1)
	       relations: an array of dot-notated relation strings. these relations
	                  are attached to the model and need to be extracted into
	                  the top level included collection
	       typeName: the type of the primary resource being requested
	                 i think we might be able to remove this, it should always
	                 be available off the collection
	  @returns {Object|Array} json-api compliant formatted response
	
	*/
	module.exports = function (input) {
	  var opts = arguments[1] === undefined ? {} : arguments[1];
	
	  var included = [];
	  var topLevelLinks;
	
	  /**
	    Recieves each model that was explictly sideloaded
	    For example given a request `GET /author/1?include=books`, each book
	    related to the author would pass through this method.
	     @param {Object} model - Explicitly sideloaded model.
	  */
	  opts.exporter = function (model) {
	    // each model that appears in the top level included object is itself
	    // a bookshelf model that needs to be formatted for json-api compliance
	    // too. we *could* allow links within links by recursing here but i
	    // don't think it is needed... yet?
	    included.push(formatModel(null, model));
	  };
	
	  opts.topLevelLinker = function (links) {
	    topLevelLinks = links;
	  };
	
	  /**
	    @todo formatting?
	    This is is a partially applied version of formatModel.
	  */
	  var formatter = formatModel.bind(null, opts);
	
	  /**
	    Formats every incoming model
	  */
	  var serialized = input.map ? input.map(formatter) : formatter(input);
	
	  /**
	    If we are requesting a single item, return it as an object, not an array.
	  */
	  if (opts.singleResult && _.isArray(serialized)) {
	    serialized = input.length ? serialized[0] : null;
	  }
	
	  /**
	    Prepare json-api compliant output
	  */
	  var output = {
	    data: serialized
	  };
	
	  if (topLevelLinks) {
	    output.links = topLevelLinks;
	  }
	
	  // if the exporter was ever called, we should have objects in
	  // the included array. since it is possible for the same model
	  // to be included more than once, prune any duplicates.
	  if (included.length > 0) {
	    output.included = _(included).flatten().uniq(function (rel) {
	      return rel.type + rel.id;
	    }).value();
	  }
	
	  /**
	   "bam, done."
	  */
	  return output;
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var path = __webpack_require__(19);
	
	var requireSilent = __webpack_require__(27);
	
	module.exports = function (file, searchPaths) {
	  if (!searchPaths) {
	    throw new Error('No searchPaths specified.');
	  }
	  var result = null;
	  var len = searchPaths.length;
	  for (var i = 0; i < len; i++) {
	    var currentPath = path.join(searchPaths[i], file);
	    var notFoundInFoundFile = false;
	    result = requireSilent(currentPath);
	    if (result instanceof Error) {
	      // handle situations where a file is found, but requiring it
	      // still throws a MODULE_NOT_FOUND error because that file
	      // depends on something else which can't be found. boy this
	      // is ugly.
	      notFoundInFoundFile = result.message.indexOf(currentPath) === -1;
	      if (result.code !== 'MODULE_NOT_FOUND' || notFoundInFoundFile) {
	        throw result;
	      } else {
	        result = null;
	      }
	    } else {
	      result = currentPath;
	      break;
	    }
	  }
	  if (!result) {
	    throw new Error('Unable to locate "' + file + '" in search paths: ' + searchPaths.join(', '));
	  }
	  return result;
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = function (file) {
	  try {
	    return __webpack_require__(20)(file);
	  } catch (e) {
	    return e;
	  }
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = function (data) {
	  delete data.type;
	  delete data.links;
	  return data;
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Kapow = __webpack_require__(7);
	
	module.exports = function (model) {
	  if (model) {
	    throw Kapow(409, 'Model with this ID already exists');
	  }
	  return model;
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Kapow = __webpack_require__(7);
	
	module.exports = function (model) {
	  if (!model) {
	    throw Kapow(404, 'Unable to locate model.');
	  }
	
	  // Bookshelf throws an error for any number of unrelated reasons.
	  // json-api requires we throw specific errors for certain situations.
	  if (model instanceof Error) {
	    if (/No rows were affected/.test(model.message) || /Unable to locate model/.test(model.message)) {
	      model = Kapow.wrap(model, 404);
	    } else {
	      model = Kapow.wrap(model, 500);
	    }
	    throw model;
	  }
	
	  return model;
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Kapow = __webpack_require__(7);
	var EXPECTED_ACCEPT = 'application/vnd.api+json';
	
	module.exports = function (request) {
	  var err;
	
	  var headers = request.headers;
	  var accept = headers.accept;
	  var isBrowser = accept && accept.indexOf('text/html') !== -1;
	
	  var isValidAccept = accept && accept.toLowerCase().indexOf(EXPECTED_ACCEPT) === 0;
	
	  if (!isValidAccept && !isBrowser) {
	    err = Kapow(406, 'Content-Type must be "' + EXPECTED_ACCEPT + '"');
	  }
	
	  return err;
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Kapow = __webpack_require__(7);
	var EXPECTED_TYPE = 'application/vnd.api+json';
	
	module.exports = function (request) {
	  var err;
	
	  var contentType = request.headers['content-type'];
	
	  var isValidContentType = contentType && contentType.toLowerCase().indexOf(EXPECTED_TYPE) === 0;
	
	  if (!isValidContentType) {
	    err = Kapow(415, 'Content-Type must be "' + EXPECTED_TYPE + '"');
	  }
	
	  return err;
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(5);
	var Kapow = __webpack_require__(7);
	
	module.exports = function (request, endpoint) {
	  var err, isValidType, id;
	  var data = request.body.data;
	
	  if (!_.isPlainObject(data) && !_.isArray(data)) {
	    err = Kapow(400, 'Primary data must be a single object or array.');
	    return err;
	  }
	
	  if (_.isArray(data)) {
	    isValidType = _.reduce(data, function (isValid, resource) {
	      if (!resource.type || typeof resource.type !== 'string') {
	        isValid = false;
	      }
	      return isValid;
	    }, true);
	  } else {
	    isValidType = typeof data.type === 'string';
	  }
	
	  id = request.params && request.params.id;
	
	  if (!isValidType) {
	    err = Kapow(400, 'Primary data must include a type.');
	    return err;
	  }
	
	  /*
	    // TODO: fix this. at the moment, if you try to do something like
	    // PATCH /books/1/author, the target type of that request is 'books'
	    // when it should actually be 'authors' this disables type checking
	    // for write operations until this can be resolved.
	    if (!writeRelation && type !== endpoint.typeName) {
	      err = Kapow(409, 'Data type does not match endpoint type.');
	      return err;
	    }
	  
	    // TODO: fix this. at the moment, if you try to do something like
	    // PATCH /books/1/author, the target id of that request doesn't match
	    // the actual resource being targetted.
	    if (id && data.id && id !== data.id) {
	      err = Kapow(409, 'Data id does not match endpoint id.');
	      return err;
	    }
	  
	    */
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(5);
	
	module.exports = function (obj) {
	  return _.transform(obj, function (result, n, key) {
	    result[key] = String(n).split(',');
	  });
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(5);
	var Kapow = __webpack_require__(7);
	
	module.exports = function (request) {
	  var err;
	  var data = request.body.data;
	
	  if (Array.isArray(data)) {
	    err = _.some(data, 'id');
	  } else {
	    err = !!data.id;
	  }
	
	  return err ? Kapow(403, 'Client generated IDs are not enabled.') : null;
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(5);
	var Kapow = __webpack_require__(7);
	
	module.exports = function (errs, defaultErr) {
	  var resp;
	
	  defaultErr = defaultErr || 400;
	  errs = errs || [Kapow(defaultErr)];
	
	  if (!Array.isArray(errs)) {
	    errs = [errs];
	  }
	
	  resp = _.transform(errs, function (result, err) {
	    if (!err.httpStatus) {
	      err = Kapow.wrap(err, defaultErr);
	    }
	
	    var httpStatus = err.httpStatus;
	
	    result.code[httpStatus] = result.code[httpStatus] ? result.code[httpStatus] + 1 : 1;
	
	    result.data.errors.push({
	      title: err.title,
	      detail: err.message
	    });
	  }, {
	    code: {},
	    data: {
	      errors: []
	    }
	  });
	
	  resp.code = _.reduce(resp.code, function (result, n, key) {
	    if (!result || n > resp.code[result]) {
	      return key;
	    }
	    return result;
	  }, '');
	
	  return resp;
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = function (formatter, config, data) {
	  return {
	    code: '201',
	    data: formatter(data, {
	      singleResult: true
	    }),
	    headers: {
	      location: '/' + config.typeName + '/' + data.id
	    }
	  };
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Kapow = __webpack_require__(7);
	var error = __webpack_require__(36);
	
	module.exports = function (formatter, config, data) {
	  if ((!data || data.length === 0 && data.singleResult) && data.mode !== 'related') {
	    return error(Kapow(404, 'Resource not found.'));
	  }
	
	  return {
	    code: '200',
	    data: formatter(data, {
	      singleResult: data.singleResult,
	      relations: data.relations,
	      mode: data.mode,
	      baseType: data.baseType,
	      baseId: data.baseId,
	      baseRelation: data.baseRelation
	    })
	  };
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = function (formatter, config, data) {
	  if (data && !config.relationOnly) {
	    return {
	      code: '200',
	      data: formatter(data, config)
	    };
	  }
	  return {
	    code: '204',
	    data: null
	  };
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = function (formatter, config, data) {
	  return {
	    code: '204',
	    data: null
	  };
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(5);
	
	var toOneRelations = __webpack_require__(42);
	var link = __webpack_require__(43);
	
	module.exports = function (opts, model) {
	  var topLevelLinks;
	  var exporter = opts && opts.exporter;
	  var mode = opts && opts.mode;
	  var relations = opts && opts.relations;
	
	  // get the underlying model type
	  var typeName = model.constructor.typeName;
	  // get the list of relations we intend to include (sideload)
	  var linkWithInclude = relations;
	  // get all possible relations for the model
	  var allRelations = model.constructor.relations;
	  // of all listed relations, determine which are toOne relations
	  var toOneRels = toOneRelations(model, allRelations);
	  // get the list of relations we have not included
	  var linkWithoutInclude = _.difference(allRelations, linkWithInclude);
	  // get a json representation of the model, excluding any related data
	  var serialized = model.toJSON({ shallow: true });
	  // json-api requires id be a string -- shouldn't rely on server
	  serialized.id = String(serialized.id);
	  // Include type on primary resource
	  serialized.type = typeName;
	  // Remove foreign keys from model
	  for (var rel in toOneRels) {
	    delete serialized[toOneRels[rel]];
	  }
	  if (mode === 'relation') {
	    topLevelLinks = link(model, opts);
	  } else {
	    serialized.links = link(model, {
	      linkWithInclude: linkWithInclude,
	      linkWithoutInclude: linkWithoutInclude,
	      exporter: exporter
	    });
	  }
	  return serialized;
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = function (model, relations) {
	  if (!Array.isArray(relations)) {
	    return {};
	  }
	  return relations.reduce(function (result, relationName) {
	    // nested relations are specified by dot notated strings
	    // if a relation has a dot in it, it is nested, and therefor
	    // cannot be a toOne relation. ignore it.
	    if (relationName.indexOf('.') !== -1) {
	      return result;
	    }
	    // find related information about the model
	    var relation = model.related(relationName);
	    var relKey = relation.relatedData.foreignKey;
	    // if a relation is specified on the model that doesn't
	    // actually exist, we should bail out quickly.
	    if (!relation) {
	      throw new Error('Relation ' + relationName + ' is not defined on ' + model.tableName);
	    }
	    // is this relation of a kind we care about? if yes, add it!
	    if (relation.relatedData.type === 'belongsTo') {
	      result[relationName] = relKey;
	    }
	    return result;
	  }, {});
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(5);
	
	var relate = __webpack_require__(18);
	
	module.exports = function (model) {
	  var opts = arguments[1] === undefined ? {} : arguments[1];
	
	  var links = {};
	  var primaryType = model.constructor.typeName;
	  var linkWithoutIncludes = opts.linkWithoutInclude || [];
	  var linkWithIncludes = opts.linkWithInclude || [];
	  var exporter = opts.exporter;
	  var topLevelLinker = opts.topLevelLinker;
	
	  if (topLevelLinker) {
	    links.self = '/' + opts.baseType + '/' + opts.baseId + '/links/' + opts.baseRelation;
	    links.related = '/' + opts.baseType + '/' + opts.baseId + '/' + opts.baseRelation;
	    topLevelLinker(links);
	  } else {
	    // To-one link relations that were not explictly included. For
	    // example, a record in a database of employees might look like this:
	    // {
	    //   "id": "1",
	    //   "name": "tyler",
	    //   "position_id": "1"
	    // }
	    // The output of that record in json-api notation would be:
	    // {
	    //   "id": "1",
	    //   "name": "tyler",
	    //   "links": {
	    //     "self": "/employees/1/links/position",
	    //     "related": "/employees/1/position"
	    //   }
	    // }
	    linkWithoutIncludes.reduce(function (result, relationName) {
	      var id = model.id;
	      var link = {
	        self: '/' + primaryType + '/' + id + '/links/' + relationName,
	        related: '/' + primaryType + '/' + id + '/' + relationName
	      };
	      result[relationName] = link;
	      return result;
	    }, links);
	
	    // Link relations that were explictly included, adding the associated
	    // resources to the top level "included" object
	    linkWithIncludes.reduce(function (result, relationName) {
	      var id = model.id;
	      var related = relate(model, relationName);
	      var relatedType = related.model ? related.model.typeName : related.constructor.typeName;
	      var link = {
	        self: '/' + primaryType + '/' + id + '/links/' + relationName,
	        related: '/' + primaryType + '/' + id + '/' + relationName
	      };
	
	      if (related.models) {
	        // if the related is an array, we have a hasMany relation
	        link.linkage = related.reduce(function (result, model) {
	          var id = String(model.id);
	          var linkObject = {
	            id: id,
	            type: relatedType
	          };
	          // exclude nulls and duplicates, the point of a links
	          // entry is to provide linkage to related resources,
	          // not a full mapping of the underlying data
	          if (id && !_.findWhere(result, linkObject)) {
	            result.push(linkObject);
	          }
	          return result;
	        }, []);
	        if (exporter) {
	          related.forEach(function (model) {
	            exporter(model);
	          });
	        }
	      } else {
	        // for singular resources
	        if (related.id) {
	          link.linkage = {
	            type: relatedType,
	            id: String(related.id)
	          };
	        } else {
	          link.linkage = 'null';
	        }
	        if (exporter) {
	          exporter(related);
	        }
	      }
	      result[relationName] = link;
	      return result;
	    }, links);
	
	    // always add a self-referential link
	    links.self = '/' + primaryType + '/' + model.id;
	  }
	
	  return links;
	};

/***/ }
/******/ ])));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODI3ZmUwZmFmNGJiMzI5N2EwMmMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hcHBsaWNhdGlvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRhcHRlci1ib29rc2hlbGYvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZhbGlkYXRlLWpzb24tc2NoZW1hL2luZGV4LmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImxvZGFzaFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImJsdWViaXJkXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwia2Fwb3dcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJpcy1teS1qc29uLXZhbGlkXCIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXIvbGliL3ZhbGlkYXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9jb250cm9sbGVyL2xpYi9oYW5kbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcGxpY2F0aW9uL2xpYi9wYXJzZV9vcHRpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHBsaWNhdGlvbi9saWIvcGFyc2VfcmVzb3VyY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcGxpY2F0aW9uL2xpYi9zbGFzaF93cmFwLmpzIiwid2VicGFjazovLy8uL3NyYy9hZGFwdGVyLWJvb2tzaGVsZi9saWIvYmFzZV9tZXRob2RzLmpzIiwid2VicGFjazovLy8uL3NyYy9hZGFwdGVyLWJvb2tzaGVsZi9saWIvcHJvY2Vzc19maWx0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkYXB0ZXItYm9va3NoZWxmL2xpYi9wcm9jZXNzX3NvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkYXB0ZXItYm9va3NoZWxmL2xpYi9kZXN0cnVjdHVyZV9yZXF1ZXN0X2RhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Zvcm1hdHRlci1qc29uYXBpL2xpYi9yZWxhdGUuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy8uL3NyYy9hcHBsaWNhdGlvbi9saWIgXlxcLlxcLy4qJCIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlci9saWIvYWRhcHRlcl9oYXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXIvbGliL3NlbmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlcXVlc3QtaGFuZGxlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzcG9uc2UtZm9ybWF0dGVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9mb3JtYXR0ZXItanNvbmFwaS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwbGljYXRpb24vbGliL3JlcXVpcmVfc2VhcmNoLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHBsaWNhdGlvbi9saWIvcmVxdWlyZV9zaWxlbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkYXB0ZXItYm9va3NoZWxmL2xpYi9zYW5pdGl6ZV9yZXF1ZXN0X2RhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlcXVlc3QtaGFuZGxlci9saWIvdGhyb3dfaWZfbW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlcXVlc3QtaGFuZGxlci9saWIvdGhyb3dfaWZfbm9fbW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlcXVlc3QtaGFuZGxlci9saWIvdmVyaWZ5X2FjY2VwdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVxdWVzdC1oYW5kbGVyL2xpYi92ZXJpZnlfY29udGVudF90eXBlLmpzIiwid2VicGFjazovLy8uL3NyYy9yZXF1ZXN0LWhhbmRsZXIvbGliL3ZlcmlmeV9kYXRhX29iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVxdWVzdC1oYW5kbGVyL2xpYi9zcGxpdF9zdHJpbmdfcHJvcHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlcXVlc3QtaGFuZGxlci9saWIvdmVyaWZ5X2NsaWVudF9nZW5lcmF0ZWRfaWQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc3BvbnNlLWZvcm1hdHRlci9saWIvZXJyb3IuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc3BvbnNlLWZvcm1hdHRlci9saWIvY3JlYXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9yZXNwb25zZS1mb3JtYXR0ZXIvbGliL3JlYWQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc3BvbnNlLWZvcm1hdHRlci9saWIvdXBkYXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9yZXNwb25zZS1mb3JtYXR0ZXIvbGliL2Rlc3Ryb3kuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Zvcm1hdHRlci1qc29uYXBpL2xpYi9mb3JtYXRfbW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Zvcm1hdHRlci1qc29uYXBpL2xpYi90b19vbmVfcmVsYXRpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9mb3JtYXR0ZXItanNvbmFwaS9saWIvbGluay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esd0M7Ozs7Ozs7OztBQ3RDQSxRQUFPLENBQUMsV0FBVyxHQUFHLG1CQUFPLENBQUMsQ0FBZSxDQUFDLENBQUM7QUFDL0MsUUFBTyxDQUFDLFVBQVUsR0FBRyxtQkFBTyxDQUFDLENBQWMsQ0FBQyxDQUFDO0FBQzdDLFFBQU8sQ0FBQyxnQkFBZ0IsR0FBRyxtQkFBTyxDQUFDLENBQXFCLENBQUMsQ0FBQztBQUMxRCxRQUFPLENBQUMsa0JBQWtCLEdBQUcsbUJBQU8sQ0FBQyxDQUF3QixDQUFDLEM7Ozs7Ozs7Ozs7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QUM1QixjQUFPLE1BQU0sQ0FBQztNQUNmLEVBQUUsS0FBSyxDQUFDLENBQUM7OztBQUdWLFVBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLFdBQVcsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQztJQUNqRDs7QUFFRCxVQUFPLEtBQUssQ0FBQztFQUNkLEMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA4MjdmZTBmYWY0YmIzMjk3YTAyY1xuICoqLyIsImV4cG9ydHMuQXBwbGljYXRpb24gPSByZXF1aXJlKCcuL2FwcGxpY2F0aW9uJyk7XG5leHBvcnRzLkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXInKTtcbmV4cG9ydHMuQm9va3NoZWxmQWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlci1ib29rc2hlbGYnKTtcbmV4cG9ydHMuVmFsaWRhdGVKc29uU2NoZW1hID0gcmVxdWlyZSgnLi92YWxpZGF0ZS1qc29uLXNjaGVtYScpO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvaW5kZXguanNcbiAqKi8iLCJjb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbmNvbnN0IHBhcnNlT3B0aW9ucyA9IHJlcXVpcmUoJy4vbGliL3BhcnNlX29wdGlvbnMnKTtcbmNvbnN0IHBhcnNlUmVzb3VyY2UgPSByZXF1aXJlKCcuL2xpYi9wYXJzZV9yZXNvdXJjZScpO1xuY29uc3Qgc2xhc2hXcmFwID0gcmVxdWlyZSgnLi9saWIvc2xhc2hfd3JhcCcpO1xuXG5jbGFzcyBBcHBsaWNhdGlvbiB7XG5cbiAgY29uc3RydWN0b3IgKG9wdHMpIHtcbiAgICB0aGlzLl9yZXNvdXJjZXMgPSB7fTtcbiAgICB0aGlzLl9lbmRwb2ludHMgPSBbXTtcbiAgICBfLmV4dGVuZCh0aGlzLCBwYXJzZU9wdGlvbnMob3B0cykpO1xuICB9XG5cbiAgcmVzb3VyY2UgKG5hbWUpIHtcbiAgICB2YXIgcmVzb3VyY2UgPSB0aGlzLl9yZXNvdXJjZXNbbmFtZV07XG4gICAgaWYgKCFyZXNvdXJjZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZXNvdXJjZSBcIiR7bmFtZX1cIiBoYXMgbm90IGJlZW4gcmVnaXN0ZXJlZC5gKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc291cmNlO1xuICB9XG5cbiAgcmVnaXN0ZXIgKGlucHV0KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICBpbnB1dC5mb3JFYWNoKHRoaXMucmVnaXN0ZXIuYmluZCh0aGlzKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgcmVzb3VyY2UgPSBwYXJzZVJlc291cmNlKGlucHV0LCB0aGlzLnNlYXJjaFBhdGhzKTtcbiAgICB2YXIgcmVzb3VyY2VOYW1lID0gcmVzb3VyY2UubmFtZTtcbiAgICBpZiAodGhpcy5fcmVzb3VyY2VzW3Jlc291cmNlTmFtZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUmVzb3VyY2UgXCIke3Jlc291cmNlTmFtZX1cIiByZWdpc3RlcmVkIHR3aWNlYCk7XG4gICAgfVxuICAgIHRoaXMuX3Jlc291cmNlc1tyZXNvdXJjZU5hbWVdID0gcmVzb3VyY2U7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBlbmRwb2ludCAocmVzb3VyY2VOYW1lLCBwcmVmaXgpIHtcbiAgICB2YXIgcmVzb3VyY2UgPSB0aGlzLnJlc291cmNlKHJlc291cmNlTmFtZSk7XG4gICAgdmFyIHVybCA9IHNsYXNoV3JhcChwcmVmaXgpICsgcmVzb3VyY2VOYW1lO1xuICAgIHZhciBvdXRwdXQgPSB0aGlzLnJvdXRlQnVpbGRlcihyZXNvdXJjZS5yb3V0ZXMsIHVybCk7XG4gICAgdGhpcy5fZW5kcG9pbnRzLnB1c2goe1xuICAgICAgbmFtZTogcmVzb3VyY2VOYW1lLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICByb3V0ZXI6IG91dHB1dCxcbiAgICAgIHJlc291cmNlOiByZXNvdXJjZVxuICAgIH0pO1xuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICBtYW5pZmVzdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuZHBvaW50cy5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgZW5kcG9pbnQpIHtcbiAgICAgIHZhciByZXNvdXJjZSA9IGVuZHBvaW50LnJlc291cmNlO1xuICAgICAgdmFyIGNhcGFiaWxpdGllcyA9IHJlc291cmNlLmNvbnRyb2xsZXIuY2FwYWJpbGl0aWVzO1xuICAgICAgcmVzdWx0LnB1c2goXy5leHRlbmQoe1xuICAgICAgICBuYW1lOiByZXNvdXJjZS5uYW1lLFxuICAgICAgICB1cmw6IGVuZHBvaW50LnVybFxuICAgICAgfSwgY2FwYWJpbGl0aWVzKSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sIFtdKTtcbiAgfVxuXG4gIGluZGV4ICgpIHtcbiAgICByZXR1cm4gdGhpcy5tYW5pZmVzdCgpLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCByZXNvdXJjZSkge1xuICAgICAgdmFyIGRlZmluaXRpb24gPSByZXNvdXJjZS51cmw7XG4gICAgICB2YXIgaW5jbHVkZXMgPSByZXNvdXJjZS5pbmNsdWRlcztcbiAgICAgIHZhciBmaWx0ZXJzID0gcmVzb3VyY2UuZmlsdGVycztcbiAgICAgIGlmIChpbmNsdWRlcy5sZW5ndGgpIHtcbiAgICAgICAgZGVmaW5pdGlvbiArPSBgP2luY2x1ZGU9eyR7aW5jbHVkZXMuam9pbignLCcpfX1gO1xuICAgICAgfVxuICAgICAgaWYgKGZpbHRlcnMubGVuZ3RoKSB7XG4gICAgICAgIGRlZmluaXRpb24gKz0gZGVmaW5pdGlvbiA9PT0gcmVzb3VyY2UudXJsID8gJz8nIDogJyYnO1xuICAgICAgICBkZWZpbml0aW9uICs9IGB7JHtmaWx0ZXJzLmpvaW4oJywnKX19YDtcbiAgICAgIH1cbiAgICAgIHJlc3VsdFtyZXNvdXJjZS5uYW1lXSA9IGRlZmluaXRpb247XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sIHt9KTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwbGljYXRpb247XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9hcHBsaWNhdGlvbi9pbmRleC5qc1xuICoqLyIsImNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbmNvbnN0IHZhbGlkYXRlID0gcmVxdWlyZSgnLi9saWIvdmFsaWRhdGUnKTtcbmNvbnN0IGhhbmRsZSA9IHJlcXVpcmUoJy4vbGliL2hhbmRsZScpO1xuXG4vKipcbiAgUHJvdmlkZXMgbWV0aG9kcyBmb3IgZ2VuZXJhdGluZyByZXF1ZXN0IGhhbmRsaW5nIGZ1bmN0aW9ucyB0aGF0IGNhblxuICBiZSB1c2VkIGJ5IGFueSBub2RlIGh0dHAgc2VydmVyLlxuKi9cbmNsYXNzIENvbnRyb2xsZXIge1xuXG4gIC8qKlxuICAgIFRoZSBjb25zdHJ1Y3Rvci5cblxuICAgIEBjb25zdHJ1Y3RzIENvbnRyb2xsZXJcbiAgICBAcGFyYW0ge09iamVjdH0gb3B0cyAtIG9wdHMuYWRhcHRlcjogQW4gZW5kcG9pbnRzIGFkYXB0ZXJcbiAgICBAcGFyYW0ge09iamVjdH0gb3B0cyAtIG9wdHMubW9kZWw6IEEgbW9kZWwgY29tcGF0aWJsZSB3aXRoIHRoZSBhZGFwdGVyLlxuICAgIEBwYXJhbSB7T2JqZWN0fSBvcHRzIC0gb3B0cy52YWxpZGF0b3JzOiBBbiBhcnJheSBvZiB2YWxpZGF0aW5nIG1ldGhvZHMuXG4gICAgQHBhcmFtIHtPYmplY3R9IG9wdHMgLSBvcHRzLmFsbG93Q2xpZW50R2VuZXJhdGVkSWRzOiBib29sZWFuIGluZGljYXRpbmcgdGhpc1xuICAqL1xuICBjb25zdHJ1Y3RvciAob3B0cz17fSkge1xuICAgIGlmICghb3B0cy5hZGFwdGVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGFkYXB0ZXIgc3BlY2lmaWVkLicpO1xuICAgIH1cbiAgICBpZiAoIW9wdHMubW9kZWwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gbW9kZWwgc3BlY2lmaWVkLicpO1xuICAgIH1cbiAgICB2YXIgY29uZmlnID0gdGhpcy5jb25maWcgPSBfLmV4dGVuZCh7XG4gICAgICB2YWxpZGF0b3JzOiBbXSxcbiAgICAgIGFsbG93Q2xpZW50R2VuZXJhdGVkSWRzOiBmYWxzZVxuICAgIH0sIG9wdHMpO1xuXG4gICAgdGhpcy5fYWRhcHRlciA9IG5ldyBjb25maWcuYWRhcHRlcih7XG4gICAgICBtb2RlbDogY29uZmlnLm1vZGVsXG4gICAgfSk7XG4gIH1cblxuICBnZXQgY2FwYWJpbGl0aWVzKCkge1xuICAgIC8vIFRPRE86IGluY2x1ZGUgdGhpcy5jb25maWc/XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlcnM6IHRoaXMuX2FkYXB0ZXIuZmlsdGVycygpLFxuICAgICAgaW5jbHVkZXM6IHRoaXMuX2FkYXB0ZXIucmVsYXRpb25zKClcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAgVXNlZCBmb3IgZ2VuZXJhdGluZyBDUlVEIChjcmVhdGUsIHJlYWQsIHVwZGF0ZSwgZGVzdHJveSkgbWV0aG9kcy5cblxuICAgIEBwYXJhbSB7U3RyaW5nfSBtZXRob2QgLSBUaGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24gdG8gYmUgY3JlYXRlZC5cbiAgICBAcmV0dXJucyB7RnVuY3Rpb259IC0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IH0gKG5vZGUgaHR0cCBjb21wYXRpYmxlIHJlcXVlc3QgaGFuZGxlcilcbiAgKi9cbiAgc3RhdGljIG1ldGhvZCAobWV0aG9kKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICB2YXIgY29uZmlnID0gXy5leHRlbmQoe1xuICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgaW5jbHVkZTogW10sXG4gICAgICAgIGZpbHRlcjoge30sXG4gICAgICAgIGZpZWxkczoge30sXG4gICAgICAgIHNvcnQ6IFtdLFxuICAgICAgICBzY2hlbWE6IHt9LFxuICAgICAgfSwgdGhpcy5jb25maWcsIG9wdHMpO1xuICAgICAgdmFyIHZhbGlkYXRpb25GYWlsdXJlcyA9IHZhbGlkYXRlKG1ldGhvZCwgY29uZmlnLCB0aGlzLl9hZGFwdGVyKTtcbiAgICAgIGlmICh2YWxpZGF0aW9uRmFpbHVyZXMubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcih2YWxpZGF0aW9uRmFpbHVyZXMuam9pbignXFxuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhhbmRsZShjb25maWcsIHRoaXMuX2FkYXB0ZXIpO1xuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZXh0ZW5kIChwcm9wcz17fSkge1xuICAgIHJldHVybiBjbGFzcyBDb250cm9sbGVyIGV4dGVuZHMgdGhpcyB7XG4gICAgICBjb25zdHJ1Y3RvcihvcHRzPXt9KSB7XG4gICAgICAgIHN1cGVyKF8uZXh0ZW5kKHt9LCBwcm9wcywgb3B0cykpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxufVxuXG4vKipcbiAgUmV0dXJucyBhIHJlcXVlc3QgaGFuZGxpbmcgZnVuY3Rpb24gY3VzdG9taXplZCB0byBoYW5kbGUgY3JlYXRlIHJlcXVlc3RzLlxuKi9cbkNvbnRyb2xsZXIucHJvdG90eXBlLmNyZWF0ZSA9IENvbnRyb2xsZXIubWV0aG9kKCdjcmVhdGUnKTtcblxuLyoqXG4gIFJldHVybnMgYSByZXF1ZXN0IGhhbmRsaW5nIGZ1bmN0aW9uIGN1c3RvbWl6ZWQgdG8gaGFuZGxlIHJlYWQgcmVxdWVzdHMuXG4qL1xuQ29udHJvbGxlci5wcm90b3R5cGUucmVhZCA9IENvbnRyb2xsZXIubWV0aG9kKCdyZWFkJyk7XG5cbi8qKlxuICBSZXR1cm5zIGEgcmVxdWVzdCBoYW5kbGluZyBmdW5jdGlvbiBjdXN0b21pemVkIHRvIGhhbmRsZSB1cGRhdGUgcmVxdWVzdHMuXG4qL1xuQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlID0gQ29udHJvbGxlci5tZXRob2QoJ3VwZGF0ZScpO1xuXG4vKipcbiAgUmV0dXJucyBhIHJlcXVlc3QgaGFuZGxpbmcgZnVuY3Rpb24gY3VzdG9taXplZCB0byBoYW5kbGUgZGVzdHJveSByZXF1ZXN0cy5cbiovXG5Db250cm9sbGVyLnByb3RvdHlwZS5kZXN0cm95ID0gQ29udHJvbGxlci5tZXRob2QoJ2Rlc3Ryb3knKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlci9pbmRleC5qc1xuICoqLyIsImNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuY29uc3QgYlByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xuY29uc3QgYmFzZU1ldGhvZHMgPSByZXF1aXJlKCcuL2xpYi9iYXNlX21ldGhvZHMnKTtcbmNvbnN0IHByb2Nlc3NGaWx0ZXIgPSByZXF1aXJlKCcuL2xpYi9wcm9jZXNzX2ZpbHRlcicpO1xuY29uc3QgcHJvY2Vzc1NvcnQgPSByZXF1aXJlKCcuL2xpYi9wcm9jZXNzX3NvcnQnKTtcbmNvbnN0IGRlc3RydWN0dXJlUmVxdWVzdCA9IHJlcXVpcmUoJy4vbGliL2Rlc3RydWN0dXJlX3JlcXVlc3RfZGF0YScpO1xuY29uc3QgS2Fwb3cgPSByZXF1aXJlKCdrYXBvdycpO1xuXG4vLyBGSVhNRTogZGVjaWRlIGlmIHRoaXMgcmVzcG9uc2liaWxpdHkgbGl2ZXMgaW4gdGhlIGFkYXB0ZXIgb3Jcbi8vIGluIHRoZSBmb3JtYXR0ZXIuIGkgdGhpbmsgYWRhcHRlcj8gdGhpcyB3b3VsZCBtZWFuIGEgd2hvbGVzYWxlXG4vLyByZWZhY3RvcmluZyBvZiB0aGUganNvbmFwaSBmb3JtYXR0ZXIgdG8gd29yayB3aXRoIGFkYXB0ZXJzXG4vLyByYXRoZXIgdGhhbiBib29rc2hlbGYgbW9kZWxzLiB0aGF0IG1pZ2h0IG1ha2UgYSBsb3Qgb2Ygc2Vuc2UuXG5jb25zdCByZWxhdGUgPSByZXF1aXJlKCcuLi9mb3JtYXR0ZXItanNvbmFwaS9saWIvcmVsYXRlJyk7XG5cbi8qKlxuICBBbiBhZGFwdGVyIHRoYXQgYWxsb3dzIGVuZHBvaW50cyB0byBpbnRlcmFjdCB3aXRoIGEgQm9va3NoZWxmIG1vZGVsLlxuKi9cbmNsYXNzIEJvb2tzaGVsZkFkYXB0ZXIge1xuXG4gIC8qKlxuICAgIFRoZSBjb25zdHJ1Y3Rvci5cbiAgICBAY29uc3RydWN0cyBCb29rc2hlbGZBZGFwdGVyXG4gICAgQHBhcmFtIHtPYmplY3R9IG9wdHMgLSBvcHRzLm1vZGVsOiBhIGJvb2tzaGVsZiBtb2RlbC5cbiAgKi9cbiAgY29uc3RydWN0b3IgKG9wdHM9e30pIHtcbiAgICB2YXIgbW9kZWwgPSBvcHRzLm1vZGVsO1xuICAgIGlmICghbW9kZWwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gYm9va3NoZWxmIG1vZGVsIHNwZWNpZmllZC4nKTtcbiAgICB9XG4gICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuXG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0aG9kcyBvbiB0aGUgbW9kZWwgaWYgbmVlZGVkLiBldmVudHVhbGx5IHNvbWV0aGluZ1xuICAgIC8vIGxpa2UgdGhpcyBzaG91bGQgZXhpc3QgaW4gYm9va3NoZWxmIG9yIGFub3RoZXIgaGlnaGVyIG9yZGVyIGxpYnJhcnlcbiAgICAvLyBuYXRpdmVseS5cbiAgICBpZiAoIW1vZGVsLmNyZWF0ZSkge1xuICAgICAgYmFzZU1ldGhvZHMuYWRkQ3JlYXRlKHRoaXMpO1xuICAgIH1cbiAgICBpZiAoIW1vZGVsLnByb3RvdHlwZS51cGRhdGUpIHtcbiAgICAgIGJhc2VNZXRob2RzLmFkZFVwZGF0ZSh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICBBbiBhcnJheSBvZiBmaWx0ZXJzIGF2YWlsYWJsZSBvbiB0aGUgdW5kZXJseWluZyBtb2RlbC4gVGhpcyBjb250cm9sc1xuICAgIHdoaWNoIGZpbHRlcnMgd2lsbCBiZSByZWNvZ25pemVkIGJ5IGEgcmVxdWVzdC5cblxuICAgIEZvciBleGFtcGxlLCBgR0VUIC9hdXRob3JzP2ZpbHRlcltuYW1lXT1Kb2huYCB3b3VsZCBvbmx5IGZpbHRlciBieSBuYW1lXG4gICAgaWYgJ25hbWUnIHdhcyBpbmNsdWRlZCBpbiB0aGUgYXJyYXkgcmV0dXJuZWQgYnkgdGhpcyBmdW5jdGlvbi5cblxuICAgIEByZXR1cm5zIHtBcnJheX0gQW4gYXJyYXkgb2Ygb2JqZWN0IGlkcy5cbiAgKi9cbiAgZmlsdGVycyAoKSB7XG4gICAgdmFyIGZpbHRlcnMgPSBPYmplY3Qua2V5cyh0aGlzLm1vZGVsLmZpbHRlcnMgfHwge30pO1xuICAgIC8vIFRPRE86IHJlbW92ZSB0aGlzIGFuZCBoYXZlIHRoZSBpZCBmaWx0ZXIgYmUgcHJlc2VudCBieVxuICAgIC8vIGRlZmF1bHQgb24gYWxsIGJvb2tzaGVsZiBtb2RlbHMuIHRoZSBhbHRlcm5hdGl2ZSB0byB0aGlzXG4gICAgLy8gaXMgcHV0dGluZyB0aGUgaWQgZmlsdGVyIGluIGV2ZXJ5IG1vZGVsIGFzIGJvaWxlcnBsYXRlXG4gICAgLy8gb3Igd2FpdGluZyB1bnRpbCB0aGUgbmV4dCB2ZXJzaW9uIG9mIGJvb2tzaGVsZiwgd2hlcmVcbiAgICAvLyBzb21ldGhpbmcgbGlrZSB0aGlzIGNhbiBiZSBhZGRlZCBieSBkZWZhdWx0LlxuICAgIGlmIChmaWx0ZXJzLmluZGV4T2YoJ2lkJykgPT09IC0xKSB7XG4gICAgICBmaWx0ZXJzLnB1c2goJ2lkJyk7XG4gICAgfVxuICAgIHJldHVybiBmaWx0ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAgUHJvdmlkZXMgYW4gYXJyYXkgb2YgdmFsaWQgcmVsYXRpb25zIG9uIHRoZSB1bmRlcmx5aW5nIG1vZGVsLiBUaGlzIGNvbnRyb2xzXG4gICAgd2hpY2ggcmVsYXRpb25zIGNhbiBiZSBpbmNsdWRlZCBpbiBhIHJlcXVlc3QuXG5cbiAgICBGb3IgZXhhbXBsZSwgYEdFVCAvYXV0aG9ycy8xP2luY2x1ZGU9Ym9va3NgIHdvdWxkIG9ubHkgaW5jbHVkZSByZWxhdGVkXG4gICAgYm9va3MgaWYgYGJvb2tzYCB3YXMgaW5jbHVkZWQgaW4gdGhlIGFycmF5IHJldHVybmVkIGJ5IHRoaXMgZnVuY3Rpb24uXG5cbiAgICBAcmV0dXJucyB7QXJyYXl9IEFuIGFycmF5IGNvbnRhaW5pbmcgcmVsYXRpb25zIG9uIHRoZSBtb2RlbC5cbiAgICovXG4gIHJlbGF0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWwucmVsYXRpb25zIHx8IFtdO1xuICB9XG5cbiAgLyoqXG4gICAgUHJvdmlkZXMgdGhlIHR5cGUgbmFtZSBvZiB0aGUgdW5kZXJseWluZyBtb2RlbC4gVGhpcyBjb250cm9scyB0aGVcbiAgICB2YWx1ZSBvZiB0aGUgYHR5cGVgIHByb3BlcnR5IGluIHJlc3BvbnNlcy5cblxuICAgIEByZXR1cm5zIHtTdHJpbmd9XG4gICovXG4gIHR5cGVOYW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbC50eXBlTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgIFJldHVybnMgdGhlIG1vZGVsIG9yIGNvbGxlY3Rpb24gb2YgbW9kZWxzIHJlbGF0ZWQgdG8gYSBnaXZlbiBtb2RlbC4gVGhpc1xuICAgIG1ha2VzIGl0IHBvc3NpYmxlIHRvIHN1cHBvcnQgcmVxdWVzdHMgbGlrZTpcbiAgICBHRVQgL2NoYXB0ZXJzLzEvYm9vay5zdG9yZXM/ZmlsdGVyW29wZW5lZF9hZnRlcl09MjAxNS0wMS0wMVxuXG4gICAgQ3VycmVudGx5LCB0aGlzIGlzIGV4dHJlbWVseSBpbmVmZmljaWVudC4gSGVyZSdzIHdoeTpcblxuICAgIEJvb2tzaGVsZiBjYW5ub3QgY29tcG9zZSBhIHF1ZXJ5IGxpa2UgdGhpc1xuICAgIGBgYHNxbFxuICAgIFNFTEVDVCBzdG9yZXMuKlxuICAgIEZST00gc3RvcmVzXG4gICAgSU5ORVIgSk9JTiBib29rc19zdG9yZXMgT04gKGJvb2tzX3N0b3Jlcy5zdG9yZV9pZCA9IHN0b3Jlcy5pZClcbiAgICBXSEVSRSBib29rc19zdG9yZXMuYm9va19pZCA9IChTRUxFQ1QgYm9va19pZCBGUk9NIGNoYXB0ZXJzIFdIRVJFIGlkPTEpO1xuICAgIEFORCBzdG9yZXMub3BlbmluZ19kYXRlID4gJzIwMTUtMDEtMDEnXG4gICAgYGBgXG5cbiAgICBJbiBvcmRlciB0byBtYWtlIHRoaXMgd29yayAoZm9yIG5vdyksIHRoZSBhcHByb2FjaCBpcyB0byBmZXRjaCBhbGwgb2ZcbiAgICB0aGUgaW50ZXJtZWRpYXRlIHRhYmxlcyBkaXJlY3RseSwgdWx0aW1hdGVseSB3aW5kaW5nIHVwIHdpdGggYSBsaXN0IG9mXG4gICAgaWRzIHdoaWNoIGFyZSB2YWxpZCBmb3IgdGhlIGZpbmFsIG5vZGUgaW4gdGhlIHJlbGF0aW9uIHN0cmluZy4gVGhlbixcbiAgICB1c2luZyB0aGlzIGxpc3Qgb2YgSURzLCB3ZSBjYW4gZnVydGhlciBmaWx0ZXIgdGhlIHJlcXVlc3QuXG5cbiAgICBgYGBzcWxcbiAgICBTRUxFQ1QgYm9va19pZCBGUk9NIGNoYXB0ZXIgV0hFUkUgaWQgPSAxO1xuICAgIFNFTEVDVCBzdG9yZV9pZCBGUk9NIGJvb2tzX3N0b3JlcyBXSEVSRSBib29rX2lkID0gPGJvb2tfaWQ+XG4gICAgU0VMRUNUICogRlJPTSBzdG9yZXMgV0hFUkUgaWQgPSA8c3RvcmVfaWQ+IEFORCBvcGVuaW5nX2RhdGUgPiAnMjAxNS0wMS0wMSdcbiAgICBgYGBcblxuICAgIE5vdGUgdGhhdCBldmVuIGlmIEJvb2tzaGVsZiBjb3VsZCBkbyB0aGUgYWJvdmUsIGl0IHdvdWxkIHN0aWxsIGhhdmUgdG9cbiAgICBxdWVyeSBmb3IgaW50ZXJtZWRpYXRlIHRhYmxlcyB3aGVuIHBvbHltb3JwaGljIHJlbGF0aW9ucyB3ZXJlIGludm9sdmVkLlxuICAgIE9uZSBtb3JlIHJlYXNvbiBub3QgdG8gdXNlIHBvbHltb3JwaGljIHJlbGF0aW9ucy5cblxuICAgIEB0b2RvIGludmVzdGlnYXRlIHRoaXMgZm9ybSB0byBzZWUgaWYgd2UgY2FuIGNsZWFuIHVwIHNvbWU6XG4gICAgYGBganNcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24oKS5mZXRjaCh7XG4gICAgICB3aXRoUmVsYXRlZDogW1xuICAgICAgICB7XG4gICAgICAgICAgJ25lc3RlZC5yZWxhdGlvbic6IGZ1bmN0aW9uIChxYikge1xuICAgICAgICAgICAgLy8gcGVyZm9ybSByZWFkIGZpbHRlcmluZyBoZXJlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSlcbiAgICBgYGBcblxuICAgIFRoaXMgd2lsbCBiZSByZXNvbHZlZCBpbiBhIGZ1dHVyZSB2ZXJzaW9uIG9mIEJvb2tzaGVsZi5cblxuICAgIEBwYXJhbSB7T2JqZWN0fVxuICAgICAgb3B0cyAtIHRoZSByZXN1bHQgb2YgcnVubmluZyBSZXF1ZXN0SGFuZGxlciNxdWVyeSBmb3IgdGhlIHJlcXVlc3QuXG4gICAgQHBhcmFtIHtTdHJpbmd9XG4gICAgICByZWxhdGlvbiAtIEEgZG90IG5vdGF0ZWQgcmVsYXRpb24gdG8gZmluZCByZWxhdGl2ZSB0byB0aGUgcHJvdmlkZWQgbW9kZWwuXG4gICAgQHBhcmFtIHtCb29rc2hlbGYuTW9kZWx9IG1vZGVsXG5cbiAgICBAcmV0dXJucyB7UHJvbWlzZShCb29rc2hlbGYuTW9kZWwpfFByb21pc2UoQm9va3NoZWxmLkNvbGxlY3Rpb24pfSByZWxhdGVkIG1vZGVscy5cbiAgKi9cbiAgcmVsYXRlZCAob3B0cywgcmVsYXRpb24sIG1vZGUsIG1vZGVsKSB7XG4gICAgdmFyIHJlbGF0ZWQgPSByZWxhdGUobW9kZWwsIHJlbGF0aW9uKTtcbiAgICB2YXIgcmVsYXRlZE1vZGVsLCByZWxhdGVkSWRzO1xuICAgIGlmIChyZWxhdGVkLm1vZGVscykge1xuICAgICAgcmVsYXRlZE1vZGVsID0gcmVsYXRlZC5tb2RlbDtcbiAgICAgIHJlbGF0ZWRJZHMgPSByZWxhdGVkLm1hcChmdW5jdGlvbiAobSkgeyByZXR1cm4gbS5pZDsgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlbGF0ZWRNb2RlbCA9IHJlbGF0ZWQuY29uc3RydWN0b3I7XG4gICAgICByZWxhdGVkSWRzID0gcmVsYXRlZC5pZDtcbiAgICB9XG5cbiAgICBpZiAobW9kZSA9PT0gJ3JlbGF0aW9uJykge1xuICAgICAgb3B0cy5iYXNlVHlwZSA9IHRoaXMudHlwZU5hbWUoKTtcbiAgICAgIG9wdHMuYmFzZUlkID0gbW9kZWwuaWQ7XG4gICAgICBvcHRzLmJhc2VSZWxhdGlvbiA9IHJlbGF0aW9uO1xuICAgICAgb3B0cy5maWVsZHMgPSB7fTtcbiAgICAgIG9wdHMuZmllbGRzW3JlbGF0ZWRNb2RlbC50eXBlTmFtZV0gPSBbJ2lkJywgJ3R5cGUnXTtcbiAgICB9XG5cbiAgICAvLyBAdG9kbyBmaXggdGhpc1xuICAgIC8vIGN1cnJlbnRseSwgdGhlIHJvdXRlIHBhcmFtIDppZCB3aW5kcyB1cCByZXByZXNlbnRlZFxuICAgIC8vIGFzIGZpbHRlci5pZC4gdGhpcyBjYW4gY2F1c2UgY29sbGlzaW9ucyB3aGVuIGRvaW5nXG4gICAgLy8gcmVxdWVzdHMgbGlrZSBHRVQgL2Jvb2svMS9zdG9yZXM/ZmlsdGVyW2lkXT0yXG4gICAgLy8gdGhlIGludGVudCBpcyB0byBsaW1pdCB0aGUgc3RvcmVzIHJlbGF0ZWQgdG8gdGhlIGJvb2sgdG8gdGhvc2VcbiAgICAvLyB3aXRoIHRoZSBpZCBvbmUsIGJ1dCB0aGUgYWN0dWFsIGltcGFjdCBpcyB0aGF0IGl0IGxvb2tzIHVwXG4gICAgLy8gYm9vayBpZCAjMi4gc2VlIFJlcXVlc3RIYW5kbGVyI3JlYWRcbiAgICBvcHRzLmZpbHRlci5pZCA9IG9wdHMuZmlsdGVyLmlkID9cbiAgICAgIF8uaW50ZXJzZWN0aW9uKHJlbGF0ZWRJZHMsIG9wdHMuZmlsdGVyLmlkKVxuICAgICAgOiByZWxhdGVkSWRzO1xuXG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHtcbiAgICAgIG1vZGVsOiByZWxhdGVkTW9kZWxcbiAgICB9KS5yZWFkKG9wdHMsIG1vZGUpO1xuICB9XG5cbiAgLyoqXG4gICAgQSBjb252ZW5pZW5jZSBtZXRob2QgdG8gZmluZCBhIHNpbmdsZSBtb2RlbCBieSBpZC5cblxuICAgIEBwYXJhbSB7aW50fSBpZCAtIHRoZSBpZCBvZiB0aGUgbW9kZWxcbiAgICBAcGFyYW0ge0FycmF5fSByZWxhdGlvbnMgLSB0aGUgcmVsYXRpb25zIHRvIGZldGNoIHdpdGggdGhlIG1vZGVsXG5cbiAgICBAcmV0dXJucyB7UHJvbWlzZShCb29rc2hlbGYuTW9kZWwpfSBBIG1vZGVsIGFuZCBpdHMgcmVsYXRlZCBtb2RlbHMuXG4gICovXG4gIGJ5SWQgKGlkLCByZWxhdGlvbnM9W10pIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbC5jb2xsZWN0aW9uKCkucXVlcnkoZnVuY3Rpb24gKHFiKSB7XG4gICAgICByZXR1cm4gcWIud2hlcmUoe2lkOmlkfSk7XG4gICAgfSkuZmV0Y2hPbmUoe1xuICAgICAgd2l0aFJlbGF0ZWQ6IHJlbGF0aW9uc1xuICAgIH0pLmNhdGNoKFR5cGVFcnJvciwgZnVuY3Rpb24oZSkge1xuICAgICAgLy8gQSBUeXBlRXJyb3IgaGVyZSBtb3N0IGxpa2VseSBzaWduaWZpZXMgYmFkIHJlbGF0aW9ucyBwYXNzZWQgaW50byB3aXRoUmVsYXRlZFxuICAgICAgdGhyb3cgS2Fwb3coNDA0LCAnVW5hYmxlIHRvIGZpbmQgcmVsYXRpb25zJyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICBDcmVhdGVzIGFuIG9iamVjdCBpbiB0aGUgZGF0YWJhc2UuIFJldHVybnMgYW4gaW5zdGFuY2Ugb2YgdGhlIG5ldyBvYmplY3QuXG5cbiAgICBAcGFyYW0ge1N0cmluZ30gbWV0aG9kIC0gVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCBvbiB0aGUgbW9kZWwgY29uc3RydWN0b3IgdG8gdXNlIGZvciBjcmVhdGlvbi5cbiAgICBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gVGhlIGF0dHJpYnV0ZXMgdG8gdXNlIGZvciB0aGUgbmV3IG1vZGVsLlxuXG4gICAgQHJldHVybnMge1Byb21pc2UoQm9va3NoZWxmLk1vZGVsKX0gQSBuZXcgbW9kZWwuXG4gICovXG4gIGNyZWF0ZSAobWV0aG9kLCBwYXJhbXMpIHtcbiAgICBpZiAoIW1ldGhvZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgcHJvdmlkZWQgdG8gY3JlYXRlIHdpdGguJyk7XG4gICAgfVxuICAgIGlmICghcGFyYW1zKSB7XG4gICAgICBwYXJhbXMgPSB7fTtcbiAgICB9XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBkZXN0cnVjdHVyZVJlcXVlc3QodGhpcy5tb2RlbC5mb3JnZSgpLCBwYXJhbXMpLnRoZW4oZnVuY3Rpb24oZGVzdHJ1Y3R1cmVkKSB7XG4gICAgICByZXR1cm4gc2VsZi5tb2RlbFttZXRob2RdKGRlc3RydWN0dXJlZC5kYXRhLCBkZXN0cnVjdHVyZWQudG9NYW55UmVscyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICBSZXRyaWV2ZXMgYSBjb2xsZWN0aW9uIG9mIG1vZGVscyBmcm9tIHRoZSBkYXRhYmFzZS5cblxuICAgIEBwYXJhbSB7T2JqZWN0fSBvcHRzIC0gdGhlIG91dHB1dCBvZiBSZXF1ZXN0I3F1ZXJ5XG5cbiAgICBAcmV0dXJucyB7UHJvbWlzZShCb29rc2hlbGYuQ29sbGVjdGlvbil9IE1vZGVscyB0aGF0IG1hdGNoIHRoZSBwcm92aWRlZCBvcHRzLlxuICAqL1xuICByZWFkIChvcHRzLCBtb2RlKSB7XG4gICAgaWYgKCFvcHRzKSB7XG4gICAgICBvcHRzID0ge307XG4gICAgfVxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbW9kZWwgPSB0aGlzLm1vZGVsO1xuICAgIHZhciByZWFkeSA9IGJQcm9taXNlLnJlc29sdmUoKTtcbiAgICB2YXIgc2luZ2xlUmVzdWx0ID0gbW9kZSA9PT0gJ3NpbmdsZScgfHxcbiAgICAgICgobW9kZSA9PT0gJ3JlbGF0ZWQnIHx8IG1vZGUgPT09ICdyZWxhdGlvbicpICYmICFBcnJheS5pc0FycmF5KG9wdHMuZmlsdGVyLmlkKSk7XG5cbiAgICAvLyBwb3B1bGF0ZSB0aGUgZmllbGQgbGlzdGluZyBmb3IgYSB0YWJsZSBzbyB3ZSBrbm93IHdoaWNoIGNvbHVtbnNcbiAgICAvLyB3ZSBjYW4gdXNlIGZvciBzcGFyc2UgZmllbGRzZXRzLlxuICAgIGlmICghdGhpcy5jb2x1bW5zKSB7XG4gICAgICByZWFkeSA9IG1vZGVsLnF1ZXJ5KCkuY29sdW1uSW5mbygpLnRoZW4oZnVuY3Rpb24gKGluZm8pIHtcbiAgICAgICAgc2VsZi5jb2x1bW5zID0gT2JqZWN0LmtleXMoaW5mbyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVhZHkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZmllbGRzID0gb3B0cy5maWVsZHMgJiYgb3B0cy5maWVsZHNbc2VsZi50eXBlTmFtZSgpXTtcbiAgICAgIC8vIHRoaXMgaGFzIHRvIGJlIGRvbmUgaGVyZSBiZWNhdXNlIHdlIGNhbid0IHN0YXRpY2FsbHkgYW5hbHl6ZVxuICAgICAgLy8gdGhlIGNvbHVtbnMgb24gYSB0YWJsZSB5ZXQuXG4gICAgICBpZiAoZmllbGRzKSB7XG4gICAgICAgIGZpZWxkcyA9IF8uaW50ZXJzZWN0aW9uKHNlbGYuY29sdW1ucywgZmllbGRzKTtcbiAgICAgICAgLy8gZW5zdXJlIHdlIGFsd2F5cyBzZWxlY3QgaWQgYXMgdGhlIHNwZWMgcmVxdWlyZXMgdGhpcyB0byBiZSBwcmVzZW50XG4gICAgICAgIGlmICghXy5jb250YWlucyhmaWVsZHMsICdpZCcpKSB7XG4gICAgICAgICAgZmllbGRzLnB1c2goJ2lkJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1vZGVsLmNvbGxlY3Rpb24oKS5xdWVyeShmdW5jdGlvbiAocWIpIHtcbiAgICAgICAgcWIgPSBwcm9jZXNzRmlsdGVyKG1vZGVsLCBxYiwgb3B0cy5maWx0ZXIpO1xuICAgICAgICBxYiA9IHByb2Nlc3NTb3J0KHNlbGYuY29sdW1ucywgcWIsIG9wdHMuc29ydCk7XG4gICAgICB9KS5mZXRjaCh7XG4gICAgICAgIC8vIGFkZGluZyB0aGlzIGluIHRoZSBxdWVyeUJ1aWxkZXIgY2hhbmdlcyB0aGUgcWIsIGJ1dCBmZXRjaCBzdGlsbFxuICAgICAgICAvLyByZXR1cm5zIGFsbCBjb2x1bW5zXG4gICAgICAgIGNvbHVtbnM6IGZpZWxkcyxcbiAgICAgICAgd2l0aFJlbGF0ZWQ6IF8uaW50ZXJzZWN0aW9uKHNlbGYucmVsYXRpb25zKCksIG9wdHMuaW5jbHVkZSB8fCBbXSlcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAvLyBUaGlzIGlzIGEgbG90IG9mIGdyb3NzIGluIG9yZGVyIHRvIHBhc3MgdGhpcyBkYXRhIGludG8gdGhlXG4gICAgICAgIC8vIGZvcm1hdHRlciBsYXRlci4gTmVlZCB0byBmb3JtYWxpemUgdGhpcyBpbiBzb21lIG90aGVyIHdheS5cbiAgICAgICAgcmVzdWx0Lm1vZGUgPSBtb2RlO1xuICAgICAgICByZXN1bHQucmVsYXRpb25zID0gb3B0cy5pbmNsdWRlO1xuICAgICAgICByZXN1bHQuc2luZ2xlUmVzdWx0ID0gc2luZ2xlUmVzdWx0O1xuICAgICAgICByZXN1bHQuYmFzZVR5cGUgPSBvcHRzLmJhc2VUeXBlO1xuICAgICAgICByZXN1bHQuYmFzZUlkID0gb3B0cy5iYXNlSWQ7XG4gICAgICAgIHJlc3VsdC5iYXNlUmVsYXRpb24gPSBvcHRzLmJhc2VSZWxhdGlvbjtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAgVXBkYXRlcyBhIHByb3ZpZGVkIG1vZGVsIHVzaW5nIHRoZSBwcm92aWRlZCBtZXRob2QuXG5cbiAgICBAcGFyYW0ge0Jvb2tzaGVsZi5Nb2RlbH0gbW9kZWxcbiAgICBAcGFyYW0ge1N0cmluZ30gbWV0aG9kIC0gVGhlIG1ldGhvZCBvbiB0aGUgbW9kZWwgaW5zdGFuY2UgdG8gdXNlIHdoZW4gdXBkYXRpbmcuXG4gICAgQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBwYXJhbXMgZnJvbSB0aGUgcmVxdWVzdC5cblxuICAgIEByZXR1cm5zIHtQcm9taXNlKEJvb2tzaGVsZi5Nb2RlbCl9IFRoZSB1cGRhdGVkIG1vZGVsLlxuICAqL1xuICB1cGRhdGUgKG1vZGVsLCBtZXRob2QsIHBhcmFtcykge1xuICAgIGlmICghbWV0aG9kKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBwcm92aWRlZCB0byB1cGRhdGUgb3IgZGVsZXRlIHdpdGguJyk7XG4gICAgfVxuICAgIHJldHVybiBkZXN0cnVjdHVyZVJlcXVlc3QobW9kZWwsIHBhcmFtcykudGhlbihmdW5jdGlvbihkZXN0cnVjdHVyZWQpIHtcbiAgICAgIHJldHVybiBtb2RlbFttZXRob2RdKGRlc3RydWN0dXJlZC5kYXRhLCBkZXN0cnVjdHVyZWQudG9NYW55UmVscywgbW9kZWwudG9KU09OKHtzaGFsbG93OiB0cnVlfSkpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAgRGVsZXRlcyBhIG1vZGVsLiBTYW1lIGltcGxlbWVudGF0aW9uIGFzIHVwZGF0ZS5cblxuICAgIEBwYXJhbSB7Qm9va3NoZWxmLk1vZGVsfSBtb2RlbFxuICAgIEBwYXJhbSB7U3RyaW5nfSBtZXRob2QgLSBUaGUgbWV0aG9kIG9uIHRoZSBtb2RlbCBpbnN0YW5jZSB0byB1c2Ugd2hlbiB1cGRhdGluZy5cbiAgICBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBhcmFtcyBmcm9tIHRoZSByZXF1ZXN0LlxuXG4gICAgQHJldHVybnMge1Byb21pc2UuQm9va3NoZWxmLk1vZGVsfSBUaGUgZGVsZXRlZCBtb2RlbC5cbiAgKi9cbiAgZGVzdHJveSAobW9kZWwsIG1ldGhvZCwgcGFyYW1zKSB7XG4gICAgaWYgKCFtZXRob2QpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIHByb3ZpZGVkIHRvIHVwZGF0ZSBvciBkZWxldGUgd2l0aC4nKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlc3RydWN0dXJlUmVxdWVzdChtb2RlbCwgcGFyYW1zKS50aGVuKGZ1bmN0aW9uKGRlc3RydWN0dXJlZCkge1xuICAgICAgcmV0dXJuIG1vZGVsW21ldGhvZF0oZGVzdHJ1Y3R1cmVkLmRhdGEsIGRlc3RydWN0dXJlZC50b01hbnlSZWxzLCBtb2RlbC50b0pTT04oe3NoYWxsb3c6IHRydWV9KSk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvb2tzaGVsZkFkYXB0ZXI7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9hZGFwdGVyLWJvb2tzaGVsZi9pbmRleC5qc1xuICoqLyIsImNvbnN0IEthcG93ID0gcmVxdWlyZSgna2Fwb3cnKTtcblxuY29uc3QgdmFsaWRhdG9yID0gcmVxdWlyZSgnaXMtbXktanNvbi12YWxpZCcpO1xuXG5mdW5jdGlvbiB0cmFuc2Zvcm1FcnJvckZpZWxkcyhpbnB1dCwgZXJyb3JzKSB7XG4gIHJldHVybiBlcnJvcnMubWFwKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgdmFyIGZpZWxkID0gZXJyb3IuZmllbGQucmVwbGFjZSgvXmRhdGEvLCBpbnB1dCk7XG4gICAgcmV0dXJuIEthcG93KDQwMCwgZmllbGQgKyAnICcgKyBlcnJvci5tZXNzYWdlLCBlcnJvcik7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZXF1ZXN0LCBlbmRwb2ludCkge1xuICB2YXIgZXJyO1xuICB2YXIgc2NoZW1hID0gZW5kcG9pbnQuc2NoZW1hIHx8IHt9O1xuXG4gIGZvciAodmFyIHByb3AgaW4gc2NoZW1hKSB7XG4gICAgdmFyIHZhbGlkYXRlID0gdmFsaWRhdG9yKHNjaGVtYVtwcm9wXSB8fCB7fSk7XG4gICAgaWYgKCF2YWxpZGF0ZShyZXF1ZXN0W3Byb3BdKSkge1xuICAgICAgZXJyID0gdHJhbnNmb3JtRXJyb3JGaWVsZHMocHJvcCwgdmFsaWRhdGUuZXJyb3JzKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZXJyO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3ZhbGlkYXRlLWpzb24tc2NoZW1hL2luZGV4LmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJsb2Rhc2hcIlxuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJsdWViaXJkXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJibHVlYmlyZFwiXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwia2Fwb3dcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImthcG93XCJcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJpcy1teS1qc29uLXZhbGlkXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJpcy1teS1qc29uLXZhbGlkXCJcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJjb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbmNvbnN0IGFkYXB0ZXJIYXMgPSByZXF1aXJlKCcuL2FkYXB0ZXJfaGFzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG1ldGhvZCwgY29uZmlnLCBhZGFwdGVyKSB7XG4gIHJldHVybiBfLmNvbXBvc2UoXy5mbGF0dGVuLCBfLmNvbXBhY3QpKFtcbiAgICBhZGFwdGVySGFzKGFkYXB0ZXIucmVsYXRpb25zKCksIGNvbmZpZy5pbmNsdWRlLCAncmVsYXRpb25zJyksXG4gICAgYWRhcHRlckhhcyhhZGFwdGVyLmZpbHRlcnMoKSwgT2JqZWN0LmtleXMoY29uZmlnLmZpbHRlciksICdmaWx0ZXJzJyksXG4gICAgLy8gdGhpcyBpcyBjcmFwXG4gICAgKG1ldGhvZCA9PT0gJ3JlYWQnKSA/IG51bGwgOlxuICAgICAgYWRhcHRlckhhcyhcbiAgICAgICAgbWV0aG9kID09PSAnY3JlYXRlJyA/IGFkYXB0ZXIubW9kZWwgOiBhZGFwdGVyLm1vZGVsLnByb3RvdHlwZSxcbiAgICAgICAgY29uZmlnLm1ldGhvZCxcbiAgICAgICAgJ21ldGhvZCdcbiAgICAgIClcbiAgXSk7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlci9saWIvdmFsaWRhdGUuanNcbiAqKi8iLCJjb25zdCBSZXF1ZXN0SGFuZGxlciA9IHJlcXVpcmUoJy4uLy4uL3JlcXVlc3QtaGFuZGxlcicpO1xuY29uc3QgUmVzcG9uc2VGb3JtYXR0ZXIgPSByZXF1aXJlKCcuLi8uLi9yZXNwb25zZS1mb3JtYXR0ZXInKTtcbmNvbnN0IGpzb25BcGkgPSByZXF1aXJlKCcuLi8uLi9mb3JtYXR0ZXItanNvbmFwaScpO1xuY29uc3Qgc2VuZCA9IHJlcXVpcmUoJy4vc2VuZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25maWcsIGFkYXB0ZXIpIHtcbiAgdmFyIG1ldGhvZCA9IGNvbmZpZy5tZXRob2Q7XG4gIHZhciByZXNwb25kZXIgPSBjb25maWcucmVzcG9uZGVyO1xuICB2YXIgaGFuZGxlciA9IG5ldyBSZXF1ZXN0SGFuZGxlcihhZGFwdGVyLCBjb25maWcpO1xuICB2YXIgZm9ybWF0dGVyID0gbmV3IFJlc3BvbnNlRm9ybWF0dGVyKGpzb25BcGkpO1xuXG4gIHJldHVybiBmdW5jdGlvbiAocmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgICB2YXIgc2VydmVyID0gJ2V4cHJlc3MnOyAvLyBkZXRlY3QgaWYgaGFwaSBvciBleHByZXNzIGhlcmVcbiAgICB2YXIgaGFuZGxlID0gaGFuZGxlclttZXRob2RdLmJpbmQoaGFuZGxlcik7XG4gICAgdmFyIGZvcm1hdCA9IGZvcm1hdHRlclttZXRob2RdLmJpbmQoZm9ybWF0dGVyLCBjb25maWcpO1xuICAgIHZhciBzZW5kZXIgPSByZXNwb25kZXIgPyByZXNwb25kZXIgOiBzZW5kW3NlcnZlcl07XG4gICAgdmFyIHJlc3BvbmQgPSBzZW5kZXIuYmluZChudWxsLCByZXNwb25zZSk7XG4gICAgdmFyIGVycm9ycyA9IGhhbmRsZXIudmFsaWRhdGUocmVxdWVzdCk7XG5cbiAgICBpZiAoZXJyb3JzKSB7XG4gICAgICByZXNwb25kKGZvcm1hdHRlci5lcnJvcihlcnJvcnMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGFuZGxlKHJlcXVlc3QpLnRoZW4oZm9ybWF0KS50aGVuKHJlc3BvbmQpLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgLy90aHJvdyBlcnI7XG4gICAgICAgIHJldHVybiByZXNwb25kKGZvcm1hdHRlci5lcnJvcihlcnIpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb250cm9sbGVyL2xpYi9oYW5kbGUuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRzPXt9KSB7XG4gIGlmICghb3B0cy5yb3V0ZUJ1aWxkZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHJvdXRlIGJ1aWxkZXIgc3BlY2lmaWVkLicpO1xuICB9XG4gIGlmICghb3B0cy5zZWFyY2hQYXRocykge1xuICAgIG9wdHMuc2VhcmNoUGF0aHMgPSBbXTtcbiAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheShvcHRzLnNlYXJjaFBhdGhzKSkge1xuICAgIG9wdHMuc2VhcmNoUGF0aHMgPSBbb3B0cy5zZWFyY2hQYXRoc107XG4gIH1cbiAgcmV0dXJuIG9wdHM7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYXBwbGljYXRpb24vbGliL3BhcnNlX29wdGlvbnMuanNcbiAqKi8iLCJjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG5jb25zdCByZXF1aXJlU2VhcmNoID0gcmVxdWlyZSgnLi9yZXF1aXJlX3NlYXJjaCcpO1xuY29uc3QgcmVxdWlyZVNpbGVudCA9IHJlcXVpcmUoJy4vcmVxdWlyZV9zaWxlbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSwgc2VhcmNoUGF0aHMpIHtcbiAgdmFyIHJvdXRlTW9kdWxlUGF0aCwgbW9kdWxlQmFzZVBhdGg7XG4gIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICByb3V0ZU1vZHVsZVBhdGggPSByZXF1aXJlU2VhcmNoKHBhdGguam9pbihuYW1lLCAncm91dGVzJyksIHNlYXJjaFBhdGhzKTtcbiAgICBtb2R1bGVCYXNlUGF0aCA9IHBhdGguZGlybmFtZShyb3V0ZU1vZHVsZVBhdGgpO1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgcm91dGVzOiByZXF1aXJlKHJvdXRlTW9kdWxlUGF0aCksXG4gICAgICBjb250cm9sbGVyOiByZXF1aXJlU2lsZW50KHBhdGguam9pbihtb2R1bGVCYXNlUGF0aCwgJ2NvbnRyb2xsZXInKSlcbiAgICB9O1xuICB9XG4gIGlmICghbmFtZSkge1xuICAgIG5hbWUgPSB7fTtcbiAgfVxuICBpZiAoIW5hbWUubmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHBhcnNlIGEgbW9kdWxlIHdpdGhvdXQgYSBuYW1lLicpO1xuICB9XG4gIGlmICghbmFtZS5yb3V0ZXMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBwYXJzZSBhIG1vZHVsZSB3aXRob3V0IGEgcm91dGVzIG9iamVjdC4nKTtcbiAgfVxuICByZXR1cm4gbmFtZTtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9hcHBsaWNhdGlvbi9saWIvcGFyc2VfcmVzb3VyY2UuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICByZXR1cm4gYC8ke2lucHV0IHx8ICcnfS9gLnJlcGxhY2UoL1xcL1xcLysvZywgJy8nKTtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9hcHBsaWNhdGlvbi9saWIvc2xhc2hfd3JhcC5qc1xuICoqLyIsImNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbmNvbnN0IGJQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcblxuZXhwb3J0cy5hZGRDcmVhdGUgPSBmdW5jdGlvbiAoYWRhcHRlcikge1xuICBhZGFwdGVyLm1vZGVsLmNyZWF0ZSA9IGZ1bmN0aW9uIChwYXJhbXMsIHRvTWFueVJlbHMpIHtcbiAgICAvLyB0aGlzIHNob3VsZCBiZSBpbiBhIHRyYW5zYWN0aW9uIGJ1dCB3ZSBkb24ndCBoYXZlIGFjY2VzcyB0byBpdCB5ZXRcbiAgICByZXR1cm4gdGhpcy5mb3JnZShwYXJhbXMpLnNhdmUobnVsbCwge21ldGhvZDogJ2luc2VydCd9KS50YXAoZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICByZXR1cm4gYlByb21pc2UubWFwKHRvTWFueVJlbHMsIGZ1bmN0aW9uKHJlbCkge1xuICAgICAgICByZXR1cm4gbW9kZWwucmVsYXRlZChyZWwubmFtZSkuYXR0YWNoKHJlbC5pZCk7XG4gICAgICB9KTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5mb3JnZSh7aWQ6bW9kZWwuaWR9KS5mZXRjaCgpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH07XG59O1xuXG5leHBvcnRzLmFkZFVwZGF0ZSA9IGZ1bmN0aW9uIChhZGFwdGVyKSB7XG4gIC8vIHRoaXMgc2hvdWxkIGJlIGluIGEgdHJhbnNhY3Rpb24gYnV0IHdlIGRvbid0IGhhdmUgYWNjZXNzIHRvIGl0IHlldFxuICBhZGFwdGVyLm1vZGVsLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAocGFyYW1zLCB0b01hbnlSZWxzLCBwcmV2aW91cykge1xuICAgIGNvbnN0IGNsaWVudFN0YXRlID0gXy5leHRlbmQocHJldmlvdXMsIHBhcmFtcyk7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZShwYXJhbXMsIHtwYXRjaDogdHJ1ZSwgbWV0aG9kOiAndXBkYXRlJ30pLnRhcChmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgIHJldHVybiBiUHJvbWlzZS5tYXAodG9NYW55UmVscywgZnVuY3Rpb24ocmVsKSB7XG4gICAgICAgIHJldHVybiBtb2RlbC5yZWxhdGVkKHJlbC5uYW1lKS5kZXRhY2goKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBtb2RlbC5yZWxhdGVkKHJlbC5uYW1lKS5hdHRhY2gocmVsLmlkKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAvLyBCb29rc2hlbGYgLnByZXZpb3VzQXR0cmlidXRlcygpIGRvZXNuJ3Qgd29ya1xuICAgICAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vdGdyaWVzc2VyL2Jvb2tzaGVsZi9pc3N1ZXMvMzI2I2lzc3VlY29tbWVudC03NjYzNzE4NlxuICAgICAgaWYgKF8uaXNFcXVhbChtb2RlbC50b0pTT04oe3NoYWxsb3c6IHRydWV9KSwgY2xpZW50U3RhdGUpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1vZGVsO1xuICAgIH0pO1xuICB9O1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2FkYXB0ZXItYm9va3NoZWxmL2xpYi9iYXNlX21ldGhvZHMuanNcbiAqKi8iLCJjb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbmNvbnN0IGlkRmlsdGVyID0gZnVuY3Rpb24gKHFiLCB2YWx1ZSkge1xuICByZXR1cm4gcWIud2hlcmVJbignaWQnLCB2YWx1ZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtb2RlbCwgcXVlcnksIGZpbHRlckJ5KSB7XG4gIHZhciBmaWx0ZXJzID0gbW9kZWwuZmlsdGVycztcbiAgcmV0dXJuIF8udHJhbnNmb3JtKGZpbHRlckJ5LCBmdW5jdGlvbiAocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgdmFyIGZpbHRlciA9IGZpbHRlcnNba2V5XTtcbiAgICBpZiAoa2V5ID09PSAnaWQnICYmICFmaWx0ZXIpIHtcbiAgICAgIGZpbHRlciA9IGlkRmlsdGVyO1xuICAgIH1cbiAgICByZXR1cm4gZmlsdGVyID8gZmlsdGVyLmNhbGwoZmlsdGVycywgcmVzdWx0LCB2YWx1ZSkgOiByZXN1bHQ7XG4gIH0sIHF1ZXJ5KTtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9hZGFwdGVyLWJvb2tzaGVsZi9saWIvcHJvY2Vzc19maWx0ZXIuanNcbiAqKi8iLCJjb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbi8vIFRPRE86IGludmVzdGlnYXRlIGhvdyB0byBkZWFsIHdpdGggZXhwcmVzcydzIHF1ZXJ5IHBhcnNlclxuLy8gY29udmVydGluZyArIGludG8gYSBzcGFjZS5cbmZ1bmN0aW9uIGlzQXNjZW5kaW5nIChrZXkpIHtcbiAgcmV0dXJuIGtleVswXSA9PT0gJysnIHx8IGtleVswXSA9PT0gJyAnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWxpZEZpZWxkcywgcXVlcnksIHNvcnRCeSkge1xuICByZXR1cm4gXy5jaGFpbihzb3J0QnkpLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIGhhc1NvcnREaXIgPSBrZXlbMF0gPT09ICcgJyB8fCBrZXlbMF0gPT09ICcrJyB8fCBrZXlbMF0gPT09ICctJztcbiAgICB2YXIgaXNWYWxpZEZpZWxkID0gXy5jb250YWlucyh2YWxpZEZpZWxkcywga2V5LnN1YnN0cmluZygxKSk7XG4gICAgcmV0dXJuIGhhc1NvcnREaXIgJiYgaXNWYWxpZEZpZWxkO1xuICB9KS5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwga2V5KSB7XG4gICAgdmFyIGNvbHVtbiA9IGtleS5zdWJzdHJpbmcoMSk7XG4gICAgdmFyIGRpciA9ICBpc0FzY2VuZGluZyhrZXkpID8gJ0FTQycgOiAnREVTQyc7XG4gICAgcmV0dXJuIGNvbHVtbiA/IHJlc3VsdC5vcmRlckJ5KGNvbHVtbiwgZGlyKSA6IHJlc3VsdDtcbiAgfSwgcXVlcnkpLnZhbHVlKCk7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYWRhcHRlci1ib29rc2hlbGYvbGliL3Byb2Nlc3Nfc29ydC5qc1xuICoqLyIsImNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbmNvbnN0IGJQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbmNvbnN0IEthcG93ID0gcmVxdWlyZSgna2Fwb3cnKTtcblxuY29uc3Qgc2FuaXRpemVSZXF1ZXN0RGF0YSA9IHJlcXVpcmUoJy4vc2FuaXRpemVfcmVxdWVzdF9kYXRhJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG1vZGVsLCBwYXJhbXMpIHtcbiAgaWYgKCFwYXJhbXMpIHtcbiAgICByZXR1cm4gYlByb21pc2UucmVzb2x2ZSh7fSk7XG4gIH1cblxuICB2YXIgcmVsYXRpb25zID0gcGFyYW1zLmxpbmtzO1xuICB2YXIgdG9NYW55UmVscyA9IFtdO1xuXG4gIGlmIChyZWxhdGlvbnMpIHtcbiAgICByZXR1cm4gYlByb21pc2UucmVkdWNlKE9iamVjdC5rZXlzKHJlbGF0aW9ucyksIGZ1bmN0aW9uKHJlc3VsdCwga2V5KSB7XG4gICAgICBpZiAoIW1vZGVsLnJlbGF0ZWQoa2V5KSkge1xuICAgICAgICB0aHJvdyBLYXBvdyg0MDQsICdVbmFibGUgdG8gZmluZCByZWxhdGlvbiBcIicgKyBrZXkgKyAnXCInKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGZrZXk7XG4gICAgICB2YXIgcmVsYXRpb24gPSByZWxhdGlvbnNba2V5XS5saW5rYWdlO1xuICAgICAgdmFyIHJlbGF0ZWREYXRhID0gbW9kZWwucmVsYXRlZChrZXkpLnJlbGF0ZWREYXRhO1xuICAgICAgdmFyIHJlbGF0aW9uVHlwZSA9IHJlbGF0ZWREYXRhLnR5cGU7XG5cbiAgICAgIC8vIHRvT25lIHJlbGF0aW9uc1xuICAgICAgaWYgKHJlbGF0aW9uVHlwZSA9PT0gJ2JlbG9uZ3NUbycgfHwgcmVsYXRpb25UeXBlID09PSAnaGFzT25lJykge1xuICAgICAgICBma2V5ID0gcmVsYXRlZERhdGEuZm9yZWlnbktleTtcblxuICAgICAgICByZXR1cm4gcmVsYXRlZERhdGEudGFyZ2V0LmNvbGxlY3Rpb24oKS5xdWVyeShmdW5jdGlvbihxYikge1xuICAgICAgICAgIGlmIChyZWxhdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHFiO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcWIud2hlcmUoe2lkOnJlbGF0aW9uLmlkfSk7XG4gICAgICAgIH0pLmZldGNoT25lKCkudGhlbihmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICAgIGlmIChtb2RlbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgS2Fwb3coNDA0LCAnVW5hYmxlIHRvIGZpbmQgcmVsYXRpb24gXCInICsga2V5ICsgJ1wiIHdpdGggaWQgJyArIHJlbGF0aW9uLmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcGFyYW1zW2ZrZXldID0gcmVsYXRpb24gPT09IG51bGwgPyByZWxhdGlvbiA6IHJlbGF0aW9uLmlkO1xuICAgICAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyB0b01hbnkgcmVsYXRpb25zXG4gICAgICBpZiAocmVsYXRpb25UeXBlID09PSAnYmVsb25nc1RvTWFueScgfHwgcmVsYXRpb25UeXBlID09PSAnaGFzTWFueScpIHtcbiAgICAgICAgcmV0dXJuIGJQcm9taXNlLm1hcChyZWxhdGlvbiwgZnVuY3Rpb24ocmVsKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWREYXRhLnRhcmdldC5jb2xsZWN0aW9uKCkucXVlcnkoZnVuY3Rpb24ocWIpIHtcbiAgICAgICAgICAgIHJldHVybiBxYi53aGVyZSh7aWQ6cmVsLmlkfSk7XG4gICAgICAgICAgfSkuZmV0Y2hPbmUoKS50aGVuKGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgICAgICBpZiAobW9kZWwgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgdGhyb3cgS2Fwb3coNDA0LCAnVW5hYmxlIHRvIGZpbmQgcmVsYXRpb24gXCInICsga2V5ICsgJ1wiIHdpdGggaWQgJyArIHJlbC5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcGFyYW1zO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRvTWFueVJlbHMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBrZXksXG4gICAgICAgICAgICBpZDogXy5wbHVjayhyZWxhdGlvbiwgJ2lkJylcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gcGFyYW1zO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LCBwYXJhbXMpLnRoZW4oZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRhOiBzYW5pdGl6ZVJlcXVlc3REYXRhKHBhcmFtcyksXG4gICAgICAgIHRvTWFueVJlbHM6IHRvTWFueVJlbHNcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gYlByb21pc2UucmVzb2x2ZSh7XG4gICAgZGF0YTogc2FuaXRpemVSZXF1ZXN0RGF0YShwYXJhbXMpLFxuICAgIHRvTWFueVJlbHM6IHRvTWFueVJlbHNcbiAgfSk7XG5cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9hZGFwdGVyLWJvb2tzaGVsZi9saWIvZGVzdHJ1Y3R1cmVfcmVxdWVzdF9kYXRhLmpzXG4gKiovIiwiLy8gR2l2ZW4gYSBCb29rc2hlbGYgbW9kZWwgb3IgY29sbGVjdGlvbiwgcmV0dXJuIGEgcmVsYXRlZFxuLy8gY29sbGVjdGlvbiBvciBtb2RlbC5cbmZ1bmN0aW9uIGdldFJlbGF0ZWQgKHJlbGF0aW9uTmFtZSwgaW5wdXQpIHtcbiAgdmFyIGNvbGxlY3Rpb247XG4gIGlmIChpbnB1dC5tb2RlbHMpIHtcbiAgICAvLyB0aGlzIGlzIGZ1bGx5IHJpZGljdWxvdXMuIHdoZW4gbG9va2luZyBmb3IgdGhlIHJlbGF0ZWQgdGhpbmcgZnJvbVxuICAgIC8vIGEgY29sbGVjdGlvbiBvZiBtb2RlbHMsIGkgbmVlZCBhIHNpbmdsZSBjb2xsZWN0aW9uIHRvIHB1dCB0aGVtIGluXG4gICAgLy8gYW5kIHRoaXMgaXMgdGhlIG9ubHkgd2F5IHRvIG1ha2Ugb25lLlxuICAgIGNvbGxlY3Rpb24gPSBpbnB1dC5tb2RlbC5mb3JnZSgpLnJlbGF0ZWQocmVsYXRpb25OYW1lKS5yZWxhdGVkRGF0YS50YXJnZXQuY29sbGVjdGlvbigpO1xuICAgIC8vIG5vdyB0aGF0IGkgaGF2ZSBhIGNvbGxlY3Rpb24gZm9yIHRoZSByZWxhdGlvbiB3ZSdyZSByZXRyZWl2aW5nLFxuICAgIC8vIGl0ZXJhdGUgZWFjaCBtb2RlbCBhbmQgYWRkIGl0cyByZWxhdGVkIG1vZGVscyB0byB0aGUgY29sbGVjdGlvblxuICAgIHJldHVybiBpbnB1dC5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgbW9kZWwpIHtcbiAgICAgIHZhciByZWxhdGVkID0gbW9kZWwucmVsYXRlZChyZWxhdGlvbk5hbWUpO1xuICAgICAgcmV0dXJuIHJlc3VsdC5hZGQocmVsYXRlZC5tb2RlbHMgPyByZWxhdGVkLm1vZGVscyA6IHJlbGF0ZWQpO1xuICAgIH0sIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcmV0dXJuIGlucHV0LnJlbGF0ZWQocmVsYXRpb25OYW1lKTtcbn1cblxuLy8gVGFrZSBhIEJvb2tzaGVsZiBtb2RlbCBvciBjb2xsZWN0aW9uICsgZG90LW5vdGF0ZWQgcmVsYXRpb25cbi8vIHN0cmluZyBhbmQgaXRlcmF0ZSB0aHJvdWdoIGl0LCByZXR1cm5pbmcgdGhlIG1vZGVsKHMpIGluIHRoZVxuLy8gbGFzdCByZWxhdGlvbiBvbmx5LlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobW9kZWwsIHJlbGF0aW9uKSB7XG4gIC8vIEJvb2tzaGVsZiByZWxhdGlvbnMgY2FuIGJlIHJlcXVlc3RlZCBhcmJpdGFyaWx5IGRlZXAgYXNcbiAgLy8gZG90IG5vdGF0ZWQgc3RyaW5ncy4gSGVyZSwgd2UgdHJhdmVyc2UgdGhlIHJlbGF0aW9uIHVudGlsXG4gIC8vIHdlIHJlYWNoIHRoZSBmaW5hbCBub2RlLiBUaGUgbW9kZWxzIGluIHRoaXMgbm9kZSBhcmUgdGhlblxuICAvLyByZXR1cm5lZC5cbiAgdmFyIHJlbGF0aW9uU2VnbWVudHMgPSByZWxhdGlvbi5zcGxpdCgnLicpO1xuICByZXR1cm4gcmVsYXRpb25TZWdtZW50cy5yZWR1Y2UoZnVuY3Rpb24gKHNvdXJjZSwgc2VnbWVudCkge1xuICAgIHJldHVybiBnZXRSZWxhdGVkKHNlZ21lbnQsIHNvdXJjZSk7XG4gIH0sIG1vZGVsKTtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9mb3JtYXR0ZXItanNvbmFwaS9saWIvcmVsYXRlLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwicGF0aFwiXG4gKiogbW9kdWxlIGlkID0gMTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBtYXAgPSB7XG5cdFwiLi9wYXJzZV9vcHRpb25zXCI6IDExLFxuXHRcIi4vcGFyc2Vfb3B0aW9ucy5qc1wiOiAxMSxcblx0XCIuL3BhcnNlX3Jlc291cmNlXCI6IDEyLFxuXHRcIi4vcGFyc2VfcmVzb3VyY2UuanNcIjogMTIsXG5cdFwiLi9yZXF1aXJlX3NlYXJjaFwiOiAyNixcblx0XCIuL3JlcXVpcmVfc2VhcmNoLmpzXCI6IDI2LFxuXHRcIi4vcmVxdWlyZV9zaWxlbnRcIjogMjcsXG5cdFwiLi9yZXF1aXJlX3NpbGVudC5qc1wiOiAyNyxcblx0XCIuL3NsYXNoX3dyYXBcIjogMTMsXG5cdFwiLi9zbGFzaF93cmFwLmpzXCI6IDEzXG59O1xuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpKTtcbn07XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdHJldHVybiBtYXBbcmVxXSB8fCAoZnVuY3Rpb24oKSB7IHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIicuXCIpIH0oKSk7XG59O1xud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IDIwO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9hcHBsaWNhdGlvbi9saWIgXlxcLlxcLy4qJFxuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJjb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbmZ1bmN0aW9uIGVycm9yICh0eXBlLCBrZXkpIHtcbiAgcmV0dXJuIGBNb2RlbCBkb2VzIG5vdCBoYXZlICR7dHlwZX06ICR7a2V5fS5gO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhdmFpbGFibGUsIHJlcXVlc3RlZCwgdHlwZSkge1xuICB2YXIgbWVzc2FnZSA9IGVycm9yLmJpbmQobnVsbCwgdHlwZSk7XG4gIGlmICghcmVxdWVzdGVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChfLmlzQXJyYXkocmVxdWVzdGVkKSAmJiBfLmlzQXJyYXkoYXZhaWxhYmxlKSkge1xuICAgIHJldHVybiBfLmRpZmZlcmVuY2UocmVxdWVzdGVkLCBhdmFpbGFibGUpLm1hcChtZXNzYWdlKTtcbiAgfVxuICByZXR1cm4gYXZhaWxhYmxlW3JlcXVlc3RlZF0gPyBudWxsIDogbWVzc2FnZShyZXF1ZXN0ZWQpO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbnRyb2xsZXIvbGliL2FkYXB0ZXJfaGFzLmpzXG4gKiovIiwiY29uc3QgVFlQRSA9ICdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb24nO1xuXG5mdW5jdGlvbiBhcHBseUhlYWRlcnMgKHJlc3BvbnNlLCBoZWFkZXJzKSB7XG4gIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgcmVzcG9uc2Uuc2V0KGhlYWRlciwgaGVhZGVyc1toZWFkZXJdKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHByZXNzIChyZXNwb25zZSwgcGF5bG9hZCkge1xuICB2YXIgY29kZSA9IHBheWxvYWQuY29kZTtcbiAgdmFyIGRhdGEgPSBwYXlsb2FkLmRhdGE7XG4gIHZhciBoZWFkZXJzID0gcGF5bG9hZC5oZWFkZXJzO1xuICBpZiAoaGVhZGVycykge1xuICAgIGFwcGx5SGVhZGVycyhyZXNwb25zZSwgcGF5bG9hZC5oZWFkZXJzKTtcbiAgfVxuICByZXR1cm4gcmVzcG9uc2Uuc2V0KCdjb250ZW50LXR5cGUnLCBUWVBFKS5zdGF0dXMoY29kZSkuc2VuZChkYXRhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhcGkgKHJlc3BvbnNlLCBwYXlsb2FkKSB7XG4gIHZhciBjb2RlID0gcGF5bG9hZC5jb2RlO1xuICB2YXIgZGF0YSA9IHBheWxvYWQuZGF0YTtcbiAgdmFyIGhlYWRlcnMgPSBwYXlsb2FkLmhlYWRlcnM7XG4gIGlmIChoZWFkZXJzKSB7XG4gICAgYXBwbHlIZWFkZXJzKHJlc3BvbnNlLCBwYXlsb2FkLmhlYWRlcnMpO1xuICB9XG4gIHJldHVybiByZXNwb25zZShkYXRhKS50eXBlKFRZUEUpLmNvZGUoY29kZSk7XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb250cm9sbGVyL2xpYi9zZW5kLmpzXG4gKiovIiwiY29uc3QgQ09MTEVDVElPTl9NT0RFID0gJ2NvbGxlY3Rpb24nO1xuY29uc3QgU0lOR0xFX01PREUgPSAnc2luZ2xlJztcbmNvbnN0IFJFTEFUSU9OX01PREUgPSAncmVsYXRpb24nO1xuY29uc3QgUkVMQVRFRF9NT0RFID0gJ3JlbGF0ZWQnO1xuXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5jb25zdCBLYXBvdyA9IHJlcXVpcmUoJ2thcG93Jyk7XG5cbmNvbnN0IHRocm93SWZNb2RlbCA9IHJlcXVpcmUoJy4vbGliL3Rocm93X2lmX21vZGVsJyk7XG5jb25zdCB0aHJvd0lmTm9Nb2RlbCA9IHJlcXVpcmUoJy4vbGliL3Rocm93X2lmX25vX21vZGVsJyk7XG5jb25zdCB2ZXJpZnlBY2NlcHQgPSByZXF1aXJlKCcuL2xpYi92ZXJpZnlfYWNjZXB0Jyk7XG5jb25zdCB2ZXJpZnlDb250ZW50VHlwZSA9IHJlcXVpcmUoJy4vbGliL3ZlcmlmeV9jb250ZW50X3R5cGUnKTtcbmNvbnN0IHZlcmlmeURhdGFPYmplY3QgPSByZXF1aXJlKCcuL2xpYi92ZXJpZnlfZGF0YV9vYmplY3QnKTtcbmNvbnN0IHNwbGl0U3RyaW5nUHJvcHMgPSByZXF1aXJlKCcuL2xpYi9zcGxpdF9zdHJpbmdfcHJvcHMnKTtcbmNvbnN0IHZlcmlmeUNsaWVudEdlbmVyYXRlZElkID0gcmVxdWlyZSgnLi9saWIvdmVyaWZ5X2NsaWVudF9nZW5lcmF0ZWRfaWQnKTtcblxuLyoqXG4gIFByb3ZpZGVzIG1ldGhvZHMgZm9yIHB1bGxpbmcgb3V0IGpzb24tYXBpIHJlbGV2YW50IGRhdGEgZnJvbVxuICBleHByZXNzIG9yIGhhcGkgcmVxdWVzdCBpbnN0YW5jZXMuIEFsc28gcHJvdmlkZXMgcm91dGUgbGV2ZWxcbiAgdmFsaWRhdGlvbi5cbiovXG5jbGFzcyBSZXF1ZXN0SGFuZGxlciB7XG5cbiAgLyoqXG4gICAgVGhlIGNvbnN0cnVjdG9yLlxuXG4gICAgQGNvbnN0cnVjdHMgUmVxdWVzdEhhbmRsZXJcbiAgICBAcGFyYW0ge0VuZHBvaW50cy5BZGFwdGVyfSBhZGFwdGVyXG4gICovXG4gIGNvbnN0cnVjdG9yIChhZGFwdGVyLCBjb25maWc9e30pIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLmFkYXB0ZXIgPSBhZGFwdGVyO1xuICAgIHRoaXMubWV0aG9kID0gY29uZmlnLm1ldGhvZDtcblxuICAgIC8vIHRoaXMgdXNlZCB0byBoYXBwZW4gaW4gdGhlIGNvbmZpZ3VyZUNvbnRyb2xsZXIgc3RlcFxuICAgIC8vIFRPRE86IGlzIHRoaXMgZXZlbiBuZWVkZWQ/IGkgYmVsaWV2ZSB3ZSdyZSBvbmx5IHVzaW5nXG4gICAgLy8gaXQgdG8gZ2VuZXJhdGUgdGhlIGxvY2F0aW9uIGhlYWRlciByZXNwb25zZSBmb3IgY3JlYXRpb25cbiAgICAvLyB3aGljaCBpcyBicml0dGxlIGFuZCBpbnZhbGlkIGFueXdheS5cbiAgICBjb25maWcudHlwZU5hbWUgPSBhZGFwdGVyLnR5cGVOYW1lKCk7XG4gIH1cblxuICAvKipcbiAgICBBIGZ1bmN0aW9uIHRoYXQsIGdpdmVuIGEgcmVxdWVzdCwgdmFsaWRhdGVzIHRoZSByZXF1ZXN0LlxuXG4gICAgQHJldHVybnMge09iamVjdH0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgZXJyb3JzLCBpZiBhbnkuXG4gICovXG4gIHZhbGlkYXRlIChyZXF1ZXN0KSB7XG5cbiAgICB2YXIgZXJyO1xuICAgIHZhciB2YWxpZGF0b3JzID0gW3ZlcmlmeUFjY2VwdF07XG5cbiAgICBpZiAocmVxdWVzdC5ib2R5ICYmIHJlcXVlc3QuYm9keS5kYXRhKSB7XG4gICAgICB2YXIgY2xpZW50SWRDaGVjayA9XG4gICAgICAgIHJlcXVlc3QubWV0aG9kID09PSAnUE9TVCcgJiZcbiAgICAgICAgLy8gcG9zdGluZyB0byBhIHJlbGF0aW9uIGVuZHBvaW50IGlzIGZvciBhcHBlbmRpbmdcbiAgICAgICAgLy8gcmVsYXRpb25zaGlwcyBhbmQgYW5kIHN1Y2ggaXMgYWxsb3dlZCAobXVzdCBoYXZlLCByZWFsbHkpXG4gICAgICAgIC8vIGlkc1xuICAgICAgICB0aGlzLm1vZGUocmVxdWVzdCkgIT09IFJFTEFUSU9OX01PREUgJiZcbiAgICAgICAgIXRoaXMuY29uZmlnLmFsbG93Q2xpZW50R2VuZXJhdGVkSWRzO1xuICAgICAgaWYgKGNsaWVudElkQ2hlY2spIHtcbiAgICAgICAgdmFsaWRhdG9ycy5wdXNoKHZlcmlmeUNsaWVudEdlbmVyYXRlZElkKTtcbiAgICAgIH1cbiAgICAgIHZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmNvbmNhdChbXG4gICAgICAgIHZlcmlmeUNvbnRlbnRUeXBlLFxuICAgICAgICB2ZXJpZnlEYXRhT2JqZWN0XG4gICAgICBdKTtcbiAgICB9XG5cbiAgICAvLyBkb2VzIHRoaXMudmFsaWRhdG9ycyBuZWVkcyBhIGJldHRlciBuYW1lPyBjb250cm9sbGVyVmFsaWRhdG9yLCB1c2VyVmFsaWRhdG9ycz9cbiAgICB2YWxpZGF0b3JzID0gdmFsaWRhdG9ycy5jb25jYXQodGhpcy5jb25maWcudmFsaWRhdG9ycyk7XG5cbiAgICBmb3IgKHZhciB2YWxpZGF0ZSBpbiB2YWxpZGF0b3JzKSB7XG4gICAgICBlcnIgPSB2YWxpZGF0b3JzW3ZhbGlkYXRlXShyZXF1ZXN0LCB0aGlzKTtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlcnI7XG4gIH1cblxuICAvKipcbiAgICBCdWlsZHMgYSBxdWVyeSBvYmplY3QgdG8gYmUgcGFzc2VkIHRvIEVuZHBvaW50cy5BZGFwdGVyI3JlYWQuXG5cbiAgICBAcmV0dXJucyB7T2JqZWN0fSBUaGUgcXVlcnkgb2JqZWN0IG9uIGEgcmVxdWVzdC5cbiAgICovXG4gIHF1ZXJ5IChyZXF1ZXN0KSB7XG4gICAgLy8gYml0cyBkb3duIHRoZSBjaGFpbiBjYW4gbXV0YXRlIHRoaXMgY29uZmlnXG4gICAgLy8gb24gYSBwZXItcmVxdWVzdCBiYXNpcywgc28gd2UgbmVlZCB0byBjbG9uZVxuICAgIHZhciBjb25maWcgPSBfLmNsb25lRGVlcCh0aGlzLmNvbmZpZyk7XG5cbiAgICB2YXIgcXVlcnkgPSByZXF1ZXN0LnF1ZXJ5O1xuICAgIHZhciBpbmNsdWRlID0gcXVlcnkuaW5jbHVkZTtcbiAgICB2YXIgZmlsdGVyID0gcXVlcnkuZmlsdGVyO1xuICAgIHZhciBmaWVsZHMgPSBxdWVyeS5maWVsZHM7XG4gICAgdmFyIHNvcnQgPSBxdWVyeS5zb3J0O1xuICAgIHJldHVybiB7XG4gICAgICBpbmNsdWRlOiBpbmNsdWRlID8gaW5jbHVkZS5zcGxpdCgnLCcpIDogY29uZmlnLmluY2x1ZGUsXG4gICAgICBmaWx0ZXI6IGZpbHRlciA/IHNwbGl0U3RyaW5nUHJvcHMoZmlsdGVyKSA6IGNvbmZpZy5maWx0ZXIsXG4gICAgICBmaWVsZHM6IGZpZWxkcyA/IHNwbGl0U3RyaW5nUHJvcHMoZmllbGRzKSA6IGNvbmZpZy5maWVsZHMsXG4gICAgICBzb3J0OiBzb3J0ID8gc29ydC5zcGxpdCgnLCcpIDogY29uZmlnLnNvcnRcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAgRGV0ZXJtaW5lcyBtb2RlIGJhc2VkIG9uIHdoYXQgcmVxdWVzdC5wYXJhbXMgYXJlIGF2YWlsYWJsZS5cblxuICAgIEByZXR1cm5zIHtTdHJpbmd9IHRoZSByZWFkIG1vZGVcbiAgKi9cbiAgbW9kZSAocmVxdWVzdCkge1xuICAgIHZhciBoYXNJZFBhcmFtID0gISFyZXF1ZXN0LnBhcmFtcy5pZDtcbiAgICB2YXIgaGFzUmVsYXRpb25QYXJhbSA9ICEhcmVxdWVzdC5wYXJhbXMucmVsYXRpb247XG4gICAgdmFyIGhhc1JlbGF0ZWRQYXJhbSA9ICEhcmVxdWVzdC5wYXJhbXMucmVsYXRlZDtcblxuICAgIGlmICghaGFzSWRQYXJhbSkge1xuICAgICAgcmV0dXJuIENPTExFQ1RJT05fTU9ERTtcbiAgICB9XG5cbiAgICBpZiAoIWhhc1JlbGF0aW9uUGFyYW0gJiYgIWhhc1JlbGF0ZWRQYXJhbSkge1xuICAgICAgcmV0dXJuIFNJTkdMRV9NT0RFO1xuICAgIH1cblxuICAgIGlmIChoYXNSZWxhdGlvblBhcmFtKSB7XG4gICAgICByZXR1cm4gUkVMQVRJT05fTU9ERTtcbiAgICB9XG5cbiAgICBpZiAoaGFzUmVsYXRlZFBhcmFtKSB7XG4gICAgICByZXR1cm4gUkVMQVRFRF9NT0RFO1xuICAgIH1cblxuICAgIHRocm93IEthcG93KDQwMCwgJ1VuYWJsZSB0byBkZXRlcm1pbmUgbW9kZSBiYXNlZCBvbiBgcmVxdWVzdC5wYXJhbXNgIGtleXMuJyk7XG4gIH1cblxuICAvKipcbiAgICBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIGEgbW9kZWwuXG5cbiAgICBAcmV0dXJucyB7UHJvbWlzZShCb29rc2hlbGYuTW9kZWwpfSBOZXdseSBjcmVhdGVkIGluc3RhbmNlIG9mIHRoZSBNb2RlbC5cbiAgKi9cbiAgY3JlYXRlIChyZXF1ZXN0KSB7XG4gICAgdmFyIGFkYXB0ZXIgPSB0aGlzLmFkYXB0ZXI7XG4gICAgdmFyIG1ldGhvZCA9IHRoaXMubWV0aG9kO1xuICAgIHZhciBkYXRhID0gcmVxdWVzdC5ib2R5LmRhdGE7XG5cbiAgICBpZiAoZGF0YSAmJiBkYXRhLmlkKSB7XG4gICAgICByZXR1cm4gYWRhcHRlci5ieUlkKGRhdGEuaWQpXG4gICAgICAgIC50aGVuKHRocm93SWZNb2RlbClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGFkYXB0ZXIuY3JlYXRlKG1ldGhvZCwgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhZGFwdGVyLmNyZWF0ZShtZXRob2QsIGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgIFF1ZXJpZXMgdGhlIGFkYXB0ZXIgZm9yIG1hdGNoaW5nIG1vZGVscy5cblxuICAgIEByZXR1cm5zIHtQcm9taXNlKEJvb2tzaGVsZi5Nb2RlbCl8UHJvbWlzZShCb29rc2hlbGYuQ29sbGVjdGlvbil9XG4gICovXG4gIHJlYWQgKHJlcXVlc3QpIHtcbiAgICB2YXIgYWRhcHRlciA9IHRoaXMuYWRhcHRlcjtcbiAgICB2YXIgcXVlcnkgPSB0aGlzLnF1ZXJ5KHJlcXVlc3QpO1xuICAgIHZhciBtb2RlID0gdGhpcy5tb2RlKHJlcXVlc3QpO1xuXG4gICAgdmFyIHBhcmFtcyA9IHJlcXVlc3QucGFyYW1zO1xuICAgIHZhciBpZCA9IHBhcmFtcy5pZDtcblxuICAgIHZhciByZWxhdGVkLCBmaW5kUmVsYXRlZDtcblxuICAgIGlmIChtb2RlID09PSBSRUxBVEVEX01PREUgfHwgbW9kZSA9PT0gUkVMQVRJT05fTU9ERSkge1xuICAgICAgcmVsYXRlZCA9IHBhcmFtcy5yZWxhdGVkIHx8IHBhcmFtcy5yZWxhdGlvbjtcbiAgICAgIGZpbmRSZWxhdGVkID0gYWRhcHRlci5yZWxhdGVkLmJpbmQoYWRhcHRlciwgcXVlcnksIHJlbGF0ZWQsIG1vZGUpO1xuICAgICAgcmV0dXJuIGFkYXB0ZXIuYnlJZChpZCwgcmVsYXRlZCkudGhlbih0aHJvd0lmTm9Nb2RlbCkudGhlbihmaW5kUmVsYXRlZCk7XG4gICAgfVxuXG4gICAgaWYgKGlkKSB7XG4gICAgICAvLyBGSVhNRTogdGhpcyBjb3VsZCBjb2xsaWRlIHdpdGggZmlsdGVyW2lkXT0jXG4gICAgICBxdWVyeS5maWx0ZXIuaWQgPSBpZDtcbiAgICB9XG4gICAgcmV0dXJuIGFkYXB0ZXIucmVhZChxdWVyeSwgbW9kZSk7XG4gIH1cblxuICAvKipcbiAgICBFZGl0cyBhIG1vZGVsLlxuXG4gICAgQHJldHVybnMge1Byb21pc2UoQm9va3NoZWxmLk1vZGVsKX1cbiAgKi9cbiAgdXBkYXRlIChyZXF1ZXN0KSB7XG4gICAgdmFyIGFkYXB0ZXIgPSB0aGlzLmFkYXB0ZXI7XG4gICAgdmFyIG1ldGhvZCA9IHRoaXMubWV0aG9kO1xuICAgIHZhciBpZCA9IHJlcXVlc3QucGFyYW1zLmlkO1xuICAgIHZhciByZWxhdGlvbiA9IHJlcXVlc3QucGFyYW1zLnJlbGF0aW9uO1xuICAgIHZhciBkYXRhID0gcmVxdWVzdC5ib2R5LmRhdGE7XG5cbiAgICBpZiAocmVsYXRpb24pIHtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgdHlwZTogYWRhcHRlci50eXBlTmFtZSgpLFxuICAgICAgICBsaW5rczoge31cbiAgICAgIH07XG4gICAgICBkYXRhLmxpbmtzW3JlbGF0aW9uXSA9IHtsaW5rYWdlOiByZXF1ZXN0LmJvZHkuZGF0YX07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFkYXB0ZXIuYnlJZChpZCwgW3JlbGF0aW9uXSkuXG4gICAgICB0aGVuKHRocm93SWZOb01vZGVsKS5cbiAgICAgIHRoZW4oZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgIGlmIChyZXF1ZXN0Lm1ldGhvZCAhPT0gJ1BBVENIJykge1xuICAgICAgICAgIC8vIEZJWE1FOiBUaGlzIHdpbGwgYnJlYWsgaGV0ZXJvZ2VuZW91cyByZWxhdGlvbnNcbiAgICAgICAgICB2YXIgcmVsYXRpb25UeXBlID0gZGF0YS5saW5rc1tyZWxhdGlvbl0ubGlua2FnZVswXS50eXBlO1xuICAgICAgICAgIHZhciBleGlzdGluZ1JlbHMgPSBtb2RlbC50b0pTT04oKVtyZWxhdGlvbl0ubWFwKGZ1bmN0aW9uKHJlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgaWQ6IFN0cmluZyhyZWwuaWQpLFxuICAgICAgICAgICAgICB0eXBlOiByZWxhdGlvblR5cGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAocmVxdWVzdC5tZXRob2QgPT09ICdQT1NUJykge1xuICAgICAgICAgICAgZGF0YS5saW5rc1tyZWxhdGlvbl0ubGlua2FnZSA9IF8udW5pcShkYXRhLmxpbmtzW3JlbGF0aW9uXS5saW5rYWdlLmNvbmNhdChleGlzdGluZ1JlbHMpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocmVxdWVzdC5tZXRob2QgPT09ICdERUxFVEUnKSB7XG4gICAgICAgICAgICBkYXRhLmxpbmtzW3JlbGF0aW9uXS5saW5rYWdlID0gXy5yZWplY3QoZXhpc3RpbmdSZWxzLCBmdW5jdGlvbihyZWwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF8uZmluZFdoZXJlKGRhdGEubGlua3NbcmVsYXRpb25dLmxpbmthZ2UsIHJlbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWRhcHRlci51cGRhdGUobW9kZWwsIG1ldGhvZCwgZGF0YSk7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbihlKSB7XG4gICAgICAgIC8vIEZJWE1FOiBUaGlzIG1heSBvbmx5IHdvcmsgZm9yIFNRTElURTMsIGJ1dCB0cmllcyB0byBiZSBnZW5lcmFsXG4gICAgICAgIGlmIChlLm1lc3NhZ2UudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdudWxsJykgIT09IC0xKSB7XG4gICAgICAgICAgS2Fwb3cud3JhcChlLCA0MDkpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgIERlbGV0ZXMgYSBtb2RlbC5cblxuICAgIEByZXR1cm5zIHtQcm9taXNlKEJvb2tzaGVsZi5Nb2RlbCl9XG4gICovXG4gIGRlc3Ryb3kgKHJlcXVlc3QpIHtcbiAgICB2YXIgbWV0aG9kID0gdGhpcy5tZXRob2Q7XG4gICAgdmFyIGFkYXB0ZXIgPSB0aGlzLmFkYXB0ZXI7XG4gICAgdmFyIGlkID0gcmVxdWVzdC5wYXJhbXMuaWQ7XG5cbiAgICByZXR1cm4gYWRhcHRlci5ieUlkKGlkKS50aGVuKGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgaWYgKG1vZGVsKSB7XG4gICAgICAgIHJldHVybiBhZGFwdGVyLmRlc3Ryb3kobW9kZWwsIG1ldGhvZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlcXVlc3RIYW5kbGVyO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVxdWVzdC1oYW5kbGVyL2luZGV4LmpzXG4gKiovIiwiLyoqXG4gIFByb3ZpZGVzIG1ldGhvZHMgZm9yIGZvcm1hdHRpbmcgY3JlYXRlL3JlYWQvdXBkYXRlL2RlbGV0ZSByZXF1ZXN0cyB0b1xuICBqc29uLWFwaSBjb21wbGlhbmNlLiBUaGlzIGlzIG1vc3RseSBjb25jZXJuZWQgYWJvdXQgc3RhdHVzIGNvZGVzLCBpdFxuICBwYXNzZXMgYWxsIHRoZSBmb3JtYXR0aW5nIHdvcmsgdG8gYSBwcm92aWRlZCBmb3JtYXR0ZXIuXG4qL1xuY2xhc3MgUmVzcG9uc2VGb3JtYXR0ZXIge1xuXG4gIC8qKlxuICAgIFRoZSBjb25zdHJ1Y3Rvci5cblxuICAgIEBjb25zdHJ1Y3RzIFJlc3BvbnNlRm9ybWF0dGVyXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gZm9ybWF0dGVyXG4gICovXG4gIGNvbnN0cnVjdG9yIChmb3JtYXR0ZXIpIHtcbiAgICBpZiAoIWZvcm1hdHRlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBmb3JtYXR0ZXIgc3BlY2lmaWVkLicpO1xuICAgIH1cbiAgICB0aGlzLmZvcm1hdHRlciA9IGZvcm1hdHRlcjtcbiAgfVxuXG4gIC8qKlxuICAgIFBhcnRpYWxseSBhcHBsaWVzIHRoaXMuZm9ybWF0dGVyIHRvIGVhY2ggbWV0aG9kLlxuXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gZm4gLSBUaGUgbWV0aG9kIHRvIHdoaWNoIHRoZSBmb3JtYXR0ZXIgc2hvdWxkIGJlIGFwcGxpZWQuXG4gICovXG4gIC8vIHBhcnRpYWxseSBhcHBseSB0aGlzLmZvcm1hdHRlciB0byBlYWNoIG1ldGhvZFxuICAvLyB0aGlzIGlzIHByZXR0eSBzdHVwaWQuXG4gIHN0YXRpYyBtZXRob2QgKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIGFyZ3MudW5zaGlmdCh0aGlzLmZvcm1hdHRlcik7XG4gICAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfTtcbiAgfVxuXG59XG5cblJlc3BvbnNlRm9ybWF0dGVyLnByb3RvdHlwZS5lcnJvciA9IHJlcXVpcmUoJy4vbGliL2Vycm9yJyk7XG5cbi8qKlxuICBDb252ZW5pZW5jZSBtZXRob2QgZm9yIGNyZWF0aW5nIGEgbmV3IGVsZW1lbnRcblxuICBAdG9kbzogbWlzc2luZyBwYXJhbXMgbGlzdGluZ1xuKi9cblJlc3BvbnNlRm9ybWF0dGVyLnByb3RvdHlwZS5jcmVhdGUgPSBSZXNwb25zZUZvcm1hdHRlci5tZXRob2QocmVxdWlyZSgnLi9saWIvY3JlYXRlJykpO1xuXG4vKipcbiAgQ29udmVuaWVuY2UgbWV0aG9kIGZvciByZXRyaWV2aW5nIGFuIGVsZW1lbnQgb3IgYSBjb2xsZWN0aW9uIHVzaW5nXG4gIHRoZSB1bmRlcmx5aW5nIGFkYXB0ZXIuXG5cbiAgQHRvZG86IG1pc3NpbmcgcGFyYW1zIGxpc3RpbmdcbiovXG5SZXNwb25zZUZvcm1hdHRlci5wcm90b3R5cGUucmVhZCA9IFJlc3BvbnNlRm9ybWF0dGVyLm1ldGhvZChyZXF1aXJlKCcuL2xpYi9yZWFkJykpO1xuXG4vKipcbiAgQ29udmVuaWVuY2UgbWV0aG9kIGZvciB1cGRhdGluZyBvbmUgb3IgbW9yZSBhdHRyaWJ1dGVzIG9uIGFuIGVsZW1lbnRcbiAgdXNpbmcgdGhlIHVuZGVybHlpbmcgYWRhcHRlci4uXG5cbiAgQHRvZG86IG1pc3NpbmcgcGFyYW1zIGxpc3RpbmdcbiAqL1xuUmVzcG9uc2VGb3JtYXR0ZXIucHJvdG90eXBlLnVwZGF0ZSA9IFJlc3BvbnNlRm9ybWF0dGVyLm1ldGhvZChyZXF1aXJlKCcuL2xpYi91cGRhdGUnKSk7XG5cbi8qKlxuICBDb252ZW5pZW5jZSBtZXRob2QgZm9yIGRlbGV0aW5nIGFuIGVsZW1lbnQgdXNpbmcgdGhlIHVuZGVybHlpbmcgYWRhcHRlci5cblxuICBAdG9kbzogbWlzc2luZyBwYXJhbXMgbGlzdGluZ1xuICovXG5SZXNwb25zZUZvcm1hdHRlci5wcm90b3R5cGUuZGVzdHJveSA9IFJlc3BvbnNlRm9ybWF0dGVyLm1ldGhvZChyZXF1aXJlKCcuL2xpYi9kZXN0cm95JykpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3BvbnNlRm9ybWF0dGVyO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVzcG9uc2UtZm9ybWF0dGVyL2luZGV4LmpzXG4gKiovIiwiY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5jb25zdCBmb3JtYXRNb2RlbCA9IHJlcXVpcmUoJy4vbGliL2Zvcm1hdF9tb2RlbCcpO1xuXG4vKipcbiAgVGhlIHJvbGUgb2YgdGhpcyBtb2R1bGUgaXMgdG8gdGFrZSBhIHNpbmdsZSBtb2RlbCBvciBjb2xsZWN0aW9uIG9mIG1vZGVsc1xuICBhbmQgY29udmVydCB0aGVtIGludG8gYSByZXByZXNlbnRhdGlvbiB0aGF0IGlzIGpzb24tYXBpIGNvbXBsaWFudC5cblxuICBAcGFyYW0ge0Jvb2tzaGVsZi5Nb2RlbHxCb29rc2hlbGYuQ29sbGVjdGlvbn0gaW5wdXRcbiAgQHBhcmFtIHtPYmplY3R9IG9wdHMgLVxuICAgICBzaW5nbGVSZXN1bHQ6IGJvb2xlYW4gaW5kaWNhdGluZyBpZiByZXN1bHQgc2hvdWxkIGJlIHNpbmd1bGFyXG4gICAgICAgICAgICAgICAgICAgICB0aGlzIGlzIG5lZWRlZCBiZWNhdXNlIHRoZSBxdWVyeWluZyBzeXN0ZW0gYWx3YXlzXG4gICAgICAgICAgICAgICAgICAgICByZXR1cm5zIGEgY29sbGVjdGlvbi0tYnV0IHNvbWV0aW1lcyB5b3Ugb25seSB3YW50XG4gICAgICAgICAgICAgICAgICAgICBhIHNpbmdsZSBpdGVtIChlLmcuIC9hdXRob3JzLzEpXG4gICAgICAgcmVsYXRpb25zOiBhbiBhcnJheSBvZiBkb3Qtbm90YXRlZCByZWxhdGlvbiBzdHJpbmdzLiB0aGVzZSByZWxhdGlvbnNcbiAgICAgICAgICAgICAgICAgIGFyZSBhdHRhY2hlZCB0byB0aGUgbW9kZWwgYW5kIG5lZWQgdG8gYmUgZXh0cmFjdGVkIGludG9cbiAgICAgICAgICAgICAgICAgIHRoZSB0b3AgbGV2ZWwgaW5jbHVkZWQgY29sbGVjdGlvblxuICAgICAgIHR5cGVOYW1lOiB0aGUgdHlwZSBvZiB0aGUgcHJpbWFyeSByZXNvdXJjZSBiZWluZyByZXF1ZXN0ZWRcbiAgICAgICAgICAgICAgICAgaSB0aGluayB3ZSBtaWdodCBiZSBhYmxlIHRvIHJlbW92ZSB0aGlzLCBpdCBzaG91bGQgYWx3YXlzXG4gICAgICAgICAgICAgICAgIGJlIGF2YWlsYWJsZSBvZmYgdGhlIGNvbGxlY3Rpb25cbiAgQHJldHVybnMge09iamVjdHxBcnJheX0ganNvbi1hcGkgY29tcGxpYW50IGZvcm1hdHRlZCByZXNwb25zZVxuXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5wdXQsIG9wdHM9e30pIHtcbiAgdmFyIGluY2x1ZGVkID0gW107XG4gIHZhciB0b3BMZXZlbExpbmtzO1xuXG4gIC8qKlxuICAgIFJlY2lldmVzIGVhY2ggbW9kZWwgdGhhdCB3YXMgZXhwbGljdGx5IHNpZGVsb2FkZWRcbiAgICBGb3IgZXhhbXBsZSBnaXZlbiBhIHJlcXVlc3QgYEdFVCAvYXV0aG9yLzE/aW5jbHVkZT1ib29rc2AsIGVhY2ggYm9va1xuICAgIHJlbGF0ZWQgdG8gdGhlIGF1dGhvciB3b3VsZCBwYXNzIHRocm91Z2ggdGhpcyBtZXRob2QuXG5cbiAgICBAcGFyYW0ge09iamVjdH0gbW9kZWwgLSBFeHBsaWNpdGx5IHNpZGVsb2FkZWQgbW9kZWwuXG4gICovXG4gIG9wdHMuZXhwb3J0ZXIgPSBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAvLyBlYWNoIG1vZGVsIHRoYXQgYXBwZWFycyBpbiB0aGUgdG9wIGxldmVsIGluY2x1ZGVkIG9iamVjdCBpcyBpdHNlbGZcbiAgICAvLyBhIGJvb2tzaGVsZiBtb2RlbCB0aGF0IG5lZWRzIHRvIGJlIGZvcm1hdHRlZCBmb3IganNvbi1hcGkgY29tcGxpYW5jZVxuICAgIC8vIHRvby4gd2UgKmNvdWxkKiBhbGxvdyBsaW5rcyB3aXRoaW4gbGlua3MgYnkgcmVjdXJzaW5nIGhlcmUgYnV0IGlcbiAgICAvLyBkb24ndCB0aGluayBpdCBpcyBuZWVkZWQuLi4geWV0P1xuICAgIGluY2x1ZGVkLnB1c2goZm9ybWF0TW9kZWwobnVsbCwgbW9kZWwpKTtcbiAgfTtcblxuICBvcHRzLnRvcExldmVsTGlua2VyID0gZnVuY3Rpb24gKGxpbmtzKSB7XG4gICAgdG9wTGV2ZWxMaW5rcyA9IGxpbmtzO1xuICB9O1xuXG4gIC8qKlxuICAgIEB0b2RvIGZvcm1hdHRpbmc/XG4gICAgVGhpcyBpcyBpcyBhIHBhcnRpYWxseSBhcHBsaWVkIHZlcnNpb24gb2YgZm9ybWF0TW9kZWwuXG4gICovXG4gIHZhciBmb3JtYXR0ZXIgPSBmb3JtYXRNb2RlbC5iaW5kKG51bGwsIG9wdHMpO1xuXG4gIC8qKlxuICAgIEZvcm1hdHMgZXZlcnkgaW5jb21pbmcgbW9kZWxcbiAgKi9cbiAgdmFyIHNlcmlhbGl6ZWQgPSBpbnB1dC5tYXAgPyBpbnB1dC5tYXAoZm9ybWF0dGVyKSA6IGZvcm1hdHRlcihpbnB1dCk7XG5cbiAgLyoqXG4gICAgSWYgd2UgYXJlIHJlcXVlc3RpbmcgYSBzaW5nbGUgaXRlbSwgcmV0dXJuIGl0IGFzIGFuIG9iamVjdCwgbm90IGFuIGFycmF5LlxuICAqL1xuICBpZiAob3B0cy5zaW5nbGVSZXN1bHQgJiYgXy5pc0FycmF5KHNlcmlhbGl6ZWQpKSB7XG4gICAgc2VyaWFsaXplZCA9IGlucHV0Lmxlbmd0aCA/IHNlcmlhbGl6ZWRbMF0gOiBudWxsO1xuICB9XG5cblxuICAvKipcbiAgICBQcmVwYXJlIGpzb24tYXBpIGNvbXBsaWFudCBvdXRwdXRcbiAgKi9cbiAgdmFyIG91dHB1dCA9IHtcbiAgICBkYXRhOiBzZXJpYWxpemVkXG4gIH07XG5cbiAgaWYgKHRvcExldmVsTGlua3MpIHtcbiAgICBvdXRwdXQubGlua3MgPSB0b3BMZXZlbExpbmtzO1xuICB9XG5cbiAgLy8gaWYgdGhlIGV4cG9ydGVyIHdhcyBldmVyIGNhbGxlZCwgd2Ugc2hvdWxkIGhhdmUgb2JqZWN0cyBpblxuICAvLyB0aGUgaW5jbHVkZWQgYXJyYXkuIHNpbmNlIGl0IGlzIHBvc3NpYmxlIGZvciB0aGUgc2FtZSBtb2RlbFxuICAvLyB0byBiZSBpbmNsdWRlZCBtb3JlIHRoYW4gb25jZSwgcHJ1bmUgYW55IGR1cGxpY2F0ZXMuXG4gIGlmIChpbmNsdWRlZC5sZW5ndGggPiAwKSB7XG4gICAgb3V0cHV0LmluY2x1ZGVkID0gXyhpbmNsdWRlZCkuZmxhdHRlbigpLnVuaXEoZnVuY3Rpb24ocmVsKSB7XG4gICAgICByZXR1cm4gcmVsLnR5cGUgKyByZWwuaWQ7XG4gICAgfSkudmFsdWUoKTtcbiAgfVxuXG4gIC8qKlxuICAgXCJiYW0sIGRvbmUuXCJcbiAgKi9cbiAgcmV0dXJuIG91dHB1dDtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9mb3JtYXR0ZXItanNvbmFwaS9pbmRleC5qc1xuICoqLyIsImNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbmNvbnN0IHJlcXVpcmVTaWxlbnQgPSByZXF1aXJlKCcuL3JlcXVpcmVfc2lsZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZpbGUsIHNlYXJjaFBhdGhzKSB7XG4gIGlmICghc2VhcmNoUGF0aHMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHNlYXJjaFBhdGhzIHNwZWNpZmllZC4nKTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgdmFyIGxlbiA9IHNlYXJjaFBhdGhzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBjdXJyZW50UGF0aCA9IHBhdGguam9pbihzZWFyY2hQYXRoc1tpXSwgZmlsZSk7XG4gICAgdmFyIG5vdEZvdW5kSW5Gb3VuZEZpbGUgPSBmYWxzZTtcbiAgICByZXN1bHQgPSByZXF1aXJlU2lsZW50KGN1cnJlbnRQYXRoKTtcbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIC8vIGhhbmRsZSBzaXR1YXRpb25zIHdoZXJlIGEgZmlsZSBpcyBmb3VuZCwgYnV0IHJlcXVpcmluZyBpdFxuICAgICAgLy8gc3RpbGwgdGhyb3dzIGEgTU9EVUxFX05PVF9GT1VORCBlcnJvciBiZWNhdXNlIHRoYXQgZmlsZVxuICAgICAgLy8gZGVwZW5kcyBvbiBzb21ldGhpbmcgZWxzZSB3aGljaCBjYW4ndCBiZSBmb3VuZC4gYm95IHRoaXNcbiAgICAgIC8vIGlzIHVnbHkuXG4gICAgICBub3RGb3VuZEluRm91bmRGaWxlID0gcmVzdWx0Lm1lc3NhZ2UuaW5kZXhPZihjdXJyZW50UGF0aCkgPT09IC0xO1xuICAgICAgaWYgKHJlc3VsdC5jb2RlICE9PSAnTU9EVUxFX05PVF9GT1VORCcgfHwgbm90Rm91bmRJbkZvdW5kRmlsZSkge1xuICAgICAgICB0aHJvdyByZXN1bHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBjdXJyZW50UGF0aDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBpZiAoIXJlc3VsdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBVbmFibGUgdG8gbG9jYXRlIFwiJHtmaWxlfVwiIGluIHNlYXJjaCBwYXRoczogJHtzZWFyY2hQYXRocy5qb2luKCcsICcpfWBcbiAgICApO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYXBwbGljYXRpb24vbGliL3JlcXVpcmVfc2VhcmNoLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZmlsZSkge1xuICB0cnkge1xuICAgIHJldHVybiByZXF1aXJlKGZpbGUpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGU7XG4gIH1cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9hcHBsaWNhdGlvbi9saWIvcmVxdWlyZV9zaWxlbnQuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgZGVsZXRlIGRhdGEudHlwZTtcbiAgZGVsZXRlIGRhdGEubGlua3M7XG4gIHJldHVybiBkYXRhO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2FkYXB0ZXItYm9va3NoZWxmL2xpYi9zYW5pdGl6ZV9yZXF1ZXN0X2RhdGEuanNcbiAqKi8iLCJjb25zdCBLYXBvdyA9IHJlcXVpcmUoJ2thcG93Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgaWYgKG1vZGVsKSB7XG4gICAgdGhyb3cgS2Fwb3coNDA5LCAnTW9kZWwgd2l0aCB0aGlzIElEIGFscmVhZHkgZXhpc3RzJyk7XG4gIH1cbiAgcmV0dXJuIG1vZGVsO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlcXVlc3QtaGFuZGxlci9saWIvdGhyb3dfaWZfbW9kZWwuanNcbiAqKi8iLCJjb25zdCBLYXBvdyA9IHJlcXVpcmUoJ2thcG93Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgaWYgKCFtb2RlbCkge1xuICAgIHRocm93IEthcG93KDQwNCwgJ1VuYWJsZSB0byBsb2NhdGUgbW9kZWwuJyk7XG4gIH1cblxuICAvLyBCb29rc2hlbGYgdGhyb3dzIGFuIGVycm9yIGZvciBhbnkgbnVtYmVyIG9mIHVucmVsYXRlZCByZWFzb25zLlxuICAvLyBqc29uLWFwaSByZXF1aXJlcyB3ZSB0aHJvdyBzcGVjaWZpYyBlcnJvcnMgZm9yIGNlcnRhaW4gc2l0dWF0aW9ucy5cbiAgaWYgKG1vZGVsIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICBpZiAoXG4gICAgICAvTm8gcm93cyB3ZXJlIGFmZmVjdGVkLy50ZXN0KG1vZGVsLm1lc3NhZ2UpIHx8XG4gICAgICAvVW5hYmxlIHRvIGxvY2F0ZSBtb2RlbC8udGVzdChtb2RlbC5tZXNzYWdlKVxuICAgICkge1xuICAgICAgbW9kZWwgPSBLYXBvdy53cmFwKG1vZGVsLCA0MDQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtb2RlbCA9IEthcG93LndyYXAobW9kZWwsIDUwMCk7XG4gICAgfVxuICAgIHRocm93IG1vZGVsO1xuICB9XG5cbiAgcmV0dXJuIG1vZGVsO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlcXVlc3QtaGFuZGxlci9saWIvdGhyb3dfaWZfbm9fbW9kZWwuanNcbiAqKi8iLCJjb25zdCBLYXBvdyA9IHJlcXVpcmUoJ2thcG93Jyk7XG5jb25zdCBFWFBFQ1RFRF9BQ0NFUFQgPSAnYXBwbGljYXRpb24vdm5kLmFwaStqc29uJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gIHZhciBlcnI7XG5cbiAgdmFyIGhlYWRlcnMgPSByZXF1ZXN0LmhlYWRlcnM7XG4gIHZhciBhY2NlcHQgPSBoZWFkZXJzLmFjY2VwdDtcbiAgdmFyIGlzQnJvd3NlciA9IGFjY2VwdCAmJiBhY2NlcHQuaW5kZXhPZigndGV4dC9odG1sJykgIT09IC0xO1xuXG4gIHZhciBpc1ZhbGlkQWNjZXB0ID0gKFxuICAgIGFjY2VwdCAmJlxuICAgIGFjY2VwdC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoRVhQRUNURURfQUNDRVBUKSA9PT0gMFxuICApO1xuXG4gIGlmICghaXNWYWxpZEFjY2VwdCAmJiAhaXNCcm93c2VyKSB7XG4gICAgZXJyID0gS2Fwb3coNDA2LCAnQ29udGVudC1UeXBlIG11c3QgYmUgXCInICsgRVhQRUNURURfQUNDRVBUICsgJ1wiJyk7XG4gIH1cblxuICByZXR1cm4gZXJyO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlcXVlc3QtaGFuZGxlci9saWIvdmVyaWZ5X2FjY2VwdC5qc1xuICoqLyIsImNvbnN0IEthcG93ID0gcmVxdWlyZSgna2Fwb3cnKTtcbmNvbnN0IEVYUEVDVEVEX1RZUEUgPSAnYXBwbGljYXRpb24vdm5kLmFwaStqc29uJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gIHZhciBlcnI7XG5cbiAgdmFyIGNvbnRlbnRUeXBlID0gcmVxdWVzdC5oZWFkZXJzWydjb250ZW50LXR5cGUnXTtcblxuICB2YXIgaXNWYWxpZENvbnRlbnRUeXBlID0gKFxuICAgIGNvbnRlbnRUeXBlICYmXG4gICAgY29udGVudFR5cGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKEVYUEVDVEVEX1RZUEUpID09PSAwXG4gICk7XG5cbiAgaWYgKCFpc1ZhbGlkQ29udGVudFR5cGUpIHtcbiAgICBlcnIgPSBLYXBvdyg0MTUsICdDb250ZW50LVR5cGUgbXVzdCBiZSBcIicgKyBFWFBFQ1RFRF9UWVBFICsgJ1wiJyk7XG4gIH1cblxuICByZXR1cm4gZXJyO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlcXVlc3QtaGFuZGxlci9saWIvdmVyaWZ5X2NvbnRlbnRfdHlwZS5qc1xuICoqLyIsImNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbmNvbnN0IEthcG93ID0gcmVxdWlyZSgna2Fwb3cnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyZXF1ZXN0LCBlbmRwb2ludCkge1xuICB2YXIgZXJyLCBpc1ZhbGlkVHlwZSwgaWQ7XG4gIHZhciBkYXRhID0gcmVxdWVzdC5ib2R5LmRhdGE7XG5cbiAgaWYgKCFfLmlzUGxhaW5PYmplY3QoZGF0YSkgJiYgIV8uaXNBcnJheShkYXRhKSkge1xuICAgIGVyciA9IEthcG93KDQwMCwgJ1ByaW1hcnkgZGF0YSBtdXN0IGJlIGEgc2luZ2xlIG9iamVjdCBvciBhcnJheS4nKTtcbiAgICByZXR1cm4gZXJyO1xuICB9XG5cbiAgaWYgKF8uaXNBcnJheShkYXRhKSkge1xuICAgIGlzVmFsaWRUeXBlID0gXy5yZWR1Y2UoZGF0YSwgZnVuY3Rpb24oaXNWYWxpZCwgcmVzb3VyY2UpIHtcbiAgICAgIGlmICghcmVzb3VyY2UudHlwZSB8fCB0eXBlb2YgcmVzb3VyY2UudHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfSwgdHJ1ZSk7XG4gIH0gZWxzZSB7XG4gICAgaXNWYWxpZFR5cGUgPSB0eXBlb2YgZGF0YS50eXBlID09PSAnc3RyaW5nJztcbiAgfVxuXG4gIGlkID0gcmVxdWVzdC5wYXJhbXMgJiYgcmVxdWVzdC5wYXJhbXMuaWQ7XG5cbiAgaWYgKCFpc1ZhbGlkVHlwZSkge1xuICAgIGVyciA9IEthcG93KDQwMCwgJ1ByaW1hcnkgZGF0YSBtdXN0IGluY2x1ZGUgYSB0eXBlLicpO1xuICAgIHJldHVybiBlcnI7XG4gIH1cblxuLypcbiAgLy8gVE9ETzogZml4IHRoaXMuIGF0IHRoZSBtb21lbnQsIGlmIHlvdSB0cnkgdG8gZG8gc29tZXRoaW5nIGxpa2VcbiAgLy8gUEFUQ0ggL2Jvb2tzLzEvYXV0aG9yLCB0aGUgdGFyZ2V0IHR5cGUgb2YgdGhhdCByZXF1ZXN0IGlzICdib29rcydcbiAgLy8gd2hlbiBpdCBzaG91bGQgYWN0dWFsbHkgYmUgJ2F1dGhvcnMnIHRoaXMgZGlzYWJsZXMgdHlwZSBjaGVja2luZ1xuICAvLyBmb3Igd3JpdGUgb3BlcmF0aW9ucyB1bnRpbCB0aGlzIGNhbiBiZSByZXNvbHZlZC5cbiAgaWYgKCF3cml0ZVJlbGF0aW9uICYmIHR5cGUgIT09IGVuZHBvaW50LnR5cGVOYW1lKSB7XG4gICAgZXJyID0gS2Fwb3coNDA5LCAnRGF0YSB0eXBlIGRvZXMgbm90IG1hdGNoIGVuZHBvaW50IHR5cGUuJyk7XG4gICAgcmV0dXJuIGVycjtcbiAgfVxuXG4gIC8vIFRPRE86IGZpeCB0aGlzLiBhdCB0aGUgbW9tZW50LCBpZiB5b3UgdHJ5IHRvIGRvIHNvbWV0aGluZyBsaWtlXG4gIC8vIFBBVENIIC9ib29rcy8xL2F1dGhvciwgdGhlIHRhcmdldCBpZCBvZiB0aGF0IHJlcXVlc3QgZG9lc24ndCBtYXRjaFxuICAvLyB0aGUgYWN0dWFsIHJlc291cmNlIGJlaW5nIHRhcmdldHRlZC5cbiAgaWYgKGlkICYmIGRhdGEuaWQgJiYgaWQgIT09IGRhdGEuaWQpIHtcbiAgICBlcnIgPSBLYXBvdyg0MDksICdEYXRhIGlkIGRvZXMgbm90IG1hdGNoIGVuZHBvaW50IGlkLicpO1xuICAgIHJldHVybiBlcnI7XG4gIH1cblxuICAqL1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlcXVlc3QtaGFuZGxlci9saWIvdmVyaWZ5X2RhdGFfb2JqZWN0LmpzXG4gKiovIiwiY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gXy50cmFuc2Zvcm0ob2JqLCBmdW5jdGlvbihyZXN1bHQsIG4sIGtleSkge1xuICAgIHJlc3VsdFtrZXldID0gU3RyaW5nKG4pLnNwbGl0KCcsJyk7XG4gIH0pO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlcXVlc3QtaGFuZGxlci9saWIvc3BsaXRfc3RyaW5nX3Byb3BzLmpzXG4gKiovIiwiY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuY29uc3QgS2Fwb3cgPSByZXF1aXJlKCdrYXBvdycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiAgdmFyIGVycjtcbiAgdmFyIGRhdGEgPSByZXF1ZXN0LmJvZHkuZGF0YTtcblxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgIGVyciA9IF8uc29tZShkYXRhLCAnaWQnKTtcbiAgfSBlbHNlIHtcbiAgICBlcnIgPSAhIWRhdGEuaWQ7XG4gIH1cblxuICByZXR1cm4gZXJyICA/IEthcG93KDQwMywgJ0NsaWVudCBnZW5lcmF0ZWQgSURzIGFyZSBub3QgZW5hYmxlZC4nKSA6IG51bGw7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVxdWVzdC1oYW5kbGVyL2xpYi92ZXJpZnlfY2xpZW50X2dlbmVyYXRlZF9pZC5qc1xuICoqLyIsImNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbmNvbnN0IEthcG93ID0gcmVxdWlyZSgna2Fwb3cnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXJycywgZGVmYXVsdEVycikge1xuICB2YXIgcmVzcDtcblxuICBkZWZhdWx0RXJyID0gZGVmYXVsdEVyciB8fCA0MDA7XG4gIGVycnMgPSBlcnJzIHx8IFtLYXBvdyhkZWZhdWx0RXJyKV07XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGVycnMpKSB7XG4gICAgZXJycyA9IFtlcnJzXTtcbiAgfVxuXG4gIHJlc3AgPSBfLnRyYW5zZm9ybShlcnJzLCBmdW5jdGlvbihyZXN1bHQsIGVycikge1xuICAgIGlmICghZXJyLmh0dHBTdGF0dXMpIHtcbiAgICAgIGVyciA9IEthcG93LndyYXAoZXJyLCBkZWZhdWx0RXJyKTtcbiAgICB9XG5cbiAgICB2YXIgaHR0cFN0YXR1cyA9IGVyci5odHRwU3RhdHVzO1xuXG4gICAgcmVzdWx0LmNvZGVbaHR0cFN0YXR1c10gPSByZXN1bHQuY29kZVtodHRwU3RhdHVzXSA/IHJlc3VsdC5jb2RlW2h0dHBTdGF0dXNdICsgMSA6IDE7XG5cbiAgICByZXN1bHQuZGF0YS5lcnJvcnMucHVzaCh7XG4gICAgICB0aXRsZTogZXJyLnRpdGxlLFxuICAgICAgZGV0YWlsOiBlcnIubWVzc2FnZVxuICAgIH0pO1xuICB9LCB7XG4gICAgY29kZToge30sXG4gICAgZGF0YToge1xuICAgICAgZXJyb3JzOiBbXVxuICAgIH1cbiAgfSk7XG5cbiAgcmVzcC5jb2RlID0gXy5yZWR1Y2UocmVzcC5jb2RlLCBmdW5jdGlvbihyZXN1bHQsIG4sIGtleSkge1xuICAgIGlmICghcmVzdWx0IHx8IG4gPiByZXNwLmNvZGVbcmVzdWx0XSkge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSwgJycpO1xuXG4gIHJldHVybiByZXNwO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3Jlc3BvbnNlLWZvcm1hdHRlci9saWIvZXJyb3IuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmb3JtYXR0ZXIsIGNvbmZpZywgZGF0YSkge1xuICByZXR1cm4ge1xuICAgIGNvZGU6ICcyMDEnLFxuICAgIGRhdGE6IGZvcm1hdHRlcihkYXRhLCB7XG4gICAgICBzaW5nbGVSZXN1bHQ6IHRydWVcbiAgICB9KSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICBsb2NhdGlvbjogJy8nICsgY29uZmlnLnR5cGVOYW1lICsgJy8nICsgZGF0YS5pZFxuICAgIH1cbiAgfTtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZXNwb25zZS1mb3JtYXR0ZXIvbGliL2NyZWF0ZS5qc1xuICoqLyIsImNvbnN0IEthcG93ID0gcmVxdWlyZSgna2Fwb3cnKTtcbmNvbnN0IGVycm9yID0gcmVxdWlyZSgnLi9lcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmb3JtYXR0ZXIsIGNvbmZpZywgZGF0YSkge1xuICBpZiAoKCFkYXRhIHx8IGRhdGEubGVuZ3RoID09PSAwICYmIGRhdGEuc2luZ2xlUmVzdWx0KSAmJiBkYXRhLm1vZGUgIT09ICdyZWxhdGVkJykge1xuICAgIHJldHVybiBlcnJvcihLYXBvdyg0MDQsICdSZXNvdXJjZSBub3QgZm91bmQuJykpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjb2RlOiAnMjAwJyxcbiAgICBkYXRhOiBmb3JtYXR0ZXIoZGF0YSwge1xuICAgICAgc2luZ2xlUmVzdWx0OiBkYXRhLnNpbmdsZVJlc3VsdCxcbiAgICAgIHJlbGF0aW9uczogZGF0YS5yZWxhdGlvbnMsXG4gICAgICBtb2RlOiBkYXRhLm1vZGUsXG4gICAgICBiYXNlVHlwZTogZGF0YS5iYXNlVHlwZSxcbiAgICAgIGJhc2VJZDogZGF0YS5iYXNlSWQsXG4gICAgICBiYXNlUmVsYXRpb246IGRhdGEuYmFzZVJlbGF0aW9uXG4gICAgfSlcbiAgfTtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZXNwb25zZS1mb3JtYXR0ZXIvbGliL3JlYWQuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmb3JtYXR0ZXIsIGNvbmZpZywgZGF0YSkge1xuICBpZiAoZGF0YSAmJiAhY29uZmlnLnJlbGF0aW9uT25seSkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2RlOiAnMjAwJyxcbiAgICAgIGRhdGE6IGZvcm1hdHRlcihkYXRhLCBjb25maWcpXG4gICAgfTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGNvZGU6ICcyMDQnLFxuICAgIGRhdGE6IG51bGxcbiAgfTtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZXNwb25zZS1mb3JtYXR0ZXIvbGliL3VwZGF0ZS5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZvcm1hdHRlciwgY29uZmlnLCBkYXRhKSB7XG4gIHJldHVybiB7XG4gICAgY29kZTogJzIwNCcsXG4gICAgZGF0YTogbnVsbFxuICB9O1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3Jlc3BvbnNlLWZvcm1hdHRlci9saWIvZGVzdHJveS5qc1xuICoqLyIsImNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuY29uc3QgdG9PbmVSZWxhdGlvbnMgPSByZXF1aXJlKCcuL3RvX29uZV9yZWxhdGlvbnMnKTtcbmNvbnN0IGxpbmsgPSByZXF1aXJlKCcuL2xpbmsnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0cywgbW9kZWwpIHtcbiAgdmFyIHRvcExldmVsTGlua3M7XG4gIHZhciBleHBvcnRlciA9IG9wdHMgJiYgb3B0cy5leHBvcnRlcjtcbiAgdmFyIG1vZGUgPSBvcHRzICYmIG9wdHMubW9kZTtcbiAgdmFyIHJlbGF0aW9ucyA9IG9wdHMgJiYgb3B0cy5yZWxhdGlvbnM7XG5cbiAgLy8gZ2V0IHRoZSB1bmRlcmx5aW5nIG1vZGVsIHR5cGVcbiAgdmFyIHR5cGVOYW1lID0gbW9kZWwuY29uc3RydWN0b3IudHlwZU5hbWU7XG4gIC8vIGdldCB0aGUgbGlzdCBvZiByZWxhdGlvbnMgd2UgaW50ZW5kIHRvIGluY2x1ZGUgKHNpZGVsb2FkKVxuICB2YXIgbGlua1dpdGhJbmNsdWRlID0gcmVsYXRpb25zO1xuICAvLyBnZXQgYWxsIHBvc3NpYmxlIHJlbGF0aW9ucyBmb3IgdGhlIG1vZGVsXG4gIHZhciBhbGxSZWxhdGlvbnMgPSBtb2RlbC5jb25zdHJ1Y3Rvci5yZWxhdGlvbnM7XG4gIC8vIG9mIGFsbCBsaXN0ZWQgcmVsYXRpb25zLCBkZXRlcm1pbmUgd2hpY2ggYXJlIHRvT25lIHJlbGF0aW9uc1xuICB2YXIgdG9PbmVSZWxzID0gdG9PbmVSZWxhdGlvbnMobW9kZWwsIGFsbFJlbGF0aW9ucyk7XG4gIC8vIGdldCB0aGUgbGlzdCBvZiByZWxhdGlvbnMgd2UgaGF2ZSBub3QgaW5jbHVkZWRcbiAgdmFyIGxpbmtXaXRob3V0SW5jbHVkZSA9IF8uZGlmZmVyZW5jZShhbGxSZWxhdGlvbnMsIGxpbmtXaXRoSW5jbHVkZSk7XG4gIC8vIGdldCBhIGpzb24gcmVwcmVzZW50YXRpb24gb2YgdGhlIG1vZGVsLCBleGNsdWRpbmcgYW55IHJlbGF0ZWQgZGF0YVxuICB2YXIgc2VyaWFsaXplZCA9IG1vZGVsLnRvSlNPTih7c2hhbGxvdzp0cnVlfSk7XG4gIC8vIGpzb24tYXBpIHJlcXVpcmVzIGlkIGJlIGEgc3RyaW5nIC0tIHNob3VsZG4ndCByZWx5IG9uIHNlcnZlclxuICBzZXJpYWxpemVkLmlkID0gU3RyaW5nKHNlcmlhbGl6ZWQuaWQpO1xuICAvLyBJbmNsdWRlIHR5cGUgb24gcHJpbWFyeSByZXNvdXJjZVxuICBzZXJpYWxpemVkLnR5cGUgPSB0eXBlTmFtZTtcbiAgLy8gUmVtb3ZlIGZvcmVpZ24ga2V5cyBmcm9tIG1vZGVsXG4gIGZvciAodmFyIHJlbCBpbiB0b09uZVJlbHMpIHtcbiAgICBkZWxldGUgc2VyaWFsaXplZFt0b09uZVJlbHNbcmVsXV07XG4gIH1cbiAgaWYgKG1vZGUgPT09ICdyZWxhdGlvbicpIHtcbiAgICB0b3BMZXZlbExpbmtzID0gbGluayhtb2RlbCwgb3B0cyk7XG4gIH0gZWxzZSB7XG4gICAgc2VyaWFsaXplZC5saW5rcyA9IGxpbmsobW9kZWwsIHtcbiAgICAgIGxpbmtXaXRoSW5jbHVkZTogbGlua1dpdGhJbmNsdWRlLFxuICAgICAgbGlua1dpdGhvdXRJbmNsdWRlOiBsaW5rV2l0aG91dEluY2x1ZGUsXG4gICAgICBleHBvcnRlcjogZXhwb3J0ZXJcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gc2VyaWFsaXplZDtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9mb3JtYXR0ZXItanNvbmFwaS9saWIvZm9ybWF0X21vZGVsLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobW9kZWwsIHJlbGF0aW9ucykge1xuICBpZiAoIUFycmF5LmlzQXJyYXkocmVsYXRpb25zKSkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuICByZXR1cm4gcmVsYXRpb25zLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCByZWxhdGlvbk5hbWUpIHtcbiAgICAvLyBuZXN0ZWQgcmVsYXRpb25zIGFyZSBzcGVjaWZpZWQgYnkgZG90IG5vdGF0ZWQgc3RyaW5nc1xuICAgIC8vIGlmIGEgcmVsYXRpb24gaGFzIGEgZG90IGluIGl0LCBpdCBpcyBuZXN0ZWQsIGFuZCB0aGVyZWZvclxuICAgIC8vIGNhbm5vdCBiZSBhIHRvT25lIHJlbGF0aW9uLiBpZ25vcmUgaXQuXG4gICAgaWYgKHJlbGF0aW9uTmFtZS5pbmRleE9mKCcuJykgIT09IC0xKSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvLyBmaW5kIHJlbGF0ZWQgaW5mb3JtYXRpb24gYWJvdXQgdGhlIG1vZGVsXG4gICAgdmFyIHJlbGF0aW9uID0gbW9kZWwucmVsYXRlZChyZWxhdGlvbk5hbWUpO1xuICAgIHZhciByZWxLZXkgPSByZWxhdGlvbi5yZWxhdGVkRGF0YS5mb3JlaWduS2V5O1xuICAgIC8vIGlmIGEgcmVsYXRpb24gaXMgc3BlY2lmaWVkIG9uIHRoZSBtb2RlbCB0aGF0IGRvZXNuJ3RcbiAgICAvLyBhY3R1YWxseSBleGlzdCwgd2Ugc2hvdWxkIGJhaWwgb3V0IHF1aWNrbHkuXG4gICAgaWYgKCFyZWxhdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnUmVsYXRpb24gJyArIHJlbGF0aW9uTmFtZSArICcgaXMgbm90IGRlZmluZWQgb24gJyArIG1vZGVsLnRhYmxlTmFtZVxuICAgICAgKTtcbiAgICB9XG4gICAgLy8gaXMgdGhpcyByZWxhdGlvbiBvZiBhIGtpbmQgd2UgY2FyZSBhYm91dD8gaWYgeWVzLCBhZGQgaXQhXG4gICAgaWYgKHJlbGF0aW9uLnJlbGF0ZWREYXRhLnR5cGUgPT09ICdiZWxvbmdzVG8nKSB7XG4gICAgICByZXN1bHRbcmVsYXRpb25OYW1lXSA9IHJlbEtleTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSwge30pO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2Zvcm1hdHRlci1qc29uYXBpL2xpYi90b19vbmVfcmVsYXRpb25zLmpzXG4gKiovIiwiY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5jb25zdCByZWxhdGUgPSByZXF1aXJlKCcuL3JlbGF0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtb2RlbCwgb3B0cz17fSkge1xuICB2YXIgbGlua3MgPSB7fTtcbiAgdmFyIHByaW1hcnlUeXBlID0gbW9kZWwuY29uc3RydWN0b3IudHlwZU5hbWU7XG4gIHZhciBsaW5rV2l0aG91dEluY2x1ZGVzID0gb3B0cy5saW5rV2l0aG91dEluY2x1ZGUgfHwgW107XG4gIHZhciBsaW5rV2l0aEluY2x1ZGVzID0gb3B0cy5saW5rV2l0aEluY2x1ZGUgfHwgW107XG4gIHZhciBleHBvcnRlciA9IG9wdHMuZXhwb3J0ZXI7XG4gIHZhciB0b3BMZXZlbExpbmtlciA9IG9wdHMudG9wTGV2ZWxMaW5rZXI7XG5cbiAgaWYgKHRvcExldmVsTGlua2VyKSB7XG4gICAgbGlua3Muc2VsZiA9ICcvJyArIG9wdHMuYmFzZVR5cGUgKyAnLycgKyBvcHRzLmJhc2VJZCArICcvbGlua3MvJyArIG9wdHMuYmFzZVJlbGF0aW9uO1xuICAgIGxpbmtzLnJlbGF0ZWQgPSAnLycgKyBvcHRzLmJhc2VUeXBlICsgJy8nICsgb3B0cy5iYXNlSWQgKyAnLycgKyBvcHRzLmJhc2VSZWxhdGlvbjtcbiAgICB0b3BMZXZlbExpbmtlcihsaW5rcyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gVG8tb25lIGxpbmsgcmVsYXRpb25zIHRoYXQgd2VyZSBub3QgZXhwbGljdGx5IGluY2x1ZGVkLiBGb3JcbiAgICAvLyBleGFtcGxlLCBhIHJlY29yZCBpbiBhIGRhdGFiYXNlIG9mIGVtcGxveWVlcyBtaWdodCBsb29rIGxpa2UgdGhpczpcbiAgICAvLyB7XG4gICAgLy8gICBcImlkXCI6IFwiMVwiLFxuICAgIC8vICAgXCJuYW1lXCI6IFwidHlsZXJcIixcbiAgICAvLyAgIFwicG9zaXRpb25faWRcIjogXCIxXCJcbiAgICAvLyB9XG4gICAgLy8gVGhlIG91dHB1dCBvZiB0aGF0IHJlY29yZCBpbiBqc29uLWFwaSBub3RhdGlvbiB3b3VsZCBiZTpcbiAgICAvLyB7XG4gICAgLy8gICBcImlkXCI6IFwiMVwiLFxuICAgIC8vICAgXCJuYW1lXCI6IFwidHlsZXJcIixcbiAgICAvLyAgIFwibGlua3NcIjoge1xuICAgIC8vICAgICBcInNlbGZcIjogXCIvZW1wbG95ZWVzLzEvbGlua3MvcG9zaXRpb25cIixcbiAgICAvLyAgICAgXCJyZWxhdGVkXCI6IFwiL2VtcGxveWVlcy8xL3Bvc2l0aW9uXCJcbiAgICAvLyAgIH1cbiAgICAvLyB9XG4gICAgbGlua1dpdGhvdXRJbmNsdWRlcy5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgcmVsYXRpb25OYW1lKSB7XG4gICAgICB2YXIgaWQgPSBtb2RlbC5pZDtcbiAgICAgIHZhciBsaW5rID0ge1xuICAgICAgICBzZWxmOiAnLycgKyBwcmltYXJ5VHlwZSArICcvJyArIGlkICsgJy9saW5rcy8nICsgcmVsYXRpb25OYW1lLFxuICAgICAgICByZWxhdGVkOiAnLycgKyBwcmltYXJ5VHlwZSArICcvJyArIGlkICsgJy8nICsgcmVsYXRpb25OYW1lXG4gICAgICB9O1xuICAgICAgcmVzdWx0W3JlbGF0aW9uTmFtZV0gPSBsaW5rO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LCBsaW5rcyk7XG5cbiAgICAvLyBMaW5rIHJlbGF0aW9ucyB0aGF0IHdlcmUgZXhwbGljdGx5IGluY2x1ZGVkLCBhZGRpbmcgdGhlIGFzc29jaWF0ZWRcbiAgICAvLyByZXNvdXJjZXMgdG8gdGhlIHRvcCBsZXZlbCBcImluY2x1ZGVkXCIgb2JqZWN0XG4gICAgbGlua1dpdGhJbmNsdWRlcy5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgcmVsYXRpb25OYW1lKSB7XG4gICAgICB2YXIgaWQgPSBtb2RlbC5pZDtcbiAgICAgIHZhciByZWxhdGVkID0gcmVsYXRlKG1vZGVsLCByZWxhdGlvbk5hbWUpO1xuICAgICAgdmFyIHJlbGF0ZWRUeXBlID0gcmVsYXRlZC5tb2RlbCA/IHJlbGF0ZWQubW9kZWwudHlwZU5hbWUgOiByZWxhdGVkLmNvbnN0cnVjdG9yLnR5cGVOYW1lO1xuICAgICAgdmFyIGxpbmsgPSB7XG4gICAgICAgIHNlbGY6ICcvJyArIHByaW1hcnlUeXBlICsgJy8nICsgaWQgKyAnL2xpbmtzLycgKyByZWxhdGlvbk5hbWUsXG4gICAgICAgIHJlbGF0ZWQ6ICcvJyArIHByaW1hcnlUeXBlICsgJy8nICsgaWQgKyAnLycgKyByZWxhdGlvbk5hbWVcbiAgICAgIH07XG5cbiAgICAgIGlmIChyZWxhdGVkLm1vZGVscykge1xuICAgICAgICAvLyBpZiB0aGUgcmVsYXRlZCBpcyBhbiBhcnJheSwgd2UgaGF2ZSBhIGhhc01hbnkgcmVsYXRpb25cbiAgICAgICAgbGluay5saW5rYWdlID0gcmVsYXRlZC5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgbW9kZWwpIHtcbiAgICAgICAgICB2YXIgaWQgPSBTdHJpbmcobW9kZWwuaWQpO1xuICAgICAgICAgIHZhciBsaW5rT2JqZWN0ID0ge1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgdHlwZTogcmVsYXRlZFR5cGVcbiAgICAgICAgICB9O1xuICAgICAgICAgIC8vIGV4Y2x1ZGUgbnVsbHMgYW5kIGR1cGxpY2F0ZXMsIHRoZSBwb2ludCBvZiBhIGxpbmtzXG4gICAgICAgICAgLy8gZW50cnkgaXMgdG8gcHJvdmlkZSBsaW5rYWdlIHRvIHJlbGF0ZWQgcmVzb3VyY2VzLFxuICAgICAgICAgIC8vIG5vdCBhIGZ1bGwgbWFwcGluZyBvZiB0aGUgdW5kZXJseWluZyBkYXRhXG4gICAgICAgICAgaWYgKGlkICYmICFfLmZpbmRXaGVyZShyZXN1bHQsIGxpbmtPYmplY3QpKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChsaW5rT2JqZWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSwgW10pO1xuICAgICAgICBpZiAoZXhwb3J0ZXIpIHtcbiAgICAgICAgICByZWxhdGVkLmZvckVhY2goZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgICAgICBleHBvcnRlcihtb2RlbCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGZvciBzaW5ndWxhciByZXNvdXJjZXNcbiAgICAgICAgaWYgKHJlbGF0ZWQuaWQpIHtcbiAgICAgICAgICBsaW5rLmxpbmthZ2UgPSB7XG4gICAgICAgICAgICB0eXBlOiByZWxhdGVkVHlwZSxcbiAgICAgICAgICAgIGlkOiBTdHJpbmcocmVsYXRlZC5pZClcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpbmsubGlua2FnZSA9ICdudWxsJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwb3J0ZXIpIHtcbiAgICAgICAgICBleHBvcnRlcihyZWxhdGVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVzdWx0W3JlbGF0aW9uTmFtZV0gPSBsaW5rO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LCBsaW5rcyk7XG5cbiAgICAvLyBhbHdheXMgYWRkIGEgc2VsZi1yZWZlcmVudGlhbCBsaW5rXG4gICAgbGlua3Muc2VsZiA9ICcvJyArIHByaW1hcnlUeXBlICsgJy8nICsgbW9kZWwuaWQ7XG4gIH1cblxuICByZXR1cm4gbGlua3M7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZm9ybWF0dGVyLWpzb25hcGkvbGliL2xpbmsuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiJpbmRleC5qcyJ9