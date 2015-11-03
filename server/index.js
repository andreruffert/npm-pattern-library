var config = require('./lib/config');
var ViewEngine = require('./lib/viewEngine');
var path = require('path');
var express = require('express');
var server = express();

var viewEngine = new ViewEngine({
  relativeTo: path.resolve(__dirname, '../src'),
  context: config
});

server.set('x-powered-by', false);
server.use(require('compression')());
server.use(express.static(path.resolve(__dirname, '../dist')));
server.use('/assets', express.static(path.resolve(__dirname, '../src')));
server.use('/favicon.ico', express.static(path.resolve(__dirname, '../src/favicon.ico')));

server.get('/*', function (request, response) {
  var view = (request.path === '/') ? 'index' : request.path.replace(/^\/|\/$/g, '');
  response.send(viewEngine.render(view));
});

server.listen(config.port, config.host, function() {
  console.log('Serving at http://%s:%s', config.host, config.port);
  console.log('NODE_ENV', process.env.NODE_ENV);
});
