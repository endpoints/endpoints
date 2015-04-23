import _ from 'lodash';

function error (type, key) {
  return `Model does not have ${type}: ${key}.`;
}

export default function (available, requested, type) {
  var message = error.bind(null, type);
  if (!requested) {
    return;
  }
  if (_.isArray(requested) && _.isArray(available)) {
    return _.difference(requested, available).map(message);
  }
  return available[requested] ? null : message(requested);
}
