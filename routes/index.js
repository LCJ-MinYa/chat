var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', {
		pageName: '列表-恣意游',
		page: 'index'
	});
});

module.exports = router;