var apiConfig= require('../config/api');

module.exports = function(req, res, next) {
  res._render = res.render;

  res.render = function(name, options, fn) {
    if (options == undefined) {
      options = {};
    }

    // Set global parameters.
    options.baseApi   = apiConfig.baseApi;
    options.imageApi  = apiConfig.imageApi;

    // Make #request# accessible for template engine like jade.
    options._req = req;

    res._render(name, options, fn)
  }
  next();
}
