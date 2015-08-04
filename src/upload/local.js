
module.exports = function(app) {

  // "connect-multiparty": "2.0.0",
  var multipart = require('connect-multiparty');
  var multipartMiddleware = multipart();
  var fs = require('fs');

  // Images' temp dirctory. (Example: C:\Users\zhou\AppData\Local\Temp\)
  var dir = 'C:\\Users\\zhou\\AppData\\Local\\Temp';

  app.get('/', function(req, res) {

    res.redirect('/demo.html')

  })

  // Image request.
  app.get('/upload/:id', function(req, res) {
    res.sendFile(dir + '/' + req.params.id);
  });

  // Upload server.
  app.post('/upload', multipartMiddleware, function(req, res) {

    var key;
    var results = [];

    for (key in req.files) {

      var value = req.files[key];
      var file;
      var path;
      if (value instanceof Array) {

        value.forEach(function(file) {

          path = file.path;
          results.push({
            url: '/upload/' + path.substring(path.lastIndexOf('\\') + 1),
            title: file.name,
            original: file.originalFilename
          });

        });

      } else {

        file = req.files[key];
        path = file.path;
        results.push({
          url: '/upload/' + path.substring(path.lastIndexOf('\\') + 1),
          title: file.name,
          original: file.originalFilename
        });

      }
    }

    res.json(results);

  })

}
