// Generated by CoffeeScript 1.10.0
module.exports.getKeys = function(object) {
  var i, keys;
  keys = [];
  for (i in object) {
    keys.push(i);
  }
  return keys;
};

module.exports.getValues = function(object) {
  var i, values;
  values = [];
  for (i in object) {
    values.push(object[i]);
  }
  return values;
};

module.exports.getFirstItem = function(object) {
  var i;
  for (i in object) {
    return object[i];
  }
};
