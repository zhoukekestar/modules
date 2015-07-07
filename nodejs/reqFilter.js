var utils = require('utils');
module.exports = function(o) {

  var option = utils.extend({
    wx: true,
    ajax: true
  }, o);

  return function(req, res, next) {
    req._checkRequest = {};
    if (option.ajax) {
      req._checkRequest.ajax = req.headers['x-requested-with'] === 'XMLHttpRequest' ? true : false;
    }
  }
}
