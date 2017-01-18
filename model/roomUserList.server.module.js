var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var db = require('../config/mongoose.js');

//申明一个mongoons对象
var RoomUserListSchema = new mongoose.Schema({
	roomId: String,
	uid: String,
	userName: String,
	addTime: {
		type: Date,
		default: new Date()
	}
})

mongoose.model('RoomUserList', RoomUserListSchema, "RoomUserList");