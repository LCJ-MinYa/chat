/*
 * ===========================
 *
 * 房间 => room
 * @author   : LiChaoJun
 * @datetime : 2017/01/04
 *
 * ===========================
 */
(function() {
	var socket = io('ws://chat.lichaojun.com:8083'); //ws://chat.lichaojun.com:8083
	var uid = GZL.getCookie('uid');
	var userName = GZL.getCookie('userName');
	var roomModel = new Vue({
		el: "#js_room_body",
		data: function() {
			return {
				firstLoading: true,
				userEnterMsg: [],
				sendMsg: '',
				msgList: [],
			}
		},
		mounted: function() {
			var _this = this;
			this.$nextTick(function() {
				_this.firstLoading = false;
			})
			socket.on('connect', function() {
				console.log("用户连接");
				socket.emit('enter', {
					uid: uid,
					userName: userName
				});
			})

			//做进入时其他状态console打印信息调试用
			socket.on('enter', function(msg) {
				console.log(msg);
			})

			//确认进入房间，页面输出信息告知其他用户
			socket.on('enterSuccess', function(obj) {
				_this.userEnterMsg.push(obj.userName + '进入了房间');
			})

			//接收服务端推送的用户发送信息
			socket.on('message', function(msg, obj) {
				console.log(123);
				_this.msgList.push({
					msg: msg,
					userName: obj.userName
				});
			})

			//做进入时其他状态console打印信息调试用
			socket.on('break', function(obj) {
				_this.userEnterMsg.push(obj.userName + '退出了房间');
			})
		},
		methods: {
			doSendMsg: function() {
				if (this.sendMsg) {
					socket.emit('message', this.sendMsg);
					this.sendMsg = "";
				}
			}
		}
	})
}());