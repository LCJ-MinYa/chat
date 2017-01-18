var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var db = require('../config/mongoose.js');

//申明一个mongoons对象
var RoomListSchema = new mongoose.Schema({
	uid: String,
	userName: String,
	time: {
		type: Date,
		default: new Date()
	},
	roomName: String,
	roomDetail: String,
	roomId: String,
})

mongoose.model('RoomList', RoomListSchema, "RoomList");