module.exports = function(request) {
  var requiredType = 'application/vnd.api+json';
  var contentType = request.headers['content-type'];
  return (
    contentType &&
    contentType.toLowerCase().indexOf(requiredType) === 0
  );
};
