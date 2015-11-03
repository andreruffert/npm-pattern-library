var hljs = require('highlight.js');

// http://highlightjs.readthedocs.org/en/latest/api.html
hljs.configure({
  classPrefix: 'hljs-',
  languages: ['html', 'css', 'javascript']
});

function renderExample(block) {
  var result = hljs.highlightAuto(block.fn(this));
  return [
    '<div class="docs-example">',
      '<div class="docs-example__rendered">',
        block.fn(this),
      '</div>',
      '<div class="docs-example__code">',
        '<pre>',
          '<code class="hljs" data-lang="' + result.language + '">',
            result.value,
          '</code>',
        '</pre>',
      '</div>',
    '</div>'
  ].join('');
}

module.exports = renderExample;
