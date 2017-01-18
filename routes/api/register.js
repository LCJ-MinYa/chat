var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var utils = require('../utils/utils.js');
require('../../model/user.server.module.js');
var User = mongoose.model('User');

/* GET home page. */
router.get('/register', function(req, res) {
	res.send("请求资源不支持HTTP方法GET访问！");
});

router.post('/register', function(req, res) {
	User.findOne({
		userName: req.body.userName
	}, function(err, result) {
		if (err) {
			utils.sendJson(res, 404, err);
		} else {
			if (result) {
				utils.sendJson(res, 404, '用户名已注册');
			} else {
				userInsert();
			}
		}
	})

	var userInsert = function() {
		var content = {
			userName: req.body.userName,
			password: req.body.password,
			uid: utils.generateUUID()
		}
		var user = new User(content);
		user.save(function(err) {
			if (err) {
				utils.sendJson(res, 404, err);
			} else {
				utils.sendJson(res, 200, "注册成功", {
					uid: content.uid,
					userName: content.userName
				});
			}
		})
	}
});

module.exports = router;