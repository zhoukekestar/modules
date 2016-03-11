
module.exports = function(app) {

  var request             = require('request')            // "request" : "^2.60.0"
    , multipart           = require('connect-multiparty') // "connect-multiparty": "2.0.0",
    , multipartMiddleware = multipart()
    , fs                  = require('fs')
    , config              = require('../config/api.js')
    , http                = require('http')
    , ueditorConfig       = fs.readFileSync(__dirname + '/../public/ueditor/php/config.json');

  // Convert it to json object.
  ueditorConfig = eval('(' + ueditorConfig.toString() + ')')

  // Ueditor server.
  app.all('/ueditor/ue', multipartMiddleware, function(req, res) {

    // Upload
    if (req.query.action === "uploadimage" || req.query.action === "uploadscrawl") {

      var formData = {
        my_field: 'my_value',
        my_file: fs.createReadStream(req.files.upfile.path)
      };

      // Send it to your image server.
      // Edit 'http://image-server-api'
      request.post({url:config.imageApi, formData: formData}, function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('upload failed:', err);
        }

        res.json({
          // Parse image server's result. Set your own url.
          // Edit 'http://image-server-response-url'
          // Example: JSON.parse(body).results[0].url
          'url': JSON.parse(body).results[0].url,
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
      res.json(ueditorConfig)
    }
  })
}
