module.exports = function(req, res, source) {
  var err;
  var requiredType = 'application/vnd.api+json';
  var contentType = req.headers['content-type'];
  var isValidContentType = (
    contentType &&
    contentType.toLowerCase().indexOf(requiredType) === 0
  );

  if (!isValidContentType) {
    err = new Error('Content-Type must be "application/vnd.api+json"');
    err.httpStatus = 415;
    err.title = 'Unsupported Media Type';

    return err;
  }
};
