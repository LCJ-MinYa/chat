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
	var socket = io('ws://172.16.0.176:8083');
	var uid = GZL.getCookie('uid');
	var userName = GZL.getCookie('userName');
	var roomModel = new Vue({
		el: "#js_room_body",
		data: function() {
			return {
				firstLoading: true,
				userNum: '',
				sendMsg: '',
				msgList: [],
				roomName: '',
				message: {
					isShowMessageBox: false,
					messageText: "提示信息",
					leftBtnText: "返回",
					rightBtnText: "确认"
				},
				creatRoom: {
					showCreatRoom: false,
				}
			}
		},
		mounted: function() {
			var _this = this;
			_this.roomName = decodeURI(GZL.GetQueryString("roomName"));
			this.$nextTick(function() {
				_this.firstLoading = false;
			})
			socket.on('connect', function() {
				socket.emit('enter', {
					uid: uid,
					userName: userName,
					roomId: GZL.GetQueryString("roomId")
				});
			})

			//做进入时其他状态console打印信息调试用
			socket.on('enter', function(msg) {
				console.log(msg);
				_this.message.isShowMessageBox = true;
				_this.message.messageText = msg;
			})

			//确认进入房间，页面输出信息告知其他用户
			socket.on('enterSuccess', function(num) {
				_this.userNum = num + '人在线';
			})

			//接收服务端推送的用户发送信息
			socket.on('message', function(msg, obj, isMyself, time) {
				_this.msgList.push({
					msg: msg,
					userName: obj.userName,
					isMyself: isMyself,
					time: time
				});
				_this.$nextTick(function() {
					window.scrollTo(0, document.body.scrollHeight);
				});
			})

			//做进入时其他状态console打印信息调试用
			socket.on('break', function(num) {
				_this.userNum = num + '人在线';
			})
		},
		methods: {
			doSendMsg: function() {
				if (this.sendMsg) {
					socket.emit('message', this.sendMsg);
					this.sendMsg = "";
				}
			},
			goBack: function() {
				window.location.href = 'index';
			},
			cancelMessageBox: function() {
				window.location.href = 'index';
			},
			confirmMessageBox: function() {
				window.location.href = 'index';
			}
		}
	})
}());