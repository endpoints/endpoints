const _ = require('lodash');

const formatModel = require('./lib/format_model');

module.exports = function (input, opts) {
  var linked = [];
  // this method recieves each model that was explictly sideloaded (included)
  var exporter = function (model) {
    // each model that appears in the top level linked object needs to be
    // formatted for json-api compliance too. we *could* allow links within
    // links by recursing here but i don't think it is needed... yet?
    linked.push(formatModel({
      typeName: model.constructor.typeName
    }, null, model));
  };
  // prepare a formatting method to configure each model
  var formatter = formatModel.bind(null, opts, exporter);
  // format every incoming model
  var serialized = input.map ? input.map(formatter) : formatter(input);
  // if we are requesting a single item, return it as an object, not an array
  if (opts.singleResult && input.length) {
    serialized = serialized[0];
  }
  // prepare json-api compliant output
  var output = {
    data: serialized
  };
  // if the exporter was ever called, we should have objects in
  // the linked array. since it is possible for the same model
  // to be linked more than once, prune any duplicates.
  if (linked.length > 0) {
    output.linked = _(linked).flatten().uniq(function(rel) {
      return rel.type + rel.id;
    }).value();
  }
  // bam, done.
  return output;
};
