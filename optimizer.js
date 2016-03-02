var requirejs = require('requirejs');
var config    = require('./config.requirejs.js');

var results = '';
var currentContent;
var currentModules;

config.out = function(c) {
  currentContent = c;
}
config.baseUrl = __dirname + '/' + config.baseUrl;
config.optimize = 'none';

var optimizeModules = function(index, callback) {

  if (index >= currentModules.length) {
    return callback(null, results);
  }
  config.name = currentModules[index];
  console.log(config.name + ' is optimizing...');
  requirejs.optimize(config, function (buildResponse) {
    results += currentContent;
    return optimizeModules(index + 1, callback);
  }, function(err) {
    callback(err)
  });
}


module.exports = function(modules, callback) {
  currentModules = modules;
  optimizeModules(0, function(err, content) {
    results = '';
    currentModules = [];
    currentContent = '';
    callback(err, content)
  })
}
