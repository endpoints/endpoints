(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.Application = __webpack_require__(1);
	exports.Controller = __webpack_require__(2);
	exports.BookshelfAdapter = __webpack_require__(3);
	exports.ValidateJsonSchema = __webpack_require__(4);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var _ = __webpack_require__(5);

	var parseOptions = __webpack_require__(9);
	var parseResource = __webpack_require__(10);
	var slashWrap = __webpack_require__(11);

	var Application = (function () {
	  function Application(opts) {
	    _classCallCheck(this, Application);

	    this._resources = {};
	    this._endpoints = [];
	    _.extend(this, parseOptions(opts));
	  }

	  Application.prototype.resource = (function (_resource) {
	    var _resourceWrapper = function resource(_x) {
	      return _resource.apply(this, arguments);
	    };

	    _resourceWrapper.toString = function () {
	      return _resource.toString();
	    };

	    return _resourceWrapper;
	  })(function (name) {
	    var resource = this._resources[name];
	    if (!resource) {
	      throw new Error("Resource \"" + name + "\" has not been registered.");
	    }
	    return resource;
	  });

	  Application.prototype.register = function register(input) {
	    if (Array.isArray(input)) {
	      input.forEach(this.register.bind(this));
	      return this;
	    }

	    var resource = parseResource(input, this.searchPaths);
	    var resourceName = resource.name;
	    if (this._resources[resourceName]) {
	      throw new Error("Resource \"" + resourceName + "\" registered twice");
	    }
	    this._resources[resourceName] = resource;
	    return this;
	  };

	  Application.prototype.endpoint = function endpoint(resourceName, prefix) {
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
	  };

	  Application.prototype.manifest = function manifest() {
	    return this._endpoints.reduce(function (result, endpoint) {
	      var resource = endpoint.resource;
	      var controller = resource.controller;
	      var adapter = controller.adapter;
	      var filters = [];
	      var includes = [];
	      if (adapter) {
	        filters = adapter.filters();
	        includes = adapter.relations();
	      }
	      result.push({
	        name: resource.name,
	        filters: filters,
	        includes: includes,
	        url: endpoint.url
	      });
	      return result;
	    }, []);
	  };

	  Application.prototype.index = function index() {
	    return this.manifest().reduce(function (result, resource) {
	      var definition = resource.url;
	      var includes = resource.includes;
	      var filters = resource.filters;
	      if (includes.length) {
	        definition += "?include={" + includes.join(",") + "}";
	      }
	      if (filters.length) {
	        definition += definition === resource.url ? "?" : "&";
	        definition += "{" + filters.join(",") + "}";
	      }
	      result[resource.name] = definition;
	      return result;
	    }, {});
	  };

	  return Application;
	})();

	module.exports = Application;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

        var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var _ = __webpack_require__(5);
	var configure = __webpack_require__(12);
	var validate = __webpack_require__(13);
	var process = __webpack_require__(14);

	var Controller = (function () {
	  function Controller() {
	    var opts = arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, Controller);

	    if (!opts.adapter) {
	      throw new Error("No adapter specified.");
	    }
            if (!opts.model) {
              throw new Error("No model specified.");
            }
	    _.extend(this, opts);
	  }

	  Controller.method = (function (_method) {
	    var _methodWrapper = function method(_x) {
	      return _method.apply(this, arguments);
	    };

	    _methodWrapper.toString = function () {
	      return _method.toString();
	    };

	    return _methodWrapper;
	  })(function (method) {
	    return function (opts) {
              var adapter = new this.adapter({
                model: this.model
              });
	      var config = configure(method, opts);
	      var validationFailures = validate(method, adapter, config);
	      if (validationFailures.length) {
	        throw new Error(validationFailures.join("\n"));
	      }
	      return process(config, adapter);
	    };
	  });

          Controller.extend = function extend() {
            var props = arguments[0] === undefined ? {} : arguments[0];

            var Parent = this;
            var ExtendedController = (function (_Parent) {
              function Controller() {
                _classCallCheck(this, Controller);

                if (_Parent != null) {
                  _Parent.apply(this, arguments);
                }
              }

              _inherits(Controller, _Parent);

              return Controller;
            })(Parent);
            ExtendedController.prototype._super = Parent.prototype;
            for (var prop in props) {
              ExtendedController.prototype[method] = props[prop];
            }
            return ExtendedController;
          };

	  return Controller;
	})();

	Controller.prototype.create = Controller.method("create");

	Controller.prototype.read = Controller.method("read");

	Controller.prototype.update = Controller.method("update");

	Controller.prototype.destroy = Controller.method("destroy");

	module.exports = Controller;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var _ = __webpack_require__(5);

	var bPromise = __webpack_require__(6);
	var baseMethods = __webpack_require__(15);
	var processFilter = __webpack_require__(16);
	var processSort = __webpack_require__(17);
	var destructureRequest = __webpack_require__(18);

	var relate = __webpack_require__(19);

	var BookshelfAdapter = (function () {
	  function BookshelfAdapter() {
	    var opts = arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, BookshelfAdapter);

	    var model = opts.model;
	    if (!model) {
	      throw new Error("No bookshelf model specified.");
	    }
	    this.model = model;

	    if (!model.create) {
	      baseMethods.addCreate(this);
	    }
	    if (!model.prototype.update) {
	      baseMethods.addUpdate(this);
	    }
	  }

	  BookshelfAdapter.prototype.filters = (function (_filters) {
	    var _filtersWrapper = function filters() {
	      return _filters.apply(this, arguments);
	    };

	    _filtersWrapper.toString = function () {
	      return _filters.toString();
	    };

	    return _filtersWrapper;
	  })(function () {
	    var filters = Object.keys(this.model.filters || {});

	    if (filters.indexOf("id") === -1) {
	      filters.push("id");
	    }
	    return filters;
	  });

	  BookshelfAdapter.prototype.relations = function relations() {
	    return this.model.relations || [];
	  };

	  BookshelfAdapter.prototype.typeName = function typeName() {
	    return this.model.typeName;
	  };

	  BookshelfAdapter.prototype.related = (function (_related) {
	    var _relatedWrapper = function related(_x, _x2, _x3, _x4) {
	      return _related.apply(this, arguments);
	    };

	    _relatedWrapper.toString = function () {
	      return _related.toString();
	    };

	    return _relatedWrapper;
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

	    if (mode === "relation") {
	      opts.baseType = this.typeName();
	      opts.baseId = model.id;
	      opts.baseRelation = relation;
	      opts.fields = {};
	      opts.fields[related.constructor.typeName] = ["id", "type"];
	    }

	    opts.filter.id = opts.filter.id ? _.intersection(relatedIds, opts.filter.id) : relatedIds;

	    return new this.constructor({
	      model: relatedModel
	    }).read(opts, mode);
	  });

	  BookshelfAdapter.prototype.byId = function byId(id, relations) {
	    relations = relations || [];
	    return this.model.collection().query(function (qb) {
	      return qb.where({ id: id });
	    }).fetchOne({
	      withRelated: relations
	    });
	  };

	  BookshelfAdapter.prototype.create = function create(method, params) {
	    if (!method) {
	      throw new Error("No method provided to create with.");
	    }
	    if (!params) {
	      params = {};
	    }
	    var self = this;
	    return destructureRequest(this.model.forge(), params).then(function (destructured) {
	      return self.model[method](destructured.data, destructured.toManyRels);
	    });
	  };

	  BookshelfAdapter.prototype.read = function read(opts, mode) {
	    if (!opts) {
	      opts = {};
	    }
	    var self = this;
	    var model = this.model;
	    var ready = bPromise.resolve();
	    var singleResult = mode === "single" || (mode === "related" || mode === "relation") && !Array.isArray(opts.filter.id);

	    if (!this.columns) {
	      ready = model.query().columnInfo().then(function (info) {
	        self.columns = Object.keys(info);
	      });
	    }

	    return ready.then(function () {
	      var fields = opts.fields && opts.fields[self.typeName()];

	      if (fields) {
	        fields = _.intersection(self.columns, fields);

	        if (!_.contains(fields, "id")) {
	          fields.push("id");
	        }
	      }

	      return model.collection().query(function (qb) {
	        qb = processFilter(model, qb, opts.filter);
	        qb = processSort(self.columns, qb, opts.sort);
	      }).fetch({
	        columns: fields,
	        withRelated: _.intersection(self.relations(), opts.include || [])
	      }).then(function (result) {
	        result.mode = mode;
	        result.relations = opts.include;
	        result.singleResult = singleResult;
	        result.baseType = opts.baseType;
	        result.baseId = opts.baseId;
	        result.baseRelation = opts.baseRelation;
	        return result;
	      });
	    });
	  };

	  BookshelfAdapter.prototype.update = function update(model, method, params) {
	    if (!method) {
	      throw new Error("No method provided to update or delete with.");
	    }
	    return destructureRequest(model, params).then(function (destructured) {
	      return model[method](destructured.data, destructured.toManyRels, model.toJSON({ shallow: true }));
	    });
	  };

	  BookshelfAdapter.prototype.destroy = function destroy(model, method, params) {
	    if (!method) {
	      throw new Error("No method provided to update or delete with.");
	    }
	    return destructureRequest(model, params).then(function (destructured) {
	      return model[method](destructured.data, destructured.toManyRels, model.toJSON({ shallow: true }));
	    });
	  };

	  return BookshelfAdapter;
	})();

	module.exports = BookshelfAdapter;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Kapow = __webpack_require__(7);

	var validator = __webpack_require__(8);

	function transformErrorFields(input, errors) {
	  return errors.map(function (error) {
	    var field = error.field.replace(/^data/, input);
	    return Kapow(400, field + " " + error.message, error);
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

	"use strict";

	module.exports = function () {
	  var opts = arguments[0] === undefined ? {} : arguments[0];

	  if (!opts.routeBuilder) {
	    throw new Error("No route builder specified.");
	  }
	  if (!opts.searchPaths) {
	    opts.searchPaths = [];
	  } else if (!Array.isArray(opts.searchPaths)) {
	    opts.searchPaths = [opts.searchPaths];
	  }
	  return opts;
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var path = __webpack_require__(20);

	var requireSearch = __webpack_require__(22);
	var requireSilent = __webpack_require__(23);

	module.exports = function (name, searchPaths) {
	  var routeModulePath, moduleBasePath;
	  if (typeof name === "string") {
	    routeModulePath = requireSearch(path.join(name, "routes"), searchPaths);
	    moduleBasePath = path.dirname(routeModulePath);
	    return {
	      name: name,
	      routes: __webpack_require__(21)(routeModulePath),
	      controller: requireSilent(path.join(moduleBasePath, "controller"))
	    };
	  }
	  if (!name) {
	    name = {};
	  }
	  if (!name.name) {
	    throw new Error("Unable to parse a module without a name.");
	  }
	  if (!name.routes) {
	    throw new Error("Unable to parse a module without a routes object.");
	  }
	  return name;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (input) {
	  return ("/" + (input || "") + "/").replace(/\/\/+/g, "/");
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(5);

	module.exports = function (method) {
	  var opts = arguments[1] === undefined ? {} : arguments[1];

	  var defaults = {
	    method: opts.method ? opts.method : method,
	    include: [],
	    filter: {},
	    fields: {},
	    sort: [],
	    schema: {},
	    validators: []
	  };
	  var config = _.defaults({}, opts, defaults);

	  return config;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(5);

	var sourceHas = __webpack_require__(24);

	module.exports = function (method, source, config) {
	  return _.compose(_.flatten, _.compact)([sourceHas(source.relations(), config.include, "relations"), sourceHas(source.filters(), Object.keys(config.filter), "filters"), method === "read" ? null : sourceHas(method === "create" ? source.model : source.model.prototype, config.method, "method")]);
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var RequestHandler = __webpack_require__(27);
	var ResponseFormatter = __webpack_require__(28);
	var jsonApi = __webpack_require__(29);
	var send = __webpack_require__(25);

	module.exports = function (config, source) {
	  var method = config.method;
	  var responder = config.responder;
	  var handler = new RequestHandler(source, config);
	  var formatter = new ResponseFormatter(jsonApi);

	  return function (request, response) {
	    var server = "express";
	    var handle = handler[method].bind(handler);
	    var format = formatter[method].bind(formatter, config);
	    var sender = responder ? responder : send[server];
	    var respond = sender.bind(null, response);
	    var errors = handler.validate(request);

	    if (errors) {
	      respond(formatter.error(errors));
	    } else {
	      handle(request).then(format).then(respond)["catch"](function (err) {
	        return respond(formatter.error(err));
	      });
	    }
	  };
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(5);
	var bPromise = __webpack_require__(6);

	exports.addCreate = function (adapter) {
	  adapter.model.create = function (params, toManyRels) {
	    return this.forge(params).save(null, { method: "insert" }).tap(function (model) {
	      return bPromise.map(toManyRels, function (rel) {
	        return model.related(rel.name).attach(rel.id);
	      });
	    }).then((function (model) {
	      return this.forge({ id: model.id }).fetch();
	    }).bind(this));
	  };
	};

	exports.addUpdate = function (adapter) {
	  adapter.model.prototype.update = function (params, toManyRels, previous) {
	    var clientState = _.extend(previous, params);
	    return this.save(params, { patch: true, method: "update" }).tap(function (model) {
	      return bPromise.map(toManyRels, function (rel) {
	        return model.related(rel.name).detach().then(function () {
	          return model.related(rel.name).attach(rel.id);
	        });
	      });
	    }).then(function (model) {
	      if (_.isEqual(model.toJSON({ shallow: true }), clientState)) {
	        return null;
	      }
	      return model;
	    });
	  };
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(5);

	var idFilter = function idFilter(qb, value) {
	  return qb.whereIn("id", value);
	};

	module.exports = function (model, query, filterBy) {
	  var filters = model.filters;
	  return _.transform(filterBy, function (result, value, key) {
	    var filter = filters[key];
	    if (key === "id" && !filter) {
	      filter = idFilter;
	    }
	    return filter ? filter.call(filters, result, value) : result;
	  }, query);
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(5);

	function isAscending(key) {
	  return key[0] === "+" || key[0] === " ";
	}

	module.exports = function (validFields, query, sortBy) {
	  return _.chain(sortBy).filter(function (key) {
	    var hasSortDir = key[0] === " " || key[0] === "+" || key[0] === "-";
	    var isValidField = _.contains(validFields, key.substring(1));
	    return hasSortDir && isValidField;
	  }).reduce(function (result, key) {
	    var column = key.substring(1);
	    var dir = isAscending(key) ? "ASC" : "DESC";
	    return column ? result.orderBy(column, dir) : result;
	  }, query).value();
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(5);
	var bPromise = __webpack_require__(6);
	var Kapow = __webpack_require__(7);

	var sanitizeRequestData = __webpack_require__(26);

	module.exports = function (model, params) {
	  if (!params) {
	    return bPromise.resolve({});
	  }

	  var relations = params.links;
	  var toManyRels = [];

	  if (relations) {
	    return bPromise.reduce(Object.keys(relations), function (result, key) {
	      if (!model.related(key)) {
	        throw Kapow(404, "Unable to find relation \"" + key + "\"");
	      }

	      var fkey;
	      var relation = relations[key].linkage;
	      var relatedData = model.related(key).relatedData;
	      var relationType = relatedData.type;

	      if (relationType === "belongsTo" || relationType === "hasOne") {
	        fkey = relatedData.foreignKey;

	        return relatedData.target.collection().query(function (qb) {
	          if (relation === null) {
	            return qb;
	          }
	          return qb.where({ id: relation.id });
	        }).fetchOne().then(function (model) {
	          if (model === null) {
	            throw Kapow(404, "Unable to find relation \"" + key + "\" with id " + relation.id);
	          }
	          params[fkey] = relation === null ? relation : relation.id;
	          return params;
	        });
	      }

	      if (relationType === "belongsToMany" || relationType === "hasMany") {
	        return bPromise.map(relation, function (rel) {
	          return relatedData.target.collection().query(function (qb) {
	            return qb.where({ id: rel.id });
	          }).fetchOne().then(function (model) {
	            if (model === null) {
	              throw Kapow(404, "Unable to find relation \"" + key + "\" with id " + rel.id);
	            }
	            return params;
	          });
	        }).then(function () {
	          toManyRels.push({
	            name: key,
	            id: _.pluck(relation, "id")
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	function getRelated(relationName, input) {
	  var collection;
	  if (input.models) {
	    collection = input.model.forge().related(relationName).relatedData.target.collection();

	    return input.reduce(function (result, model) {
	      var related = model.related(relationName);
	      return result.add(related.models ? related.models : related);
	    }, collection);
	  }

	  return input.related(relationName);
	}

	module.exports = function (model, relation) {
	  var relationSegments = relation.split(".");
	  return relationSegments.reduce(function (source, segment) {
	    return getRelated(segment, source);
	  }, model);
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("path");

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./parse_options": 9,
		"./parse_options.js": 9,
		"./parse_resource": 10,
		"./parse_resource.js": 10,
		"./require_search": 22,
		"./require_search.js": 22,
		"./require_silent": 23,
		"./require_silent.js": 23,
		"./slash_wrap": 11,
		"./slash_wrap.js": 11
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
	webpackContext.id = 21;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var path = __webpack_require__(20);

	var requireSilent = __webpack_require__(23);

	module.exports = function (file, searchPaths) {
	  if (!searchPaths) {
	    throw new Error("No searchPaths specified.");
	  }
	  var result = null;
	  var len = searchPaths.length;
	  for (var i = 0; i < len; i++) {
	    var currentPath = path.join(searchPaths[i], file);
	    var notFoundInFoundFile = false;
	    result = requireSilent(currentPath);
	    if (result instanceof Error) {
	      notFoundInFoundFile = result.message.indexOf(currentPath) === -1;
	      if (result.code !== "MODULE_NOT_FOUND" || notFoundInFoundFile) {
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
	    throw new Error("Unable to locate \"" + file + "\" in search paths: " + searchPaths.join(", "));
	  }
	  return result;
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (file) {
	  try {
	    return __webpack_require__(21)(file);
	  } catch (e) {
	    return e;
	  }
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(5);

	function error(type, key) {
	  return "Model does not have " + type + ": " + key + ".";
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
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.express = express;
	exports.hapi = hapi;
	exports.__esModule = true;
	var TYPE = "application/vnd.api+json";

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
	  return response.set("content-type", TYPE).status(code).send(data);
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
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (data) {
	  delete data.type;
	  delete data.links;
	  return data;
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var COLLECTION_MODE = "collection";
	var SINGLE_MODE = "single";
	var RELATION_MODE = "relation";
	var RELATED_MODE = "related";

	var _ = __webpack_require__(5);
	var Kapow = __webpack_require__(7);

	var throwIfModel = __webpack_require__(30);
	var throwIfNoModel = __webpack_require__(31);
	var verifyAccept = __webpack_require__(32);
	var verifyContentType = __webpack_require__(33);
	var verifyDataObject = __webpack_require__(34);
	var splitStringProps = __webpack_require__(35);

	var RequestHandler = (function () {
	  function RequestHandler(adapter) {
	    var config = arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, RequestHandler);

	    this.config = config;
	    this.adapter = adapter;
	    this.schema = config.schema || {};
	    this.validators = config.validators;
	    this.method = config.method;

	    config.typeName = adapter.typeName();
	  }

	  RequestHandler.prototype.validate = (function (_validate) {
	    var _validateWrapper = function validate(_x) {
	      return _validate.apply(this, arguments);
	    };

	    _validateWrapper.toString = function () {
	      return _validate.toString();
	    };

	    return _validateWrapper;
	  })(function (request) {

	    var err;
	    var validators = [verifyAccept];

	    if (request.body && request.body.data) {
	      validators = validators.concat([verifyContentType, verifyDataObject]);
	    }

	    validators = validators.concat(this.validators);

	    for (var validate in validators) {
	      err = validators[validate](request, this);
	      if (err) {
	        break;
	      }
	    }
	    return err;
	  });

	  RequestHandler.prototype.query = (function (_query) {
	    var _queryWrapper = function query(_x2) {
	      return _query.apply(this, arguments);
	    };

	    _queryWrapper.toString = function () {
	      return _query.toString();
	    };

	    return _queryWrapper;
	  })(function (request) {
	    var config = _.cloneDeep(this.config);

	    var query = request.query;
	    var include = query.include;
	    var filter = query.filter;
	    var fields = query.fields;
	    var sort = query.sort;
	    return {
	      include: include ? include.split(",") : config.include,
	      filter: filter ? splitStringProps(filter) : config.filter,
	      fields: fields ? splitStringProps(fields) : config.fields,
	      sort: sort ? sort.split(",") : config.sort
	    };
	  });

	  RequestHandler.prototype.mode = function mode(request) {
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

	    throw Kapow(400, "Unable to determine mode based on `request.params` keys.");
	  };

	  RequestHandler.prototype.create = function create(request) {
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
	  };

	  RequestHandler.prototype.read = function read(request) {
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
	      query.filter.id = id;
	    }
	    return adapter.read(query, mode);
	  };

	  RequestHandler.prototype.update = function update(request) {
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

	    return adapter.byId(id).then(throwIfNoModel).then(function (model) {
	      return adapter.update(model, method, data);
	    })["catch"](function (e) {
	      if (e.message.toLowerCase().indexOf("null") !== -1) {
	        Kapow.wrap(e, 409);
	      }
	      throw e;
	    });
	  };

	  RequestHandler.prototype.destroy = function destroy(request) {
	    var method = this.method;
	    var adapter = this.adapter;
	    var id = request.params.id;

	    return adapter.byId(id).then(function (model) {
	      if (model) {
	        return adapter.destroy(model, method);
	      }
	    });
	  };

	  return RequestHandler;
	})();

	module.exports = RequestHandler;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var ResponseFormatter = (function () {
	  function ResponseFormatter(formatter) {
	    _classCallCheck(this, ResponseFormatter);

	    if (!formatter) {
	      throw new Error("No formatter specified.");
	    }
	    this.formatter = formatter;
	  }

	  ResponseFormatter.method = function method(fn) {
	    return function () {
	      var args = Array.prototype.slice.call(arguments);
	      args.unshift(this.formatter);
	      return fn.apply(null, args);
	    };
	  };

	  return ResponseFormatter;
	})();

        ResponseFormatter.prototype.error = __webpack_require__(37);

        ResponseFormatter.prototype.create = ResponseFormatter.method(__webpack_require__(38));

        ResponseFormatter.prototype.read = ResponseFormatter.method(__webpack_require__(39));

        ResponseFormatter.prototype.update = ResponseFormatter.method(__webpack_require__(40));

        ResponseFormatter.prototype.destroy = ResponseFormatter.method(__webpack_require__(41));

	module.exports = ResponseFormatter;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(5);

        var formatModel = __webpack_require__(36);

	module.exports = function (input) {
	  var opts = arguments[1] === undefined ? {} : arguments[1];

	  var included = [];
	  var topLevelLinks;

	  opts.exporter = function (model) {
	    included.push(formatModel(null, model));
	  };

	  opts.topLevelLinker = function (links) {
	    topLevelLinks = links;
	  };

	  var formatter = formatModel.bind(null, opts);

	  var serialized = input.map ? input.map(formatter) : formatter(input);

	  if (opts.singleResult && input.length) {
	    serialized = serialized[0];
	  }

	  var output = {
	    data: serialized
	  };

	  if (topLevelLinks) {
	    output.links = topLevelLinks;
	  }

	  if (included.length > 0) {
	    output.included = _(included).flatten().uniq(function (rel) {
	      return rel.type + rel.id;
	    }).value();
	  }

	  return output;
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Kapow = __webpack_require__(7);

	module.exports = function (model) {
	  if (model) {
	    throw Kapow(409, "Model with this ID already exists");
	  }
	  return model;
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Kapow = __webpack_require__(7);

	module.exports = function (model) {
	  if (!model) {
	    throw Kapow(404, "Unable to locate model.");
	  }

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
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Kapow = __webpack_require__(7);
	var EXPECTED_ACCEPT = "application/vnd.api+json";

	module.exports = function (request) {
	  var err;

	  var headers = request.headers;
	  var accept = headers.accept;
	  var isBrowser = accept && accept.indexOf("text/html") !== -1;

	  var isValidAccept = accept && accept.toLowerCase().indexOf(EXPECTED_ACCEPT) === 0;

	  if (!isValidAccept && !isBrowser) {
	    err = Kapow(406, "Content-Type must be \"" + EXPECTED_ACCEPT + "\"");
	  }

	  return err;
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Kapow = __webpack_require__(7);
	var EXPECTED_TYPE = "application/vnd.api+json";

	module.exports = function (request) {
	  var err;

	  var contentType = request.headers["content-type"];

	  var isValidContentType = contentType && contentType.toLowerCase().indexOf(EXPECTED_TYPE) === 0;

	  if (!isValidContentType) {
	    err = Kapow(415, "Content-Type must be \"" + EXPECTED_TYPE + "\"");
	  }

	  return err;
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(5);
	var Kapow = __webpack_require__(7);

	module.exports = function (request, endpoint) {
	  var err, isValidType, id;
	  var data = request.body.data;

	  if (!_.isPlainObject(data) && !_.isArray(data)) {
	    err = Kapow(400, "Primary data must be a single object or array.");
	    return err;
	  }

	  if (_.isArray(data)) {
	    isValidType = _.reduce(data, function (isValid, resource) {
	      if (!resource.type || typeof resource.type !== "string") {
	        isValid = false;
	      }
	      return isValid;
	    }, true);
	  } else {
	    isValidType = typeof data.type === "string";
	  }

	  id = request.params && request.params.id;

	  if (!isValidType) {
	    err = Kapow(400, "Primary data must include a type.");
	    return err;
	  }
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(5);

	module.exports = function (obj) {
	  return _.transform(obj, function (result, n, key) {
	    result[key] = String(n).split(",");
	  });
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(5);

        var toOneRelations = __webpack_require__(42);
        var link = __webpack_require__(43);

        module.exports = function (opts, model) {
          var topLevelLinks;
          var exporter = opts && opts.exporter;
          var mode = opts && opts.mode;
          var relations = opts && opts.relations;

          var typeName = model.constructor.typeName;

          var linkWithInclude = relations;

          var allRelations = model.constructor.relations;

          var toOneRels = toOneRelations(model, allRelations);

          var linkWithoutInclude = _.difference(allRelations, linkWithInclude);

          var serialized = model.toJSON({ shallow: true });

          serialized.id = String(serialized.id);

          serialized.type = typeName;

          for (var rel in toOneRels) {
            delete serialized[toOneRels[rel]];
          }
          if (mode === "relation") {
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
/* 37 */
/***/ function(module, exports, __webpack_require__) {

        "use strict";

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
	  }, "");

	  return resp;
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (formatter, config, data) {
	  return {
	    code: "201",
	    data: formatter(data, {
	      singleResult: true
	    }),
	    headers: {
	      location: "/" + config.typeName + "/" + data.id
	    }
	  };
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Kapow = __webpack_require__(7);
        var error = __webpack_require__(37);

	module.exports = function (formatter, config, data) {
	  if (!data || data.length === 0 && data.singleResult) {
	    return error(Kapow(404, "Resource not found."));
	  }

	  return {
	    code: "200",
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
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (formatter, config, data) {
	  if (data && !config.relationOnly) {
	    return {
	      code: "200",
	      data: formatter(data, config)
	    };
	  }
	  return {
	    code: "204",
	    data: null
	  };
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (formatter, config, data) {
	  return {
	    code: "204",
	    data: null
	  };
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (model, relations) {
	  if (!Array.isArray(relations)) {
	    return {};
	  }
	  return relations.reduce(function (result, relationName) {
	    if (relationName.indexOf(".") !== -1) {
	      return result;
	    }

	    var relation = model.related(relationName);
	    var relKey = relation.relatedData.foreignKey;

	    if (!relation) {
	      throw new Error("Relation " + relationName + " is not defined on " + model.tableName);
	    }

	    if (relation.relatedData.type === "belongsTo") {
	      result[relationName] = relKey;
	    }
	    return result;
	  }, {});
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(5);

	var relate = __webpack_require__(19);

	module.exports = function (model) {
	  var opts = arguments[1] === undefined ? {} : arguments[1];

	  var links = {};
	  var primaryType = model.constructor.typeName;
	  var linkWithoutIncludes = opts.linkWithoutInclude || [];
	  var linkWithIncludes = opts.linkWithInclude || [];
	  var exporter = opts.exporter;
	  var topLevelLinker = opts.topLevelLinker;

	  if (topLevelLinker) {
	    links.self = "/" + opts.baseType + "/" + opts.baseId + "/links/" + opts.baseRelation;
	    links.related = "/" + opts.baseType + "/" + opts.baseId + "/" + opts.baseRelation;
	    topLevelLinker(links);
	  } else {
	    linkWithoutIncludes.reduce(function (result, relationName) {
	      var id = model.id;
	      var link = {
	        self: "/" + primaryType + "/" + id + "/links/" + relationName,
	        related: "/" + primaryType + "/" + id + "/" + relationName
	      };
	      result[relationName] = link;
	      return result;
	    }, links);

	    linkWithIncludes.reduce(function (result, relationName) {
	      var id = model.id;
	      var related = relate(model, relationName);
	      var relatedType = related.model ? related.model.typeName : related.constructor.typeName;
	      var link = {
	        self: "/" + primaryType + "/" + id + "/links/" + relationName,
	        related: "/" + primaryType + "/" + id + "/" + relationName
	      };

	      if (related.models) {
	        link.linkage = related.reduce(function (result, model) {
	          var id = String(model.id);
	          var linkObject = {
	            id: id,
	            type: relatedType
	          };

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
	        if (related.id) {
	          link.linkage = {
	            type: relatedType,
	            id: String(related.id)
	          };
	        } else {
	          link.linkage = "null";
	        }
	        if (exporter) {
	          exporter(related);
	        }
	      }
	      result[relationName] = link;
	      return result;
	    }, links);

	    links.self = "/" + primaryType + "/" + model.id;
	  }

	  return links;
	};

/***/ }
/******/ ])));