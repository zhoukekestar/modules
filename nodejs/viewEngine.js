/**
 * View engine based on jade.
 * For wechat-js-sdk.
 */
var fs      = require('fs');
var ejs     = require('ejs');
var jade    = require('jade');
var wechat  = require('./wechat');
var apiConfig= require('../config/api');

module.exports = function(app) {

  // app.engine('html', require('ejs').renderFile);


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

  app.engine('jade', function(filePath, options, callback){


    options.baseApi   = apiConfig.baseApi;
    options.imageApi  = apiConfig.imageApi;

    var fn    = jade.compileFile(filePath, {pretty: '\t'});
    var html;
    try {
      html = fn(options);
    } catch (e) {
      console.error(e.stack);
      throw new Error('Jade Error')
    }
    if (options.wx !== undefined && html.indexOf('$.shareWXConfig()') !== -1) {
      var req = options.wx;
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
};
