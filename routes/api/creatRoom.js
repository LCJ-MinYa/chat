var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var utils = require('../utils/utils.js');
require('../../model/room.server.module.js');
var RoomList = mongoose.model('RoomList');

require('../../model/roomUserList.server.module.js');
var RoomUserList = mongoose.model('RoomUserList');

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
			else {
				var roomId = utils.creatRandomNum();
				roomInsert(roomId);
			}
		}
	})

	var roomInsert = function(roomId) {
		var content = {
			userName: req.body.userName,
			uid: req.body.uid,
			roomName: req.body.roomName,
			roomDetail: req.body.roomDetail,
			roomId: roomId
		}
		var room = new RoomList(content);
		room.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				creatRoomUserList(roomId);
			}
		})
	}

	var creatRoomUserList = function(roomId) {
		var content = {
			roomId: roomId,
			roomUserList: []
		}
		var creatList = new RoomUserList(content);
		creatList.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				utils.sendJson(res, 200, "创建房间成功", {
					roomId: roomId
				});
			}
		})
	}
})

module.exports = router;