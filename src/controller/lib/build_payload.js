import bPromise from 'bluebird';

const TYPE = 'application/vnd.api+json';

module.exports = function (validate, process, format, error, request) {
  var errors = validate(request);
  return bPromise[errors ? 'reject' : 'resolve'](errors)
    .then(() => process(request))
    .then(format)
    .catch(error)
    .tap(function (payload) {
      if (!payload.headers) {
        payload.headers = {};
      }
      payload.headers['content-type'] = TYPE;
    });
};
