function repeat(n, block) {
  var result = '';
  for (var i = 0; i < n; ++i) {
    result += block.fn(i);
  }
  return result;
}

module.exports = repeat;
