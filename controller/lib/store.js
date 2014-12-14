const STORAGE_KEY = '__endpoints__';

exports.getter = function (key) {
  return this[STORAGE_KEY] && this[STORAGE_KEY][key];
};

exports.setter = function (key, value) {
  if (!this[STORAGE_KEY]) { 
    this[STORAGE_KEY] = {};
  }
  return (this[STORAGE_KEY][key] = value);
};