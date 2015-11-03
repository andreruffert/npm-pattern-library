var hljs = require('highlight.js');

// http://highlightjs.readthedocs.org/en/latest/api.html
hljs.configure({
  classPrefix: 'hljs-',
  languages: ['html', 'css', 'javascript']
});

function renderCode(block) {
  var result = hljs.highlightAuto(block.fn(this));
  return [
    '<pre>',
      '<code class="hljs" data-lang="' + result.language + '">',
        result.value,
      '</code>',
    '</pre>'
  ].join('');
}

module.exports = renderCode;
