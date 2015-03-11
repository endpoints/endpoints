const App = require('../app');
const superagent = require('superagent');
const JSONAPIContentType = 'application/vnd.api+json';

superagent.serialize[JSONAPIContentType] = JSON.stringify;
superagent.parse[JSONAPIContentType] = superagent.parse['application/json'];

exports.superagent = superagent;

exports.request = function(method, url) {
  if (url.charAt(0) === '/') {
    url = App.baseUrl + url;
  }
  return superagent(method, url)
    .buffer(true)
    .accept(JSONAPIContentType)
    .type(JSONAPIContentType);
};
