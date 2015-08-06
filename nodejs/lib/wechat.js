/**
 * Wechat utils.
 *
 */

var https   = require("https");
var config  = require('../config/wechat');
var debug   = process.env.NODEJS_DEBUG === undefined ? false : process.env.NODEJS_DEBUG;

var _wechat = {

  appID: config.appID,
  appsecret: config.appsecret,

  access_token: "",
  access_token_time: 0,
  access_token_expire: 0,
  getAccessToken: function(callback){

    // Print debug info
    if (debug) {
      console.log("-now:" + new Date().getTime() +
                  " expire:" + (this.access_token_time + this.access_token_expire) +
                  " at_t:" + this.access_token_time +
                  " at_e:" + this.access_token_expire);
    }
    // Return directly.
    if (new Date().getTime() < this.access_token_time + this.access_token_expire) {
      if (debug) {
        console.log("No Refresh access_token.");
      }
      callback(this.access_token);
      return;
    }
    // Debug note.
    if (debug) {
      console.log("Refresh access_token.");
    }

    var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + this.appID + '&secret=' + this.appsecret;
    var t = this;
    this.httpsGet(url, function(d){

      t.access_token = d.access_token;
      t.access_token_time = new Date().getTime();
      // ms -> s
      t.access_token_expire = d.expires_in * 1000;

      if (typeof callback === "function") {
        callback(t.access_token);
      }

    });

  },

  jsapi_ticket: "",
  jsapi_ticket_time: 0,
  jsapi_ticket_expire: 0,
  getJSAPITicket: function(callback){

    // Print debug info.
    if (debug) {

      console.log("-now:"     + new Date().getTime() +
                  " expire:"  + (this.jsapi_ticket_time + this.jsapi_ticket_expire) +
                  " js_t:"    + this.jsapi_ticket_time +
                  " js_e:"    + this.jsapi_ticket_expire);
    }
    // Return directly.
    if (new Date().getTime() < this.jsapi_ticket_time + this.jsapi_ticket_expire) {
      if (debug) {
        console.log("No Refresh jsapi_ticket.");
      }
      callback(this.jsapi_ticket);
      return;
    }

    // Debug note.
    if (debug) {
      console.log("Refresh jsapi_ticket.");
    }

    var t = this;
    this.getAccessToken(function(d){

      var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + d + '&type=jsapi';
      t.httpsGet(url, function(d){

        t.jsapi_ticket = d.ticket;
        t.jsapi_ticket_time = new Date().getTime();
        // ms -> s
        t.jsapi_ticket_expire = d.expires_in * 1000;

        if (typeof callback === "function") {

          callback(t.jsapi_ticket);
        }
      });

    });

  },

  getSign: function(url, callback) {
    var random = Math.ceil(Math.random() * 10000) + '';
    var time = new Date().getTime();

    this.getJSAPITicket(function(js){

      var arr = [
      'noncestr=' + random,
      'jsapi_ticket=' + js,
      'timestamp=' + time,
      'url=' + url
      ];

      arr.sort();

      var crypto = require('crypto');
      var sha = crypto.createHash('sha1');
      sha.update(arr.join('&'));

      callback(time, random, sha.digest('hex'));

    });
  },

  httpsGet: function(url, callback){
    https.request(url, function(clientRes){

        clientRes.setEncoding('utf8');
        var data = "";
        clientRes.on('data', function(chunk){
           data += chunk;
        }).on('end', function(){

            console.log("req: " + url);
            console.log("res: " + data);
            console.log("---");

            callback(JSON.parse(data));
        });

    })
    .on('error', function(e){
        console.log("Client request ERROR! " + e);
    })
    .end();

  }
};

module.exports = _wechat;
