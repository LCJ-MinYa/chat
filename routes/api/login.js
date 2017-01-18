var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var utils = require('../utils/utils.js');
require('../../model/user.server.module.js');
var User = mongoose.model('User');

/* GET home page. */
router.get('/login', function(req, res) {
	res.send("请求资源不支持HTTP方法GET访问！");
});

router.post('/login', function(req, res) {
	User.findOne({
		userName: req.body.userName
	}, function(err, result) {
		if (err) {
			utils.sendJson(res, 404, err);
		} else {
			if (result) {
				if (result.password == req.body.password) utils.sendJson(res, 200, '登录成功', {
					uid: result.uid,
					userName: result.userName
				});
				else utils.sendJson(res, 404, '密码错误');
			} else {
				utils.sendJson(res, 404, '用户不存在');
			}
		}
	});
});

module.exports = router;