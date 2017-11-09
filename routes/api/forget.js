var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var utils = require('../utils/utils.js');
var mail = require('../utils/mail.js');
require('../../model/user.server.module.js');
var User = mongoose.model('User');

/* GET home page. */
router.get('/forget', function(req, res) {
	res.send("请求资源不支持HTTP方法GET访问！");
});

router.post('/forget', function(req, res) {
	User.findOne({
		email: req.body.email
	}, function(err, result) {
		if (err) {
			utils.sendJson(res, 404, err);
		} else {
			if (result) {
				var subject = '恣意游用户重置密码';
				var url = req.protocol + "://" + req.get('host') + '/login?uid=' + result.uid;
				var html = '<p>亲爱的用户:</p><br/><p>感谢您使用恣意游重置密码功能.</p><p>请点击以下链接完成重置功能</p>';
				html += '<p><a href="' + url + '">' + url + '</a></p>';
				mail.sendMail(req.body.email, subject, html, function(result) {
					if (result.status == 200) {
						utils.sendJson(res, 200, result.message);
					} else {
						utils.sendJson(res, 404, result.message);
					}
				})
			} else {
				utils.sendJson(res, 404, '该邮箱地址暂未注册');
			}
		}
	})
});

module.exports = router;