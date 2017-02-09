var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var db = require('../config/mongoose.js');

//申明一个mongoons对象
var MessageRecordSchema = new mongoose.Schema({
	type: Number,
	userName: String,
	time: {
		type: Date,
		default: new Date()
	},
	roomName: String,
	roomId: String,
	message: String
})

mongoose.model('MessageRecord', MessageRecordSchema, "MessageRecord");