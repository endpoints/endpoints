const formatModel = require('./lib/format_model');

// Take an array of Bookshelf models and convert them into a
// json-api compliant representation of the underlying data.
module.exports = function (input, opts) {
  var formatted = {linked:{}};
  var isSingle = !input.length;

  if (isSingle) {
    formatModel(formatted, input, opts);
  } else {
    // iterate through the input, adding links and populating linked data
    input.reduce(function(output, model) {
      return formatModel(output, model, opts);
    }, formatted);
  }
  // if there is no linked data, don't include it.
  if (Object.keys(formatted.linked).length === 0) {
    delete formatted.linked;
  }

  // if we were looking for a single result, return it as an object
  if ((opts.one && input.length === 1) || isSingle) {
    formatted.data = formatted.data[0];
  }

  // if there is nothing in the root object, represent it as an empty array
  if (!formatted.data) {
    formatted.data = [];
  }

  // bam.  done.
  return formatted;
};
