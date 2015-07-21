module.exports = function(req, res, next) {

  // Save original render function to _render.
  res._render = res.render;

  res.render = function(name, options, fn) {
    if (options == undefined) {
      options = {};
    }

    // Before rendering, set your own options here.
    options._req = req;
    res._render(name, options, fn)
  }
  next();
}
