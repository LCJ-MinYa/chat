'use strict';

/*--发送邮件--*/
var Nodemailer = require('nodemailer');
/*--基本配置--*/
var Config = require('../../config/config.js');

var smtpTransport = Nodemailer.createTransport(Config.MAIL);

/**
 * [sendMail 发送邮件]
 * @param {String} subject：发送的主题
 * @param {String} html：发送的 html 内容
 */
var sendMail = function(emailAddress, subject, html, callback) {
	var emailAddressArr = [];
	emailAddressArr.push(emailAddress);
	var mailOptions = {
		from: '希希里岸 <xlzzslzy@163.com>',
		to: emailAddressArr,
		subject: subject,
		html: html
	};

	smtpTransport.sendMail(mailOptions, function(error, response) {
		if (error) {
			callback({
				status: 404,
				message: '邮件发送失败',
				data: error
			});
		} else {
			callback({
				status: 200,
				message: '邮件发送成功',
				data: response
			});
		}
		smtpTransport.close();
	});
};

module.exports = {
	sendMail
}