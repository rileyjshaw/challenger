// returns an array of `length`, filled with `value`
//
module.exports = function fillArray (length, value) {
  var arr = new Array(length);
  while (length--) arr[length] = value;

  return arr;
};

// RIP:
// Initial<del>clever solution</del> hack, didn't work in IE
// return Array.apply(null, Array(length)).map(() => value);
