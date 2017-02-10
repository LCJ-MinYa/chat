var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var utils = require('../utils/utils.js');
require('../../model/room.server.module.js');
var RoomList = mongoose.model('RoomList');

require('../../model/roomUserList.server.module.js');
var RoomUserList = mongoose.model('RoomUserList');

router.get('/getRoomList', function(req, res) {
	res.send("请求资源不支持HTTP方法GET访问！");
});

router.post('/getRoomList', function(req, res) {
	RoomList.find({}, function(err, result) {
		if (err) {
			utils.sendJson(res, 404, err);
		} else {
			if (result) {
				getRoomUserNum(result);
			} else {
				utils.sendJson(res, 404, '暂无房间列表');
			}
		}
	})

	var getRoomUserNum = function(data) {
		RoomUserList.find({}, function(err, result) {
			if (err) {
				utils.sendJson(res, 404, err);
			} else {
				var allUserNum = 0;
				for (var i = 0; i < data.length; i++) {
					for (var j = 0; j < result.length; j++) {
						if (data[i].roomId == result[j].roomId) {
							data[i].userNum = result[j].roomUserList.length;
							allUserNum += result[j].roomUserList.length;
						}
					}
				}
				utils.sendJson(res, 200, allUserNum, data);
			}
		})
	}
})

module.exports = router;