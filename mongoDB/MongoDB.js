var _M = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require("mongodb").ObjectID;

var url = "mongodb://toomao:toomaologs@10.160.30.221:27019/logs?authSource=admin";
//var url = "mongodb://sa:sa123@192.168.0.199:27017/logs?authSource=admin";
var mongoDB;
MongoClient.connect(url, function(err, db){
	if (err)
		console.log(err);
	mongoDB = db;

});

var operate = {
	getDB: function(){
		return mongoDB;
	},
	select: function(name, find, callback){
		if (callback === undefined) {
			callback = find;
			find = {};
		}
		var col = mongoDB.collection(name);
		col.find(find, {limit: 100}).toArray(function(err, docs){
			callback(err, docs);
		});
	},
	selectByID: function(name, id, callback){
		
		var col = mongoDB.collection(name);
		col.find({"_id": ObjectID(id)}).toArray(function(err, docs){
			callback(err, docs);
		});
	},
	insert: function(name, doc, callback){
		var col = mongoDB.collection(name);
		doc._time = new Date().getTime();
		col.insert(doc, function(err, result){
			var id = result.ops[0]._id.toString();
			callback(err, id, result);
		});
	},
	update: function(name, id, doc, callback) {
		var col = mongoDB.collection(name);
		col.update({"_id": ObjectID(id)}, doc, function(err, result) {
			callback(err, result);
		});
	},
	delete: function(name, id, callback) {
		var col = mongoDB.collection(name);
		col.remove({"_id": ObjectID(id)}, function(err, result){
			callback(err, result);
		});
	}
};

module.exports = operate;