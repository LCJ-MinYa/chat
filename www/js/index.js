/*
 * ===========================
 *
 * 首页 => index
 * @author   : LiChaoJun
 * @datetime : 2016/12/27
 *
 * ===========================
 */
(function() {
	var indexModel = new Vue({
		el: '#js_index_body',
		data: function() {
			return {
				firstLoading: true,
				uid: GZL.getCookie("uid"),
				userName: GZL.getCookie("userName"),
				roomList: [],
				onLineUser: 0,
				message: {
					isShowMessageBox: false,
					messageText: "提示信息",
					leftBtnText: "取消",
					rightBtnText: "确认"
				},
				creatRoom: {
					showCreatRoom: false,
					roomName: "",
					roomDetail: "",
					roomId: "",
				},
				popup: {
					showPopupText: false,
					popupText: "",
				},
				reqLoading: false,
			}
		},
		mounted: function() {
			var _this = this;
			this.getRoomListMsg();
		},
		computed: {
			isLogin: function() {
				if (this.uid != "undefined" && this.userName != "undefined") {
					return true;
				}
				return false;
			}
		},
		methods: {
			getRoomListMsg: function() {
				var _this = this;
				GZL.ajax({
					url: GZL.CONFIG.ROOMLIST,
					method: 'POST',
					data: {
						pageIndex: 1,
					},
					success: function(result) {
						_this.firstLoading = false;
						_this.roomList = result.data;
						_this.onLineUser = result.message;
					}
				}, this);
			},
			goRoomPage: function(roomList) {
				if (this.isLogin) {
					if (roomList.roomId) window.location.href = encodeURI(encodeURI("room?roomId=" + roomList.roomId + '&roomName=' + roomList.roomName));
				} else {
					this.message.isShowMessageBox = true;
					this.message.messageText = "您还未登录,是否登录？"
				}
			},
			goLogin: function() {
				window.location.href = 'login';
			},
			openCreatRoomDom: function() {
				if (this.isLogin) {
					this.creatRoom.showCreatRoom = true;
				} else {
					this.message.isShowMessageBox = true;
					this.message.messageText = "您还未登录,是否登录？";
				}
			},
			cancelMessageBox: function() {
				this.message.isShowMessageBox = false;
			},
			confirmMessageBox: function() {
				this.message.isShowMessageBox = false;
				if (this.isLogin) window.location.href = encodeURI(encodeURI("room?roomId=" + this.creatRoom.roomId + '&roomName=' + this.creatRoom.roomName));
				else window.location.href = "login";
			},
			closeCreatRoomDom: function() {
				this.creatRoom.showCreatRoom = false;
			},
			goCreatRoom: function() {
				var _this = this;
				if (!this.creatRoom.roomName) {
					GZL.popue(this, "房间名称不能为空");
				} else if (!this.creatRoom.roomDetail) {
					GZL.popue(this, "房间介绍不能为空");
				} else {
					GZL.ajax({
						url: GZL.CONFIG.CREATROOM,
						method: "POST",
						data: {
							userName: this.userName,
							uid: this.uid,
							roomName: this.creatRoom.roomName,
							roomDetail: this.creatRoom.roomDetail,
						},
						success: function(result) {
							if (result.status === 200) {
								_this.creatRoom.roomId = result.data.roomId;
								_this.creatRoom.showCreatRoom = false;
								_this.message.isShowMessageBox = true;
								_this.message.messageText = result.message + ",是否进入房间？";
							} else {
								GZL.popue(_this, result.message);
							}
						}
					}, this)
				}
			}
		}
	});
}());