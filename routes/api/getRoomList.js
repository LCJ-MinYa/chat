var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var utils = require('../utils/utils.js');
require('../../model/room.server.module.js');
var RoomList = mongoose.model('RoomList');

router.get('/getRoomList', function(req, res) {
	res.send("请求资源不支持HTTP方法GET访问！");
});

router.post('/getRoomList', function(req, res) {
	RoomList.find({}, function(err, result) {
		if (err) {
			utils.sendJson(res, 404, err);
		} else {
			if (result) {
				console.log(result);
				utils.sendJson(res, 200, '查询房间列表成功', result);
			} else utils.sendJson(res, 404, '暂无房间列表');
		}
	})
})

module.exports = router;