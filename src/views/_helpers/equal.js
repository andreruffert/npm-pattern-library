function equal(lvalue, rvalue, options) {
  if (arguments.length < 3) {
    throw new Error("Handlebars Helper equal needs 2 parameters");
  }
  if (lvalue !== options.data.root[rvalue]) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
};

module.exports = equal;
