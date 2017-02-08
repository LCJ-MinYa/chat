var express = require('express');
var router = express.Router();
var socketIo = require('socket.io');
var utils = require('./utils/utils.js');
var mongoose = require('mongoose');
require('../model/room.server.module.js');
var RoomList = mongoose.model('RoomList');
require('../model/roomUserList.server.module.js');
var roomUserList = mongoose.model('RoomUserList');

router.get('/', function(req, res, next) {
	if (!req.cookies.uid) {
		res.redirect('/login');
	} else {
		if (req.query.roomId) {
			res.render('room', {
				pageName: 'room'
			});
		} else {
			res.redirect('/index');
		}
	}
});

router.roomSocketIo = function(server) {
	var io = socketIo.listen(server);

	//所有在线用户
	var allUserList = [];
	//所有房间列表
	var roomList = {};

	//连接房间
	io.on('connection', function(socket) {
		// 获取用户当前的url，从而截取出房间id
		var socketReqUrl = socket.request.headers.referer;
		var query = utils.parseURI(socketReqUrl);
		var roomId = query.roomId;
		var nowConnectUser = {};

		// 监听来自客户端的消息
		socket.on('enter', function(obj) {
			if (roomId) {
				RoomList.findOne({
					roomId: roomId
				}, function(err, result) {
					if (err) socket.emit('enter', err);
					else {
						if (result) {
							nowConnectUser = obj;
							if (!roomList[roomId]) {
								roomList[roomId] = [];
							}
							for (var i = 0; i < roomList[roomId].length; i++) {
								if (roomList[roomId][i].uid == nowConnectUser.uid) {
									nowConnectUser = {};
									socket.emit('enter', '该用户已存在该聊天室，您可以进入其他聊天室或切换账号!');
									return;
								}
							}
							roomList[roomId].push(nowConnectUser);
							socket.join(roomId);
							//通知房间里面的人
							socket.to(roomId).emit('enterSuccess', nowConnectUser);
							//通知自己，即显示在当前页面
							socket.emit('enterSuccess', nowConnectUser);
						} else {
							socket.emit('enter', '房间不存在!');
						}
					}
				})
			} else {
				socket.emit('enter', '房间不存在!');
			}
		});

		// 监听来自客户端的消息
		socket.on('message', function(msg) {
			if (!roomList[roomId]) {
				return;
			}
			// 验证如果用户不在房间内则不给发送
			for (var i = 0; i < roomList[roomId].length; i++) {
				if (roomList[roomId][i].uid == nowConnectUser.uid) {
					socket.to(roomId).emit('message', msg, nowConnectUser);
					socket.emit('message', msg, nowConnectUser);
					//return;
				}
			}
		});

		//监听用户退出
		socket.on('disconnect', function() {
			// 从房间名单中移除
			socket.leave(roomId, function(err) {
				if (err) {
					log.error(err);
				} else {
					if (!roomList[roomId] || !nowConnectUser.uid) {
						return;
					}
					for (var i = 0; i < roomList[roomId].length; i++) {
						console.log('匹配到退出用户');
						if (roomList[roomId][i].uid == nowConnectUser.uid) roomList[roomId].splice(i, 1);
					}
					//向当前房间客户端广播用户退出
					socket.to(roomId).emit('break', nowConnectUser);
				}
			})
		});

	});

	//将连接用户插入房间
	var roomUserInsert = function(roomId, obj, socket) {
		var content = {
			roomId: roomId,
			uid: obj.uid,
			userName: obj.userName
		}
		var roomUser = new roomUserList(content);
		roomUser.save(function(err) {
			if (err) {
				socket.emit('enter', err);
			} else {
				socket.emit('enter', '保存房间人数成功!');
			}
		})
	}
}

module.exports = router;