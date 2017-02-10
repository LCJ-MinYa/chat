var express = require('express');
var router = express.Router();
var socketIo = require('socket.io');
var utils = require('./utils/utils.js');
var mongoose = require('mongoose');
var moment = require('moment');

require('../model/room.server.module.js');
var RoomList = mongoose.model('RoomList');

require('../model/roomUserList.server.module.js');
var RoomUserList = mongoose.model('RoomUserList');

require('../model/message.server.module.js');
var MessageRecord = mongoose.model('MessageRecord');

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

	//所有在线用户列表
	var allUserList = [];
	//所有房间列表
	var roomList = {};
	//所有在线用户数量
	var allConnectUserNum = 0;

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
							/*
							 * 处理当前房间逻辑
							 * roomId 当前房间ID
							 * roomList[roomId]当前房间所有在线用户信息
							 */
							roomList[roomId].push(nowConnectUser);
							socket.join(roomId);
							//通知房间里面的人
							socket.to(roomId).emit('enterSuccess', roomList[roomId].length);
							//通知自己，即显示在当前页面
							socket.emit('enterSuccess', roomList[roomId].length);

							/*
							 * 处理所有房间逻辑
							 * allConnectUserNum 所有房间在线总人数
							 * allUserList 所有房间在线用户信息 allUserList.push(nowConnectUser);
							 */
							allConnectUserNum++;
							roomUserInsert(roomId, nowConnectUser);
							console.log('总在线人数' + allConnectUserNum);
							console.log('当前房间在线人数' + roomList[roomId].length);
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
					var msgTime = moment().format('h:mm A');
					socket.to(roomId).emit('message', msg, nowConnectUser, 0, msgTime);
					socket.emit('message', msg, nowConnectUser, 1, msgTime);
					messageInsert(1, nowConnectUser.userName, decodeURI(decodeURI(query.roomName)), roomId, msg);
					return;
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
						if (roomList[roomId][i].uid == nowConnectUser.uid) {
							roomList[roomId].splice(i, 1);
							allConnectUserNum--;
							roomUserRemove(roomId, nowConnectUser);
							console.log('匹配到退出用户,总人数' + allConnectUserNum);
							console.log('匹配到退出用户,当前房间人数' + roomList[roomId].length);
							break;
						}
					}
					//向当前房间客户端广播用户退出
					socket.to(roomId).emit('break', roomList[roomId].length);
				}
			})
		});

	});

	//将用户发送的消息保存在服务器
	var messageInsert = function(type, userName, roomName, roomId, message) {
		var content = {
			type: type,
			userName: userName,
			roomName: roomName,
			roomId: roomId,
			message: message
		}
		var newMessage = new MessageRecord(content);
		newMessage.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log('保存成功一条用户发送的信息');
			}
		})
	}

	//将连接用户存储到用户列表数据库
	var roomUserInsert = function(roomId, obj) {
		RoomUserList.findOne({
			roomId: roomId
		}, function(err, result) {
			if (err) {
				console.log(err);
			} else {
				if (result) {
					result.roomUserList.push(obj);
					result.save(function(err) {
						if (err) {
							console.log(err);
						} else {
							console.log("保存到用户列表成功");
						}
					});
				} else {
					console.log("未找到该房间用户列表，无法插入该用户");
				}
			}
		})
	}

	//将连接用户从用户列表数据库中删除
	var roomUserRemove = function(roomId, obj) {
		RoomUserList.findOne({
			roomId: roomId
		}, function(err, result) {
			if (err) {
				console.log(err);
			} else {
				if (result) {
					for (var i = 0; i < result.roomUserList.length; i++) {
						if (result.roomUserList[i].uid == obj.uid) {
							result.roomUserList.splice(i, 1);
							result.save(function(err) {
								if (err) {
									console.log(err);
								} else {
									console.log("删除用户列表成功");
								}
							});
						}
					}
				} else {
					console.log("未找到该房间用户列表，无法删除该用户");
				}
			}
		})
	}
}

module.exports = router;