require('dotenv').load();

var config = {
  devEnv: (process.env.NODE_ENV === 'development') ? true : false,
  port: 8080,
  host: 'localhost',
  livereload: 8081,
  baseurl: process.env.BASE_URL || '',
  nav: require('../../.tmp/navigation.json'),
  version: require('../../package.json').version,
  layout: 'default'
};

module.exports = config;
