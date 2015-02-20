module.exports = function (payload, request, response, next) {
  if (!payload) {
    throw new Error('No payload provided.');
  }
  if (!request) {
    throw new Error('No request provided.');
  }
  if (!response) {
    throw new Error('No response provided');
  }
  var code = payload.code;
  var data = payload.data;
  var isExpress = !!response.send;
  var isHapi = !!response.request;
  var contentType = 'application/vnd.api+json';
  if (!isExpress && !isHapi) {
    throw new Error('Unsupported server type!');
  }
  if (isExpress && request.accepts('html')) {
    // pretty print is only supported via express for now
    data = JSON.stringify(data, null, 2);
  }
  if (isExpress) {
    return response.set('content-type', contentType).status(code).send(data);
  }
  if (isHapi) {
    return response(data).type(contentType).code(code);
  }
};
