//工具函数
/* ex:
 * 京东app-ios的ua: 
 * jdapp;iPhone;4.4.5;9.2.1;ccbe311b0252691b37b1c95aec42476e4c2435f2;network/wifi;ADID/426DEAAC-B01F-4643-9FEF-8F0B31818BFF;pv/100.2;utr/;ref/;psq/0;psn/ccbe311b0252691b37b1c95aec42476e4c2435f2|100;usc/;umd/;pap/JA2015_311210|4.4.5|IOS 9.2.1;ucp/;Mozilla/5.0 (iPhone; CPU iPhone OS 9_2_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13D15
 *
 * 京东app-android的ua: 
 * jdapp;android;4.3.0;4.2.1;863525024459051-6c5f1c1f1e24;network/wifi;pv/3376.12.1358900874425;Mozilla/5.0 (Linux; U; Android 4.2.1; zh-cn; Lenovo A670t Build/JOP40D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30
 */

;(function(){
    //allyong
    var slice = Array.prototype.slice,
        reges = /\{(\d+?)\}/g,
        agent = navigator.userAgent.toLowerCase(),
        isapp = agent.indexOf('jdapp') > -1,
        ref = location.href;


    function stringFormat(text) {
        var t;
        if (text instanceof Array) text = text.join("");
        if (arguments[1] instanceof Array) t = arguments[1];
        else t = slice.call(arguments, 1);
        return text.replace(reges, function() {
            return t[arguments[1]];
        });
    }

    /*
      跳转 parseUrl("1,http://m.jd.com")
    */
    function parseUrl(url, options) {
        var u = url.split(","),
            type = u[0],
            id = u[1];
        if (type == "1") { //M页
            url = id;
            if (/sale.jd.com\//.test(id)) {
                if (isapp) url = url.replace(/\/m\//, "/app/");
                else url = url.replace(/\/app\//, "/m/");
                url = passParam(url);
            } else if (url.indexOf("has_native=1") > -1) { // 通天塔原生页
                if (isapp) {
                    var aid = url.match(/\/active\/(.*)\//);
                    aid = aid ? aid : url.match(/\/activity\/preview\/(.*)\//);
                    if (!aid) return url = passParam(url);
                    aid = aid[1];
                    var sourceType = getParam(url, 'sourceType', 'test');
                    var sourceValue = getParam(url, 'sourceValue', 'test');
                    url = stringFormat('openApp.jdMobile://virtual?params={"category":"jump","des":"babel","sourceType":"{1}","sourceValue":"{2}","activityId":"{0}"}', aid, sourceType, sourceValue);
                } else {
                    url = passParam(url);
                }
            } else {
                url = passParam(url);
            }
        } else if (type == "2") { //商详
            if (isapp) {
                url = stringFormat('openApp.jdMobile://virtual?params={"category":"jump","des":"productDetail","skuId":"{0}","sourceType":"h5","sourceValue":"{1}"}', id, id);
            } else {
                url = passParam("http://item.m.jd.com/ware/view.action?wareId=" + id);
            }
        } else if (type == "3") { //店铺
            if (isapp) {
                url = stringFormat('openApp.jdMobile://virtual?params={"category":"jump","des":"jshopMain","shopId":"{0}","sourceType":"h5" ,"sourceValue":"double11_find"}', id);
            } else {
                url = passParam('http://ok.jd.com/m/index-' + id + '.html');
            }
        } else if (type == "4") { //搜索-关键字
            if (isapp) {
                url = stringFormat('openApp.jdMobile://virtual?params={"category":"jump","des":"productList","sourceType":"sourceType_test" ,"sourceValue":"sourceValue_test", "from":"search", "keyWord": "{0}"}', id);
            } else {
                url = passParam('http://m.jd.com/ware/search.action?keyword=' + id);
            }
        } else if (type == "4-1") { //搜索-分类
            if (isapp) {
                url = stringFormat('openApp.jdMobile://virtual?params={"category":"jump","des":"productList","sourceType":"sourceType_test" ,"sourceValue":"sourceValue_test", "from":"category", "cid": "{0}", "levelFirst": "{1}", "levelSecond": "{2}"}', options.cid, options.levelFirst, options.levelSecond);
            } else {
                url = passParam('http://m.jd.com/products/'+options.levelFirst+'-'+options.levelSecond+'-'+options.cid+'.html');
            }
        } else if (type == "5") { //发现-文章页
            if (isapp) {
                url = stringFormat('openApp.jdMobile://virtual?params={"category":"jump","des":"faxian_article","sourceType":"sourceType_test" ,"sourceValue":"sourceValue_test", "id": "{0}"}', id);
            } else {
                url = passParam('http://h5.m.jd.com/active/faxian/html/innerpage.html?id=' + id);
            }
        } else {
            url = passParam(url);
        }

        return url;
    }

    function getParam(url, key, defaultStr) {
        defaultStr = defaultStr ? defaultStr : '';
        //match
        var reg = new RegExp(key + '=(\\w*)');
        var str = url.match(reg);
        str = str ? str[1] : defaultStr;
        return str;
    }

    /*
    传参
    */
    function passParam(url) {
        //protocol
        url = url.replace(/(\w*\:)\/\//, utils.protocol+'//');
        if(url.indexOf('http') == -1){//协议头
            url = utils.protocol+ url;
        }
        //check
        var mc = ref.match(/\?(.+)$/);
        if (!mc) return url;

        //全部追加
        if (url.indexOf("?") == -1) return url + mc[0];

        var parms = (function(arr) {
            var ret = {};
            arr.forEach(function(item) {
                if (item.indexOf("=") == -1) return;
                item = item.replace(/=/, ",").split(",");
                ret[item[0]] = item[1];
            });
            return ret;
        })(mc[1].split("&"));

        for (key in parms) {
            var reg1 = new RegExp('[?|&]' + key + '=', 'i');
            //var reg2=new RegExp(p+'=([^&]*)');
            if (!reg1.test(url)) { //部分追加
                url = url + ("&" + key + "=" + parms[key]);
            } else { //替换参数

                /*
                url=url.replace(reg2,function(){
                   return arguments[0].replace(arguments[1],s[p]); 
                });
               */
            }
        }
        
        return url;
    }

    //main
    var utils = {
        // vars
        runtimeEnv: null,
        protocol: 'http:',
        ajaxSettings: $.ajaxSettings,
        //fun
        init: function() {
            var me = this;
            me.runtimeEnv = me.checkContainer();
            me.protocol = me.getProtocol();
        },
        checkContainer: function() {
            var me = this;
            var ua = window.navigator.userAgent.toLowerCase();
            var obj = {
                webCon: '', //jdapp|weixin|m
                system: '' //android|ipone|ipad
            };
            //webCon
            if (/jdapp/i.test(ua)) { //jdapp
                obj.webCon = 'jdapp';
                //version
                var versionArr = ua.split(';');
                var version = versionArr[2] ? versionArr[2] : '';
                var versionLarge = version.split('.');
                versionLarge = versionLarge[0] ? versionLarge[0] : '';
                //osVersion
                var osVersion = versionArr[3] ? versionArr[3] : '';
                //network
                var network = ua.match(/network\/(.+?);/);
                network = network ? network[1] : '';
                //jdapp obj
                obj.jdapp = {
                    version: version,
                    versionLarge: versionLarge,
                    osVersion: osVersion,
                    network: network
                }
            } else if (/MicroMessenger/i.test(ua)) { //微信
                obj.webCon = 'weixin';
            } else {
                obj.webCon = 'm';
            }
            //system
            if (/android/i.test(ua)) {
                obj.system = 'android';
            } else if (/iPhone/i.test(ua)) {
                obj.system = 'iphone';
            } else if (/ipad/.test(ua)) {
                obj.system = 'ipad';
            }
            //sid
            var sid = window.location.href.match(/sid=\w*/);
            obj.sid = sid ? sid[0].replace('sid=', '') : '';
            return obj;
        },
        //string
        stringStartsWith: function(str, matchStr) {
            return 0 === str.lastIndexOf(matchStr, 0);
        },
        //gets
        getProtocol: function() {
            var me = this;
            var url = window.location.href;
            var protocol = me.stringStartsWith(url, 'https') ? 'https' : 'http';
            protocol = protocol+':';
            return protocol;
        },
        // request data
        requestDevelop: function(options) {
            var me = this;
            me.ajaxSettings.type = "get";
            me.ajaxSettings.charset = 'utf8';
            me.ajaxSettings.dataType = 'jsonp';
            me.ajaxSettings.timeout = 1000 * 10;
            var success = options.success;
            var error = options.error;
            options.data = "body=" + JSON.stringify(options.data);
            options.success = function(data, status, xhr) {
                if (data.code == "0") {
                    success && success(data, status, xhr);
                } else if (data.code == '3') {
                    var url = location.pathname.indexof(".html") < 0 ? "" : location.href.match(/^(.+?\.html)/)[1];
                    location.href = "https://passport.m.jd.com/user/login.action?v=1&returnurl=" + encodeURIComponent(url);
                } else {
                    alert('网络跑累了，请稍候再来！');
                }
            }
            options.error = error || function() {
                alert('网络飞到外太空');
            }
            return $.ajax(options);
        },
        getNoParamURL: function() {
            var url = window.location.href;
            var resultURL = url.match(/.*\.html/);
            resultURL = resultURL ? resultURL[0] : url;
            return resultURL;
        },
        getPageUrl: function(type, options) {
            var me = this;
            var url;
            switch (type) {
                case "goodsDetail":
                    { //商详
                        if (me.runtimeEnv.webCon == 'jdapp') {
                            url = 'openApp.jdMobile://virtual?params={"category":"jump","des":"productDetail","skuId":"' + options.sku + '","sourceType":"h5","sourceValue":"double11_find"}';
                        } else {
                            url = 'http://item.m.jd.com/ware/view.action?wareId=' + options.sku + '&sid=' + me.runtimeEnv.sid;
                        }
                        break;
                    }
                case "newgoodshop":
                    { //店铺
                        if (me.runtimeEnv.webCon == 'jdapp') {
                            url = 'openApp.jdMobile://virtual?params={"category":"jump","des":"jshopMain","shopId":"' + options.shopId + '","sourceType":"h5" ,"sourceValue":"double11_find"}'
                        } else {
                            url = 'http://ok.jd.com/m/index-' + options.shopId + '.htm?sid=' + me.runtimeEnv.sid;
                        }
                        break;
                    };
                case "none":
                    url = 'javascript:void(0)';
                    break;
                default:
                    {
                        console.warn("page type not find:" + type);
                        url = 'javascript:void(0)';
                    }
            }

            return url;
        },
        goLogin: function() {
            var url = encodeURIComponent(window.location.href);
            var goUrl = "https://passport.m.jd.com/user/login.action?v=1&returnurl=" + url;
            window.location.href = goUrl;
        },
        getHeaderIphoneUrl: function(options) {
            var str = JSON.stringify(options);
            var url = 'openapp.jdmobile://communication?params=' + str;
            return url;
        },
        addTrackingBind: function() {
            try {
                MPing.inputs.Click.attachEvent();
            } catch (e) {}
        },
        getByteLen: function(str) {
            if (str == null) return 0;
            if (typeof str != "string") {
                str += "";
            }
            return str.replace(/[^\x00-\xff]/g, "01").length;
        },
        jumpLink: function(url, target) {
            var node = $('#J_jumpLink');
            //add
            if (node.length == 0) {
                node = $('<a>');
                node.attr('id', 'J_jumpLink')
                    .css('display', 'none');
                $('body').append(node);
            }
            var itemTarget = target ? target : '_self';
            node.attr({
                href: url,
                target: itemTarget
            });
            node.click();
        }
    };

    //init
    utils.init();
    utils.parseUrl = parseUrl;
    //return
    // return utils;



    //global
    if(!window.babelGlobal){
        window.babelGlobal = {};
    }
    var babelGlobal = window.babelGlobal;
    //OMD
    var moduleName = utils;
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = moduleName;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() { return moduleName; });
    } else {
        babelGlobal.utils = utils;
    }
})();