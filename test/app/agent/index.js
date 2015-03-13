const superagent = require('superagent');
const bPromise = require('bluebird');

const App = require('../');

const JSONAPIContentType = 'application/vnd.api+json';

superagent.serialize[JSONAPIContentType] = JSON.stringify;
superagent.parse[JSONAPIContentType] = superagent.parse['application/json'];

exports.superagent = superagent;

exports.request = function(method, url) {
  if (url.charAt(0) === '/') {
    url = App.baseUrl + url;
  }
  var request = superagent(method, url)
    .buffer(true)
    .accept(JSONAPIContentType)
    .type(JSONAPIContentType);

  request.promise = function() {
    return new bPromise(function(resolve, reject) {
      request.end(function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  };

  return request;
};
