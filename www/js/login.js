/*
 * ===========================
 *
 * 登录 => login
 * @author   : LiChaoJun
 * @datetime : 2016/12/23
 *
 * ===========================
 */
(function() {
	var loginModel = new Vue({
		el: '#js_login_body',
		data: function() {
			return {
				firstLoading: true,
				login: false,
				register: false,
				forget: false,
				reqLoading: false,
				reset: false,
				userName: "",
				password: "",
				email: '',
				confirmPassword: "",
				popup: {
					showPopupText: false,
					popupText: "",
				},
			}
		},
		mounted: function() {
			var uid = GZL.getCookie("uid");
			if (uid != "undefined") {
				window.location.href = 'index';
			}
			var _this = this;
			this.$nextTick(function() {
				_this.firstLoading = false;
				console.log(GZL.GetQueryString('uid'));
				if (GZL.GetQueryString('uid')) {
					_this.reset = true;
				} else {
					_this.login = true;
				}
			})
		},
		methods: {
			toggleShow: function(name) {
				this.login = !this.login;
				if (name == 'register' || this.register) {
					this.register = !this.register;
				}
				if (name == 'forget' || this.forget) {
					this.forget = !this.forget;
				}
				if (this.reset) {
					this.reset = false;
				}
			},
			checkOutMsg: function(type) {
				var _this = this;
				if (type == 'register' || type == 'login') {
					if (!this.email) {
						GZL.popue(_this, "邮箱地址不能为空");
						return;
					}
					if (!GZL.MatchEmail(this.email)) {
						GZL.popue(_this, "请输入正确的邮箱地址");
						return;
					}
				}

				if (type == 'register') {
					if (!this.userName) {
						GZL.popue(_this, "昵称不能为空");
						return;
					}
					if (this.userName.length < 2) {
						GZL.popue(_this, "昵称不能小于两个字符");
						return;
					}
				}

				if (type == 'password' || type == 'login') {
					if (!this.password) {
						GZL.popue(_this, "密码不能为空");
						return;
					}
					if (this.password.length < 6) {
						GZL.popue(_this, "密码不能小于6位数");
						return;
					}
					if (type == 'password') {
						if (this.confirmPassword != this.password) {
							GZL.popue(_this, "两次密码不相等");
							return;
						}
					}
				}

				this.userBtnClick(type);
			},
			userBtnClick: function(type) {
				var _this = this;
				var url = '';
				if (type == 'login') {
					url = GZL.CONFIG.LOGIN;
				} else if (type == 'register') {
					url = GZL.CONFIG.REGISTER;
				} else if (type == 'password') {
					url = GZL.CONFIG.RESET;
				} else if (type == 'forget') {
					url = GZL.CONFIG.FORGET;
				}
				GZL.ajax({
					url: url,
					method: "POST",
					data: {
						email: this.email,
						userName: this.userName,
						password: this.password,
						uid: GZL.GetQueryString('uid')
					},
					success: function(result) {
						if (result.status === 200) {
							if (type == 'login' || type == 'password') {
								GZL.setCookie("uid", result.data.uid, {
									expires: 24 * 7
								})
								GZL.setCookie("userName", result.data.userName, {
									expires: 24 * 7
								})
								window.location.href = 'index';
							} else {
								GZL.popue(_this, result.message);
							}
						} else {
							GZL.popue(_this, result.message);
						}
					}
				}, _this);
			}
		}
	});
}());