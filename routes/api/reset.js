var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var utils = require('../utils/utils.js');
require('../../model/user.server.module.js');
var User = mongoose.model('User');

/* GET home page. */
router.get('/reset', function(req, res) {
	res.send("请求资源不支持HTTP方法GET访问！");
});

router.post('/reset', function(req, res) {
	User.update({
		uid: req.body.uid
	}, {
		$set: {
			password: req.body.password
		}
	}, {}, function(err, result) {
		if (err) {
			utils.sendJson(res, 404, err);
		} else {
			var resultObj = JSON.parse(JSON.stringify(result));
			console.log(resultObj);
			if (resultObj.nModified == 0) {
				utils.sendJson(res, 404, '用户不存在');
			} else {
				User.findOne({
					uid: req.body.uid
				}, function(err, result) {
					utils.sendJson(res, 200, '密码修改成功', {
						uid: result.uid,
						userName: result.userName
					});
				});
			}
		}
	});
});

module.exports = router;