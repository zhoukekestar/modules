var express     = require('express');
var path        = require('path');
var app         = express();

app.use(express.static(path.join(__dirname, 'src')));


app.all('/delay', function (req, res) {
  setTimeout(function(){
    res.json({})

  }, (+req.query.time) * 1000)
})
app.listen(3000);
console.log('listen on 3000.')
