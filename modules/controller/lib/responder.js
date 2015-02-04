module.exports = function (response, code, data, prettyPrint) {
  // cheap heuristics to detect the server type
  var isExpress = !!response.send;
  var isHapi = !!response.request;
  if (!isExpress && !isHapi) {
    throw new Error('Unsupported server type!');
  }
  var contentType = 'application/json';
  if (prettyPrint) {
    data = JSON.stringify(data, null, 2);
  }
  // both of these should never happen, right?
  if (isExpress) {
    response.set('content-type', contentType).status(code).send(data);
  }
  if (isHapi) {
    response(data).type(contentType).code(code);
  }
};
