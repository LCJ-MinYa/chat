var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var db = require('../config/mongoose.js');

//申明一个mongoons对象
var UserSchema = new mongoose.Schema({
	userName: String,
	email: String,
	password: String,
	uid: String,
	time: {
		type: Date,
		default: new Date()
	}
})

mongoose.model('User', UserSchema, "User");