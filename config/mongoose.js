var mongoose = require('mongoose'); //引入mongoose模块
var config = require('./config.js'); //引入配置文件
var db = mongoose.connect(config.mongodb);
db.connection.on('error', function(error) {
	console.log('数据库连接失败：' + error);
});
db.connection.on('open', function() {
	console.log('——数据库连接成功！——');
});

module.exports = db;