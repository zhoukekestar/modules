var express = require('express');
var path    = require('path');
var app     = express();

app.use(express.static(path.join(__dirname, 'public')));
require('./local.js')(app);

app.listen(3000);
console.log('Listen on 3000. Visit it by: http://localhost:3000')
