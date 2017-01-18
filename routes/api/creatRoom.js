var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var utils = require('../utils/utils.js');
require('../../model/room.server.module.js');
var RoomList = mongoose.model('RoomList');

router.get('/creatRoom', function(req, res) {
	res.send("请求资源不支持HTTP方法GET访问！");
});

router.post('/creatRoom', function(req, res) {
	RoomList.findOne({
		roomName: req.body.roomName
	}, function(err, result) {
		if (err) {
			utils.sendJson(res, 404, err);
		} else {
			if (result) utils.sendJson(res, 404, '房间名称已占用');
			else roomInsert();
		}
	})

	var roomInsert = function() {
		var roomId = utils.creatRandomNum();
		var content = {
			userName: req.body.userName,
			uid: req.body.uid,
			roomName: req.body.roomName,
			roomDetail: req.body.roomDetail,
			roomId: roomId
		}
		var room = new RoomList(content);
		room.save(function(err) {
			if (err) utils.sendJson(res, 404, err);
			else utils.sendJson(res, 200, "创建房间成功", {
				roomId: roomId
			});
		})
	}
})

module.exports = router;