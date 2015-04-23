import _ from 'lodash';

export default function(obj) {
  return _.transform(obj, function(result, n, key) {
    var val = String(n);
    result[key] = val.indexOf(',') === -1 ? val : val.split(',');
  });
}
