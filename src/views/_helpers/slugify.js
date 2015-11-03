function slugify(str) {
    str = (str || '')
    .toLowerCase()
    .replace(/[^\w ]+/g,'')
    .replace(/ +/g,'-');
  return str;
}

module.exports = slugify;
