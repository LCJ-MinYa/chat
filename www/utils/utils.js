var GZL = (function(root, factory) {
    "use strict";

    //模块名称
    var _MODULE_NAME = "[Godzilla]";
    //模块版本
    var _MODULE_VERSION = "1.2.1";

    /**
     * [settings 默认参数设置]
     * @param  {[boolean]} DEBUG    [是否开启调试模式,默认false]
     */
    factory.settings = {
        DEBUG: false
    };

    /*
     * 接口请求配置
     */
    factory.CONFIG = {
        BASE_API: "http://127.0.0.1:8083",
        LOGIN: "/api/login",
        REGISTER: "/api/register",
        CREATROOM: "/api/creatRoom",
        ROOMLIST: "/api/getRoomList",
        RESET: "/api/reset",
        FORGET: "/api/forget",
    };

    factory.popue = function(_this, text) {
        _this.popup.showPopupText = true;
        _this.popup.popupText = text;
        setTimeout(function() {
            _this.popup.showPopupText = false;
        }, 1500);
    };

    //定向获取url参数
    factory.GetQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    };

    //邮箱地址正则表达式判断
    factory.MatchEmail = function(string) {
        var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        return reg.test(string);
    }

    /**
     * [ajax 封装ajax]
     * @param  {[object]} options
     * options.url:请求接口地址
     * options.method:请求类型，默认为GET
     * options.data:请求参数
     * options.success:请求成功回调函数
     * options.error:请求失败回调函数
     * @return {[object]} [JSON Object]
     */
    factory.ajax = function(options, _this) {
        _this.reqLoading = true;
        var xhr = null;
        options = options || null;
        if (!options) {
            if (factory.settings.DEBUG) {
                console.info(_MODULE_NAME, options);
            }
            console.error(_MODULE_NAME, "options is required");
            return false;
        }
        options.method = options.method || "GET";
        options.data = options.data || {};
        options.url = options.url || null;
        options.success = options.success || function() {};
        options.error = options.error || function() {};
        if (!options.url) {
            if (factory.settings.DEBUG) {
                console.info(_MODULE_NAME, url);
            }
            console.error(_MODULE_NAME, "options url is required");
            return false;
        }
        if (root.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
            if (factory.settings.DEBUG) {
                console.info(_MODULE_NAME, "Browser ajax supported");
            }
        } else {
            if (factory.settings.DEBUG) {
                console.error(_MODULE_NAME, "Browser not support ajax");
            }
            xhr = null;
        }
        var type = options.method.toUpperCase();
        var random = Math.random();
        if (typeof options.data == 'object') {
            var query = '';
            for (var key in options.data) {
                query += key + '=' + options.data[key] + '&';
            }
            options.data = query.replace(/&$/, '');
        }
        if (type == 'GET') {
            if (options.data) {
                xhr.open('GET', options.url + '?' + options.data, true);
            } else {
                xhr.open('GET', options.url + '?t=' + random, true);
            }
            xhr.send();
        } else if (type == 'POST') {
            xhr.open('POST', options.url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(options.data);
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (factory.settings.DEBUG) {
                    console.log(_MODULE_NAME, "request status:", xhr.status);
                }
                if (xhr.status == 200) {
                    var resultData = xhr.responseText;
                    try {
                        resultData = JSON.parse(resultData);
                    } catch (e) {
                        if (factory.settings.DEBUG) {
                            console.log(_MODULE_NAME, "Error:", e);
                        }
                        resultData = resultData;
                    }
                    if (factory.settings.DEBUG) {
                        console.log(_MODULE_NAME, "Ajax Result:", resultData);
                    }
                    _this.reqLoading = false;
                    options.success(resultData);
                } else {
                    if (factory.settings.DEBUG) {
                        console.log(_MODULE_NAME, "Ajax Result:", xhr.responseText);
                    }
                    options.error(xhr.status);
                }
            }
        };
    };

    /**
     * [setCookie 设置cookie]
     * @param {[string]} key   [cookie的name]
     * @param {[string]} value [cookie的值]
     * @param {[object]} options [可选][设置cookie相关的属性，expires：过期小时数，path：路径，domain：域名，secure：是否是安全传输]
     */
    factory.setCookie = function(key, value) {
        var options = null;
        if (arguments.length > 2) {
            options = arguments[2];
        } else {
            options = null;
        }
        if (key && value) {
            var cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            if (options !== null) {
                if (options.expires) {
                    var times = new Date();
                    times.setTime(times.getTime() + options.expires * 60 * 60 * 1000);
                    cookie += ';expires=' + times.toGMTString();
                }
                if (options.path) {
                    cookie += ';path=' + options.path;
                }
                if (options.domain) {
                    cookie += ';domain=' + options.domain;
                }
                if (options.secure) {
                    cookie += ';secure';
                }
            }
            document.cookie = cookie;
            if (factory.settings.DEBUG) {
                console.log(document.cookie);
            }
            return cookie;
        } else {
            return "";
        }
    };
    /**
     * [getCookie 获取cookie]
     * @param  {[string]} name [cookie的name]
     * @return {[sting]}      [cookie的value]
     */
    factory.getCookie = function(name) {
        var cookies = parseCookie();
        var current = decodeURIComponent(cookies[name]) || null;
        if (factory.settings.DEBUG) {
            console.log("[INFO]" + _MODULE_NAME + ": Cookie " + name + " value is " + current);
        }
        return current;
    };
    /**
     * [removeCookie 删除cookie的值]
     * @param  {[string]} name [cookie的关键字]
     * @return {[void]}      [无]
     */
    factory.removeCookie = function(name) {
        var cookies = parseCookie();
        if (cookies[name]) {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        if (factory.settings.DEBUG) {
            console.log(document.cookie);
        }
    };
    /**
     * [clearCookie 清除全部cookie]
     * @return {[void]} [无]
     */
    factory.clearCookie = function() {
        var cookies = parseCookie();
        for (var key in cookies) {
            document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    };
    /**
     * [getAllCookies 获取当前全部cookie]
     * @return {[void]} [无]
     */
    factory.getAllCookies = function() {
        var cookies = parseCookie();
        var tmpCookies = {};
        for (var key in cookies) {
            tmpCookies[key] = decodeURIComponent(cookies[key]);
        }
        if (factory.settings.DEBUG) {
            console.log(tmpCookies);
        }
        return tmpCookies;
    };

    /**
     * [parseCookie 解析cookie，将cookie的字符串解析为Object]
     * @return {[object]} [object的cookie]
     */
    var parseCookie = function() {
        var cookies = {};
        if (factory.settings.DEBUG) {
            console.log("[INFO]" + _MODULE_NAME + ": Cookie infomation:");
            console.log(document.cookie);
        }
        if (document.cookie) {
            var tmpCookies = document.cookie.split(";");
            for (var key in tmpCookies) {
                if (key === '$remove') {
                    continue;
                }
                var index = tmpCookies[key].indexOf("=");
                var name = tmpCookies[key].substr(0, index).replace(/\s+/g, "");
                var value = tmpCookies[key].substr(index + 1, tmpCookies[key].length).replace(/\s+/g, "");
                cookies[name] = value;
            }
        }
        if (factory.settings.DEBUG) {
            console.log(cookies);
        }
        return cookies;
    };

    /* 暴露 API 工厂*/
    return factory;

})(window, window.GZL = window.GZL || {});
