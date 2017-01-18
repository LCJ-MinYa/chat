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
				login: true,
				register: false,
				reqLoading: false,
				userName: "",
				password: "",
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
			})
		},
		methods: {
			toggleShow: function() {
				this.login = !this.login;
				this.register = !this.register;
			},
			userLogin: function() {
				var _this = this;
				if (this.userName && this.password) {
					GZL.ajax({
						url: GZL.CONFIG.LOGIN,
						method: "POST",
						data: {
							userName: this.userName,
							password: this.password
						},
						success: function(result) {
							if (result.status === 200) {
								GZL.setCookie("uid", result.data.uid, {
									expires: 24
								})
								GZL.setCookie("userName", result.data.userName, {
									expires: 24
								})
								window.location.href = 'index';
							} else GZL.popue(_this, result.message);
						}
					}, _this);
				} else {
					if (!this.userName) GZL.popue(_this, "账号不能为空");
					else if (!this.password) GZL.popue(_this, "密码不能为空");
				}
			},
			userRegister: function() {
				var _this = this;
				if (this.userName && this.password && this.confirmPassword && this.password == this.confirmPassword) {
					GZL.ajax({
						url: GZL.CONFIG.REGISTER,
						method: "POST",
						data: {
							userName: this.userName,
							password: this.password
						},
						success: function(result) {
							if (result.status === 200) {
								GZL.setCookie("uid", result.data.uid, {
									expires: 24
								})
								GZL.setCookie("userName", result.data.userName, {
									expires: 24
								})
								window.location.href = 'index';
							} else GZL.popue(_this, result.message);
						}
					}, _this);
				} else {
					if (!this.userName) GZL.popue(_this, "账号不能为空");
					else if (!this.password || !this.confirmPassword) GZL.popue(_this, "密码不能为空");
					else if (this.password != this.confirmPassword) GZL.popue(_this, "两次密码不相等");
				}
			}
		}
	});
}());