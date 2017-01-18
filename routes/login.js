var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	if (req.cookies.uid) {
		res.redirect('/index');
	} else {
		res.render('login', {
			pageName: 'login'
		});
	}
});

module.exports = router;