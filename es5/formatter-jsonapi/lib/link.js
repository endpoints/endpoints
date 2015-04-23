'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _relate = require('./relate');

var _relate2 = _interopRequireWildcard(_relate);

exports['default'] = function (model) {
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
      var related = _relate2['default'](model, relationName);
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
          if (id && !_import2['default'].findWhere(result, linkObject)) {
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

module.exports = exports['default'];