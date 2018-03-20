# minya-chat
一个简单的聊天室页面

线上地址http://chat.ziyiu.com<br />
1.支持创建聊天室，可多个聊天室共存<br />
2.需要注册登录（以便之后扩展用户系统）<br />
3.默认端口设置的8083，可以在config/config.js文件修改port<br />
4.入口文件修改为www/server.js,启动命令npm start<br />
5.测试请用多个浏览器（设备）进行<br />

##测试账号
> ceshi@ziyiu.com  123456  
> 123456789@ziyiu.com 123456

喜欢请给个star吧~~~
界面截图<br />
![image](https://github.com/LCJ-MinYa/chat/blob/master/www/img/login.PNG)<br />
![image](https://github.com/LCJ-MinYa/chat/blob/master/www/img/index.PNG)<br />
![image](https://github.com/LCJ-MinYa/chat/blob/master/www/img/room.PNG)<br />

##已知BUG
* 小米浏览器不能正确监听websocket退出事件
* 开启了服务器只允许指定IP访问指定端口，数据库连接不稳定(通过代码服务器请求数据库没问题，数据库不稳定是因为采用Robo 3T数据库可视化工具访问才不稳定，暂不解决)
