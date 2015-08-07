/**
 * View engine based on :
 * 1. jade
 * 2. ejs
 * 3. render.js
 */
var fs      = require('fs');
var ejs     = require('ejs');
var jade    = require('jade');

module.exports = function(app) {

  // EJS
  app.engine('html', function(filePath, options, callback) {

    fs.readFile(filePath, function(err, content) {
      if (err) return callback(new Error(err));

      content += '';

      var template = ejs.compile(content, {
        filename: filePath
      });

      return callback(null, template(options));
    });
  });

  // JADE
  app.engine('jade', function(filePath, options, callback) {


    fs.readFile(filePath, function(err, content) {

      if (err) {
        return callback(new Error(err));
      }

      content += '';

      // AJAX request, no layout needed.
      if (options._req && options._req.xhr) {
        content = content.replace('extends', '//- extends')
      }

      var fn = jade.compile(content, { filename: filePath});

      var html;
      try {
        html = fn(options);
      } catch (e) {
        console.error(e.stack);
        throw new Error('Jade Error')
      }

      return callback(null, html);

    });

  });

};
