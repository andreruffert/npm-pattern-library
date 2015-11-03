var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
var matter = require('gray-matter');

var defaults = {
  relativeTo: __dirname,
  path: 'views',
  layoutPath: 'views/_layouts',
  helpersPath: 'views/_helpers',
  partialsPath: 'views/_partials',
  suffix: '.html',
  context: {
    layout: 'default'
  }
};

/**
 * A simple view engine to render handlebar templates with yaml front matter support.
 * @param {Object} settings
 */
var ViewEngine = function(settings) {
  this.settings = Object.assign({}, defaults, settings);
  this.registerFiles(this.settings.helpersPath, function(file, filePath) {
    var name = path.basename(file, '.js');
    var helper = require(filePath + '/' + file);
    Handlebars.registerHelper(name, helper);
  });

  this.registerFiles(this.settings.partialsPath, function(file, filePath) {
    var name = path.basename(file, '.html');
    var partial = fs.readFileSync(filePath + '/' + file, 'utf8');
    Handlebars.registerPartial(name, partial);
  });
};

/**
 * registerFiles
 * @param  {String}   filePath
 * @param  {Function} fn
 */
ViewEngine.prototype.registerFiles = function(filePath, fn) {
  filePath = this.settings.relativeTo + '/' + filePath;
  fs.readdir(filePath, function(err, files) {
    if (err) {
      throw err;
    }
    files.forEach(function(file) {
      fn(file, filePath);
    });
  });
};

/**
 * render
 * @param  {String} view
 * @param  {Object} context
 * @return {String}
 */
ViewEngine.prototype.render = function(view, context) {
  var template = matter(fs.readFileSync(this.settings.relativeTo + '/' + this.settings.path + '/' + view + this.settings.suffix, 'utf8'));
  var mergedContext = Object.assign({}, this.settings.context, (context || {}), template.data);
  var content = Handlebars.compile(template.content)(mergedContext);
  var layout = fs.readFileSync(this.settings.relativeTo + '/' + this.settings.layoutPath + '/' + mergedContext.layout + this.settings.suffix, 'utf8');
  return Handlebars.compile(layout)(Object.assign({}, mergedContext, { content: content }));
};

module.exports = ViewEngine;
