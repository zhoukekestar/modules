var express = require('express');
var app = express();
var mongo = require('./MongoDB.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.get("/", function(req, res){
	res.sendfile("index.html");
});
app.get('/MongoDB/logs/:col', function(req, res){

	var opt = req.query["options"];
	if (opt === undefined || opt === "")
		opt = {};
	else {
		opt = eval("(" + opt + ")")
	}
	
	mongo.select(req.param('col'), opt, function(err, docs){
		// Jsonp request
		res.jsonp(docs);
	});
});
app.get('/MongoDB/logs/:col/:id', function(req, res){
	mongo.selectByID(req.param('col'), req.param('id'), function(err, docs){
		res.jsonp(docs);
	});
});
app.post('/MongoDB/logs/:col', function(req, res){
	try{
		var doc = JSON.parse(req.body["doc"]);
		mongo.insert(req.param('col'), doc, function(err, id, result){
			res.jsonp({"id": id});
		});
	} catch (e) {
		res.send(e);
	}
});
app.put('/MongoDB/logs/:col/:id', function(req, res){
	var doc = JSON.parse(req.body["doc"]);
	mongo.update(req.param('col'), req.param('id'), doc, function(err, result) {
		res.jsonp(result);
	});
});
app.delete('/MongoDB/logs/:col/:id', function(req, res){
	mongo.delete(req.param('col'), req.param('id'), function(err, result){
		res.jsonp(result);
	});
});

app.listen(3000);