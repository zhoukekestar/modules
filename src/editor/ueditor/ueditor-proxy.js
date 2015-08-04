
module.exports = function(app) {

  // "request" : "^2.60.0"
  var request = require('request');
  // "connect-multiparty": "2.0.0",
  var multipart = require('connect-multiparty');
  var multipartMiddleware = multipart();
  var fs = require('fs');

  // Ueditor server.
  app.all('/ueditor/ue', multipartMiddleware, function(req, res) {

    // Upload
    if (req.query.action === "uploadimage") {

      var formData = {
        my_field: 'my_value',
        my_file: fs.createReadStream(req.files.upfile.path)
      };

      // Send it to your image server.
      // Edit 'http://image-server-api'
      request.post({url:'http://image-server-api', formData: formData}, function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('upload failed:', err);
        }

        res.json({
          // Parse image server's result. Set your own url.
          // Edit 'http://image-server-response-url'
          // Example: JSON.parse(body).results[0].url
          'url': 'http://image-server-response-url',
          'title': '',
          'original': '',
          'state': 'SUCCESS'
        });
      });

    // List
    } else if (req.query.action === "listimage") {
      res.json({
        "state": "SUCCESS",
        "list": [],
        "start": 1,
        "total": 1
      })

    // Config
    } else {
      res.redirect('/ueditor/php/config.json')
    }
  })

}
