var express     = require('express');
var path        = require('path');
var app         = express();
var optimizer   = require('./optimizer.js');
var cssconfig   = require('./config.css.js');
var fs          = require('fs')
var CleanCSS    = require('clean-css');

app.use(express.static(path.join(__dirname, 'src')));

app.all('/delay', function (req, res) {
  setTimeout(function(){
    res.json({})

  }, (+req.query.time) * 1000)
})

// JS combo: example: http://localhost:3000/js?p=citySelect,webcom
app.all('/js', function(req, res) {

  var path = req.query.p;
  var files = path.split(',')

  res.set({
    'Content-type': 'application/javascript'
  })

  optimizer(files, function(err, content) {
    if (err) {
      console.log(err)
      return res.end('files error')
    }

    res.end(content);
  })
})


// Css combo: example: http://localhost:3000/css?p=swiper,imageView&min=false
app.all('/css', function(req, res) {
  var path = req.query.p;
  var files = path.split(',')
  var result = '';

  res.set({
    'Content-type': 'text/css'
  })

  try {
    for (var i = 0; i < files.length; i++) {
      if (files[i].indexOf('..') !== -1)
        throw new Error('Path error.');

      if (cssconfig[files[i]])
        result += fs.readFileSync(__dirname + '/src/' + cssconfig[files[i]]);
    }
  } catch (e) {
    return res.end('*{content:"' + e.toString() + '"}')
  }

  if (req.query.min !== 'false')
    result = new CleanCSS().minify(result).styles;

  res.end(result)
})

console.log('listen on 3000.')
app.listen(3000);
