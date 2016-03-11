
module.exports = function(app) {


  var request             = require('request')            // "request" : "^2.60.0"
    , multipart           = require('connect-multiparty') // "connect-multiparty": "2.0.0",
    , multipartMiddleware = multipart()
    , fs                  = require('fs')
    , config              = require('../config/api.js')
    , http                = require('http');


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

      var options = {
        hostname: config.testEnvironment ? 'local.toomao.com' : 'common.toomao.com',
        port: config.testEnvironment ? 2999 : 80,
        path: req.originalUrl,
        method: 'GET'
      }
      var proxy = http.request(options, function (result) {
        result.pipe(res, {
          end: true
        });
      });

      req.pipe(proxy, {
        end: true
      });

      res.set({
        'Content-Type': 'application/json'
      })

    }
  })


  app.use('/ueditor/*', function(req, res) {

    // var url = 'http://local.toomao.com:2999' + req.originalUrl;
    var options = {
      hostname: config.testEnvironment ? 'local.toomao.com' : 'common.toomao.com',
      port: config.testEnvironment ? 2999 : 80,
      path: req.originalUrl,
      method: 'GET'
    }

    var proxy = http.request(options, function (result) {
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.set({
        'Content-Type': result.headers['content-type']
      })
      result.pipe(res, {
        end: true
      });
    });

    req.pipe(proxy, {
      end: true
    });
  })

}
