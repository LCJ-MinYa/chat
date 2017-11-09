module.exports = function(app, express, path) {
	/*
	 * 页面的url请求
	 * GET请求
	 */
	//index 首页
	var index = require('./index');
	app.use('/', index);
	app.use('/index', index);
	//login 登录和注册
	var login = require('./login');
	app.use('/login', login);
	//room 房间
	var room = require('./room');
	app.use('/room', room);
	app.ready = function(server) {
		room.roomSocketIo(server);
	};

	/*
	 * 页面的api请求
	 * GET,POST请求
	 * 所有api下放到专门的api文件下
	 */
	var loginApi = require('./api/login');
	app.use('/api', loginApi);
	var registerApi = require('./api/register');
	app.use('/api', registerApi);
	var resetApi = require('./api/reset.js');
	app.use('/api', resetApi);
	var forgetApi = require('./api/forget.js');
	app.use('/api', forgetApi);
	var creatRoomApi = require('./api/creatRoom.js');
	app.use('/api', creatRoomApi);
	var getRoomList = require('./api/getRoomList.js');
	app.use('/api', getRoomList);


	app.use(express.static(path.join(__dirname, '../www'), {
		maxAge: 0
	}));

	//404和错误程序处理
	app.use(function(req, res, next) {
		var err = new Error('目录不存在，请检查');
		err.status = 404;
		next(err);
	});

	//错误程序处理
	app.use(function(err, req, res, next) {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		//显示错误页面
		res.status(err.status || 500);
		res.render('./error/error');
	});
}