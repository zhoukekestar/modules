/**
 * View engine based on jade.
 * Need render.js
 */
var fs      = require('fs');
var ejs     = require('ejs');
var jade    = require('jade');
var wechat  = require('./wechat');

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

    if (options._req && options._req.headers['x-requested-with'] === 'XMLHttpRequest') {
      options._ajax = true
    } else {
      options._ajax = false;
    }

    fs.readFile(filePath, function(err, content) {
      if (err) return callback(new Error(err));

      content += '';
      // AJAX request, no layout needed.
      if (options._ajax) {
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
      if (html.indexOf('$.shareWXConfig()') !== -1) {
        var req = options._req;
        var url = 'http://' + req.headers.host + req.originalUrl;

        wechat.getSign(url, function(time, random, sign) {

          var d = {
            url: url,
            debug: false,
            appId: wechat.appID,  // 必填，公众号的唯一标识
            timestamp: time,      // 必填，生成签名的时间戳
            nonceStr: random,     // 必填，生成签名的随机串
            signature: sign       // 必填，签名，见附录1
          };

          html = html.replace('$.shareWXConfig()', '$.shareWXConfig(' + JSON.stringify(d) + ')');
          return callback(null, html);

        });

      } else {
        return callback(null, html);
      }

    });

  });



};
