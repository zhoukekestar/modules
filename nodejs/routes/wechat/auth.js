/**
 * Wechat auth.js
 *
 * Need appID, sercret, baseurl, infourl
 *
 */


var express   = require('express');
var router    = express.Router();
var urlencode = require('urlencode');
var unirest   = require('unirest');
var config    = require('../../config/wechat');

// Base auth request.
router.get('/base', function(req, res) {

  console.log('/wechat/auth/base is in');

  if (req.headers.referer) {
    res.cookie('wechat_callback', req.headers.referer, { path: '/'})
  }

  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
            config.appID +
            '&redirect_uri=' +
            urlencode(config.basecallback) +
            '&response_type=code&scope=snsapi_base&state=base#wechat_redirect';

  res.redirect(url);

});

// Base auth callback.
router.get('/base/callback', function(req, res) {
  var code = req.query.code;
  var state = req.query.state;
  console.log('/base/callback' + code);

  var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' +
            config.appID +
            '&secret=' + config.appsecret +
            '&code=' + code +
            '&grant_type=authorization_code';
  unirest.get(url).end(function(response) {
    // After got openid.
    //
    var body = response.body;
    if (typeof response.body === 'string') {
      body = JSON.parse(response.body);
    }

    var wechat_callback = req.cookies && req.cookies.wechat_callback;
    res.clearCookie('wechat_callback');

    if (wechat_callback) {
      res.redirect(wechat_callback)
    } else {
      res.send(body.openid);
    }

  });
});

// Info auth request.
router.get('/info', function(req, res) {
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
            config.appID +
            '&redirect_uri=' +
            urlencode(config.infocallback) +
            '&response_type=code&scope=snsapi_userinfo&state=info#wechat_redirect';

  res.redirect(url);

});

// Info auth callback.
router.get('/info/callback', function(req, res) {
  var code = req.query.code;
  var state = req.query.state;

  console.log('info/back' + code + '#' + state + '#');
  if (code === 'authdeny') {
    // TODO authdeny
    console.log('no auth')
    res.send('no auth')
    return;
  }
  var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' +
            config.appID +
            '&secret=' + config.appsecret +
            '&code=' + code +
            '&grant_type=authorization_code';
  unirest.get(url).end(function(response) {
    var json = JSON.parse(response.body);

    url = 'https://api.weixin.qq.com/sns/userinfo?access_token=' +
          json.access_token +
          '&openid=' + json.openid + '&lang=zh_CN';

    unirest.get(url).end(function(response){

      // After got user info
      // 1、Save user info
      // 2、Redirect request
      //var user = JSON.parse(response.body);
      res.send(JSON.stringify(response.body))
    });
  });
});

module.exports = router;
