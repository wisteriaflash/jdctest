;(function(root, factory) {
    root.babelGlobal.utils = factory();
}(this, function() {
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

    function parseUrl(url, options) {
        var u = url.split(","),
            type = u[0],
            id = u[1];
        if (type == "1") { 
            url = id;
            if (/sale.jd.com\//.test(id)) {
                if (isapp) url = url.replace(/\/m\//, "/app/");
                else url = url.replace(/\/app\//, "/m/");
                url = passParam(url);
            } else if (url.indexOf("has_native=1") > -1) { 
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
        } else if (type == "2") { 
            if (isapp) {
                url = stringFormat('openApp.jdMobile://virtual?params={"category":"jump","des":"productDetail","skuId":"{0}","sourceType":"h5","sourceValue":"{1}"}', id, id);
            } else {
                url = passParam("http://item.m.jd.com/ware/view.action?wareId=" + id);
            }
        } else if (type == "3") { 
            if (isapp) {
                url = stringFormat('openApp.jdMobile://virtual?params={"category":"jump","des":"jshopMain","shopId":"{0}","sourceType":"h5" ,"sourceValue":"double11_find"}', id);
            } else {
                url = passParam('http://ok.jd.com/m/index-' + id + '.html');
            }
        } else if (type == "4") { 
            if (isapp) {
                url = stringFormat('openApp.jdMobile://virtual?params={"category":"jump","des":"productList","sourceType":"sourceType_test" ,"sourceValue":"sourceValue_test", "from":"search", "keyWord": "{0}"}', id);
            } else {
                url = passParam('http://m.jd.com/ware/search.action?keyword=' + id);
            }
        } else if (type == "4-1") { 
            if (isapp) {
                url = stringFormat('openApp.jdMobile://virtual?params={"category":"jump","des":"productList","sourceType":"sourceType_test" ,"sourceValue":"sourceValue_test", "from":"category", "cid": "{0}", "levelFirst": "{1}", "levelSecond": "{2}"}', options.cid, options.levelFirst, options.levelSecond);
            } else {
                url = passParam('http://m.jd.com/products/'+options.levelFirst+'-'+options.levelSecond+'-'+options.cid+'.html');
            }
        } else if (type == "5") { 
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
        var reg = new RegExp(key + '=(\\w*)');
        var str = url.match(reg);
        str = str ? str[1] : defaultStr;
        return str;
    }

    function passParam(url) {
        url = url.replace(/(\w*\:)\/\//, utils.protocol+'//');
        if(url.indexOf('http') == -1){
            url = utils.protocol+ url;
        }
        var mc = ref.match(/\?(.+)$/);
        if (!mc) return url;

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
            if (!reg1.test(url)) { 
                url = url + ("&" + key + "=" + parms[key]);
            } else { 

            }
        }

                return url;
    }


    var utils = {
        runtimeEnv: null,
        protocol: 'http:',
        ajaxSettings: $.ajaxSettings,
        init: function() {
            var me = this;
            me.runtimeEnv = me.checkContainer();
            me.protocol = me.getProtocol();
        },
        checkContainer: function() {
            var me = this;
            var ua = window.navigator.userAgent.toLowerCase();
            var obj = {
                webCon: '', 
                system: '' 
            };
            if (/jdapp/i.test(ua)) { 
                obj.webCon = 'jdapp';
                var versionArr = ua.split(';');
                var version = versionArr[2] ? versionArr[2] : '';
                var versionLarge = version.split('.');
                versionLarge = versionLarge[0] ? versionLarge[0] : '';
                var osVersion = versionArr[3] ? versionArr[3] : '';
                var network = ua.match(/network\/(.+?);/);
                network = network ? network[1] : '';
                obj.jdapp = {
                    version: version,
                    versionLarge: versionLarge,
                    osVersion: osVersion,
                    network: network
                }
            } else if (/MicroMessenger/i.test(ua)) { 
                obj.webCon = 'weixin';
            } else {
                obj.webCon = 'm';
            }
            if (/android/i.test(ua)) {
                obj.system = 'android';
            } else if (/iPhone/i.test(ua)) {
                obj.system = 'iphone';
            } else if (/ipad/.test(ua)) {
                obj.system = 'ipad';
            }
            var sid = window.location.href.match(/sid=\w*/);
            obj.sid = sid ? sid[0].replace('sid=', '') : '';
            return obj;
        },
        stringStartsWith: function(str, matchStr) {
            return 0 === str.lastIndexOf(matchStr, 0);
        },
        getProtocol: function() {
            var me = this;
            var url = window.location.href;
            var protocol = me.stringStartsWith(url, 'https') ? 'https' : 'http';
            protocol = protocol+':';
            return protocol;
        },
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
                    location.href = "https://passport.m.jd.com/user/login.action?returnurl=" + encodeURIComponent(url);
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
                    { 
                        if (me.runtimeEnv.webCon == 'jdapp') {
                            url = 'openApp.jdMobile://virtual?params={"category":"jump","des":"productDetail","skuId":"' + options.sku + '","sourceType":"h5","sourceValue":"double11_find"}';
                        } else {
                            url = 'http://item.m.jd.com/ware/view.action?wareId=' + options.sku + '&sid=' + me.runtimeEnv.sid;
                        }
                        break;
                    }
                case "newgoodshop":
                    { 
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
            var goUrl = "https://passport.m.jd.com/user/login.action?returnurl=" + url;
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

    utils.init();
    utils.parseUrl = parseUrl;
    return utils;
}));
;(function(root, factory) {
    root.babelGlobal.tracking = factory(root.MPing);
}(this, function(MPing) {
	var trackings = {
		winH: $(window).height(),
		scrollPage: [-1, -1, -1],
		init: function() {
			var me = this;
		},
		_clickTracking: function(eventId, eventParam, pageName, pageParam,eventLevel) {
			var eventId = eventId || "";
			var eventParam = eventParam || "";
			var pageName = pageName || "";
			var pageParam = pageParam || "";
			var eventLevel = eventLevel || "";
			var click = new MPing.inputs.Click(eventId); 
			click.event_param = eventParam;
			click.page_name = pageName;
			click.page_param = pageParam;
			click.event_level = eventLevel;
			click.updateEventSeries(); 
			var mping = new MPing(); 
			mping.send(click); 
		},
		globalPvTracking: function(pageId) {
			var me = this;
			var url = window.location.href;
			var strs = [];
			strs = url.split("?");
			var pageName = strs[0] || "";
			var pageParam = pageId;
			var pv = new MPing.inputs.PV(); 
			pv.page_name = pageName;
			pv.page_param = pageParam; 
			var mping = new MPing(); 
			mping.send(pv);
		},
		globalLabelTracking: function(eventId, id, node,eventLevel) {
			var Node = node || $("body");
			if (Node.find(".J_ping").length == 0) return;
			if (!eventId) return;
			var eventId = eventId || ""; 
			var page_param = id || ""; 
			var url = window.location.href.match(/^(.+?\.html)/)[1] || ""; 
			var page_name = (document.title || "title") + "_" + url; 
			var arrs = Node.find(".J_ping");
			for (var i = 0, len = arrs.length; i < len; i++) {
				var checkUrl = arrs.eq(i).attr("href").match(/^(.+?\.html)/);
				var a_url = (checkUrl === null ? "url" : checkUrl[1]); 
				var dateId = arrs.eq(i).attr("report-dateid") || "ID";
				var event_param = dateId + "_" + a_url; 
				var eventLevel = eventLevel || "";
				arrs.eq(i).attr("report-eventid", eventId);
				arrs.eq(i).attr("report-eventparam", event_param);
				arrs.eq(i).attr("report-pagename", page_name);
				arrs.eq(i).attr("report-pageparam", page_param);
				arrs.eq(i).attr("report-eventlevel", event_level);
			}
			try {
				MPing.inputs.Click.attachEvent();
			} catch (e) {}
		},
		globalSlideTracking: function(activityId,eventLevel) {
			var me = this;
			var startY, Y;
			var issend = false;
			var eventId = "";
			$(window).on("touchstart", function(e) {
				if (!e.touches.length) return;
				var touch = e.touches[0];
				startY = touch.pageY;
			});
			$(window).on("touchmove", function(e) {
				if (!e.touches.length) return;
				var touch = e.touches[0];
				Y = touch.pageY - startY;
			});
			$(window).on('touchend', function(e) {
				if (Math.abs(Y) > 0) {
					if ($(window).scrollTop() >= (me.winH) && $(window).scrollTop() < (2 * me.winH)&& me.scrollPage[0] < 0)  {
						eventId = "Babel_Screen2";
						issend = true;
						me.scrollPage[0]++;
					} else if ($(window).scrollTop() >= (5 * me.winH) && $(window).scrollTop() < (6 * me.winH)&& me.scrollPage[1] < 0)  {
						eventId = "Babel_Screen6";
						issend = true;
						me.scrollPage[1]++;
					} else if ($(window).scrollTop() >= (9 * me.winH) && $(window).scrollTop() < (10 * me.winH)&& me.scrollPage[2] < 0 ) {
						eventId = "Babel_Screen10";
						issend = true;
						me.scrollPage[2]++;
					}
				}
				if (issend) {
					try {
						var url = window.location.href.match(/^(.+?\.html)/)[1] || "";
						var eventParam = activityId || "";
						var pageName = url;
						var pageParam = "";
						var eventLevel = eventLevel || "";
						me._clickTracking(eventId, eventParam, pageName, pageParam,eventLevel);
						issend = false;
					} catch (e) {}
				}
			});
		},
		globalOverdueTracking: function(activityId,eventLevel) {
			var me = this;
			try {
				var eventId = "Babel_OutOfTime";
				var url = window.location.href.match(/^(.+?\.html)/)[1] || "";
				var eventParam = activityId || "";
				var pageName = url;
				var pageParam = pageParam || "";
				var eventLevel = eventLevel || "";
				me._clickTracking(eventId, eventParam, pageName, pageParam,eventLevel);
			} catch (e) {}
		},
		globalSimulationClick: function(eventId, eventParam, pageId,eventLevel) {
			var me = this;
			try {
				var eventId = eventId || ""; 
				var eventParam = eventParam || ""; 
				var url = window.location.href.match(/^(.+?\.html)/)[1] || "";
				var pageName = url;
				var pageParam = pageId || "";
				var eventLevel = eventLevel || "";
				me._clickTracking(eventId, eventParam, pageName, pageParam,eventLevel);
			} catch (e) {}
		}
	};
	trackings.init();
	return trackings;
}));
;(function(root, factory) {
    root.babelGlobal.imglazyload = factory();
}(this, function() {
    function elementInViewport(elem, windowRegion, containerRegion) {
        var me = this;
        var elemOffset = elem.offset(),
            inContainer = true,
            inWin,
            left = elemOffset.left,
            top = elemOffset.top,
            elemRegion = {
                left: left,
                top: top,
                right: left + $(elem).width(),
                bottom: top + $(elem).height()
            };
        inWin = isCross(windowRegion, elemRegion);

        if (inWin && containerRegion) {
            inContainer = me.isCross(containerRegion, elemRegion); 
        }

        return inContainer && inWin;
    }

    function isCross(r1, r2) {
        var r = {};
        r.top = Math.max(r1.top, r2.top);
        r.bottom = Math.min(r1.bottom, r2.bottom);
        r.left = Math.max(r1.left, r2.left);
        r.right = Math.min(r1.right, r2.right);
        return r.bottom >= r.top && r.right >= r.left;
    }

    function getBoundingRect(elem) {
        var vh, vw, left, top;
        if (elem !== undefined) {
            vh = elem.height();
            vw = elem.width();
            var offset = elem.offset();
            left = offset.left;
            top = offset.top;
        } else {
            var win = $(window);
            vh = win.height()
            vw = win.width();
            left = win.scrollLeft();
            top = win.scrollTop();
        }

        right = left + vw,
        bottom = top + vh;

        return {
            left: left,
            top: top,
            right: right,
            bottom: bottom
        };
    }



    var imglazyload = {
        id: -1,
        initSign: false,
        init: function(){
            var me = this;
            me.bindHandler();
        },
        addElement: function(){
            var me = this;
        },
        check: function() {
            var me = this;
            var tmp = false;
            var windowRegion = getBoundingRect();
            var items = $('img[data-src]');
            items = items.filter(':visible');
            $.each(items, function(index, item) {
                item = $(item);
                tmp = elementInViewport(item, windowRegion);
                if(tmp){
                    me.loadImg(item);    
                }
            });
            if(!me.initSign){
                me.initSign = true;
                me.init();
            }
        },
        loadImg: function(node) {
            var url = node.attr('data-src');
            if(url.length == 0){
                return;
            }
            var callback = node.data('callback');
            var img = new Image();
            $(img).on('load', function(e) {
                node.attr('data-src','');
                node.attr('src', $(this).attr('src'));
                node.addClass('fadein');
                callback && callback.success && callback.success(node)
            });
            $(img).on('error', function(e) {
               callback && callback.error && callback.error(node)
            });
            img.src = node.attr('data-src');
        },
        bindHandler: function(){
            var me = this;
            $(window).on('scroll touchmove', function(e){
                clearTimeout(me.id);
                me.id = setTimeout(function(){
                    me.check();
                }, 100);
            });
        }
    }

    return imglazyload;
}));
;(function(root, factory) {
    root.babelComponent.toast = factory();
}(this, function() {
    var name = 'toast';
    var optStr = name + 'Opt';
    var instanceStr = name + 'Instance';

    var Toast = function(item, options) {
        this.element = item;
        this._init(options);
    };

    Toast.prototype = {
        version:'1.0.0',
        playID: -1,
        node:   '',
        _init: function(options) {
            var self = this;
            var item = this.element;
            var settings = this._getSettings(item);
            var merageSettings = settings ? settings : $.fn.toast.defaults;
            settings = $.extend({}, merageSettings, options);
            var domConfig = self._initDomConfig();
            settings = $.extend({}, settings, domConfig);
            self._setSettings(item, settings);
            self._renderHandler();
        },
        _initDomConfig: function() {
            var self = this;
            var item = this.element;
            var domConfig = {};
            var dataValue;
            for (var i in $.fn.toast.defaults) {
                dataValue = item.attr('data-' + i);
                if(dataValue) {
                    domConfig[i] = dataValue;
                }
            }
            return domConfig;
        },
        _renderHandler: function() {
            var self = this;
            var item = this.element;
            if($('#J_toast').length > 0) {
                self.node = $('.jdui_toast');
                return;
            }
            var settings = self._getSettings(item);

            var html =  '<div id="J_toast" class="jdui_toast animated fadeIn">' +
                        '<span class="jdui_icon"></span>' +
                        '<div class="jdui_text"></div>' +
                        '</div>';
            self.node = $(html);
            self.node.addClass(settings.conCls);
            self.node.find('.jdui_text').html(settings.content);
            if (settings.iconCls) {
                self.node.find('.jdui_icon').addClass(settings.iconCls);
            } else {
                self.node.find('.jdui_icon').attr('class', 'jdui_icon');
            }
            $('body').append(self.node);
        },
        _getSettings: function(item) {
            return item.data(optStr);
        },
        _setSettings: function(item, options) {
            item.data(optStr, options);
        },
        show: function(options) {
            var self = this;
            var item = this.element;
            var settings = self._getSettings(item);
            if(options) {
                settings = $.extend({}, settings, options);
            }
            self._setSettings(item, settings);
            self.node.attr('class', 'jdui_toast animated fadeIn');  
            self.node.addClass(settings.conCls);
            self.node.find('.jdui_text').html(settings.content);
            self.node.find('.jdui_icon').attr('class', 'jdui_icon');    
            if (settings.iconCls) {
                self.node.find('.jdui_icon').addClass(settings.iconCls);
            }
            if (self.node.css('display') !== 'none') {
                return;
            } else {
                self.node.css({
                   'display' : 'inline-block'
                });
                setTimeout(function() {
                    self.node.css({
                        'opacity': 1,
                        '-webkit-transform': 'translate3d(-50%, -30px, 0)',
                        'transform': 'translate3d(-50%, -30px, 0)'
                    });
                }, 50);
            }

            clearTimeout(self.playID);
            self.playID = setTimeout(function() {
                self.node.css({
                    'opacity': 0,
                    '-webkit-transform': 'translate3d(-50%, 0, 0)',
                    'transform': 'translate3d(-50%, 0, 0)'
                });
                setTimeout(function() {
                    self.node.css({
                        'display' : 'none'
                    });
                }, 50);
            }, settings.showTime);
        },
        hide: function() {
            var self = this;
            clearTimeout(self.playID);
            setTimeout(function(){
                self.node.css({
                    'opacity': 0,
                    '-webkit-transform': 'translate3d(-50%, 0, 0)',
                    'transform': 'translate3d(-50%, 0, 0)'
                });
                setTimeout(function() {
                    self.node.css({
                        'display' : 'none'
                    });
                }, 50);
            }, 300);
        }
    };

    var methods = {
        init: function(options) {
            this.each(function() {
                var $this = $(this);
                if (!$this.data(instanceStr)) {
                    $this.data(instanceStr, new Toast($this, options));
                }
            });
        },
        instance: function() {
            var arr = [];
            this.each(function() {
                arr.push($(this).data(instanceStr));
            });
            return arr;
        },
        show: function(config) {
            var $this = $(this);
            var instance = $this.data(instanceStr);
            if(instance) {
                instance.show(config);
            }
        },
        hide: function() {
            var $this = $(this);
            var instance = $this.data(instanceStr);
            if(instance){
                instance.hide();
            }
        }
    };

    $.fn.toast = function(){
        var method = arguments[0];
        if (methods[method]) {
            if (!this.data(instanceStr)) {
                console.error('please init toast first');
                return;
            }
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) === 'object' || !method) {
            method = methods.init;
        } else {
            console.error('Method ' + method + ' does not exist on zepto.tab');
            return this;
        }
        return method.apply(this, arguments);
    };

    $.fn.toast.defaults = {
        content:    '提示信息',
        conCls:     '',
        iconCls:    '',
        showTime:   2000
    };

    return Toast;

}));
;(function(root, factory) {
    root.babelGlobal.excStatus = factory(root.babelGlobal.utils, root.babelGlobal.tracking, root.babelComponent.toast);
}(this, function(G_utils, G_tracking, toast) {
	var httpProtocol = G_utils.protocol;
	var excStatus = {
		activeExcData: [{
			subCode: '1-2', 
			class: 'active_out_date',
			info: "呃，活动已结束或过期~"
		}, {
			subCode: '1-1', 
			class: 'active_pre_start',
			info: "额，活动还没有开始哦~"
		}, {
			subCode: '1', 
			class: 'active_request_fail',
			info: "刷新页面"
		}],
		_init: function() {
			$("body").toast();
		},
		_bindHandle: function() {
			var me = this;
			var freshObj = $(".active_request_fail .fail_note");
			if (freshObj.length) {
				freshObj.on("click", function() {
					window.location.href = location.href;
				})
			}
		},
		directGetData: function(activityId, subCode) {
			var me = excStatus;
			me._goExceptionUi({
				activityId: activityId,
				subCode: subCode
			});
		},
		requestData: function(requestCon) {
			var me = excStatus;
			var options = $.extend({}, {
				url: httpProtocol + "//ngw.m.jd.com/client.action?functionId=babelActivityGetShareInfo&client=wh5&clientVersion=1.0.0",
				data: {
					activityId: "",
					pageId: ""
				},
				success: me._goExceptionUi,
				error: me._error
			}, requestCon);
			G_utils.requestDevelop(options);
		},
		_goExceptionUi: function(data) {
			var me = excStatus;
			if (data.subCode !== '0' && data.subCode !== undefined) {
				var len = $.trim(data.subCode).length;
				var firstLetter = data.subCode.substring(0, 1);
				var lastLetter = data.subCode.substring(len - 1, len);

				if (firstLetter === '1' && (len === 1 || (len === 3 && (lastLetter === '1' || lastLetter === '2')))) {
					me._operateExc(data)
				} else {
					$("body").toast('show', {
						content: '网络跑累了，请稍候再来！'
					});
				}
			} else if (data.subCode === undefined) {
				$("body").toast('show', {
					content: '网络跑累了，请稍候再来！'
				});
			}
		},
		_operateExc: function(data) {
			var me = excStatus;
			var info, curClass;
			me.activeExcData.forEach(function(item) {
				if (item.subCode === data.subCode) {
					info = item.info;
					curClass = item.class;
				}
			});

			var activeWrap = $('<div class="page_fail_wrap"></div>');
			var failinfo = $('<div class="fail_show ' + curClass + '"><span></span><a class="fail_note">' + info + '</a></div>')
			activeWrap.append(failinfo);
			activeWrap.appendTo($('body'));
			$("body").addClass('page_fail');
			me._bindHandle();
			if (data.subCode === '1-2') {
				G_tracking.globalOverdueTracking(data.activityId);
			} 
		},
		_error: function() {
			var me = excStatus;
			$("body").toast('show', {
				content: '网络飞到外太空！'
			});
		},
	}
	excStatus._init();
	return {
		directGetData: excStatus.directGetData,
		requestData: excStatus.requestData
	};
}));
;(function(root, factory) {
    root.babelGlobal.share = factory(root.babelGlobal.utils, root.babelComponent.toast);
}(this, function(G_utils, toast) {
	var system = G_utils.runtimeEnv.system;
	var platform = G_utils.runtimeEnv.webCon; 
	var httpProtocol = G_utils.protocol;

	var share = {
		configData: null, 
		configOption: {}, 
		_init: function() {
			$("body").toast();
		},
		_judgeEmptyObj: function(obj) { 
			var me = share;
			var hasProp = false;
			if (typeof obj === "object" && !(obj instanceof Array)) {
				for (var prop in obj) {
					hasProp = true;
					break;
				}
				return hasProp; 
			}
		},
		_success: function(data) {
			var me = share;
			if (platform === 'jdapp') {
				me._setJdAppShare();
			} else if (platform === 'weixin') {
				me._setWxShare();
			}
		},
		_error: function() {
			var me = share;
			$("body").toast('show', {
				content: '网络飞到外太空！'
			})
		}, 
		_operateData: function(data) {
			var me = share;
			me._dataMerge(data);
			if (data.subCode === '0') {
				me._success(data);
			} else {
				$("body").toast('show', {
					content: '网络跑累了，请稍候再来！'
				});

			}
		},
		_dataMerge: function(data) {
			var me = share;
			me.configData = $.extend({}, me.configData, data);
			return me;
		},
		_setShareConfig: function(configs) {
			var me = this;
			var defaultConfig = $.extend({}, {
				sharingTitle: 'test title',
				sharingImgFile: '//m.360buyimg.com/babel/jfs/t2146/59/1639581949/6519/6f836d0b/56ceb5baN90d3de13.png',
				sharingIntro: "test content",
				sharingUrl: location.href.match(/^(.+?\.html)/)[1],
				imgW: '240',
				imgH: '240'
			}, configs);;

			if (platform === 'weixin') {
				me.configOption = {
					img_url: defaultConfig.sharingImgFile,
					img_width: defaultConfig.imgW,
					img_height: defaultConfig.imgH,
					link: defaultConfig.sharingUrl,
					desc: defaultConfig.sharingIntro,
					title: defaultConfig.sharingTitle
				}
			} 
			else if (platform === 'jdapp') {
				me.configOption = {
					title: defaultConfig.sharingTitle,
					description: defaultConfig.sharingIntro,
					url: defaultConfig.sharingUrl,
					img: defaultConfig.sharingImgFile,
					channel: 'Wxfriends',
					needCallBack: true
				}
			}
		}, 
		_needCallBack: function(funCallback) {
			var callSwitch;
			if (typeof window.jdappShareRes === 'function' && typeof funCallback === "boolean") {
				callSwitch = funCallback;
			} else if (typeof window.jdappShareRes === 'function' && typeof funCallback !== "boolean") {
				callSwitch = me.configOption.needCallBack;
			} else {
				callSwitch = false;
			}
			return callSwitch;
		},
		_setJdAppShare: function(funCallback) {
			var me = this;
			var link;
			var callSwitch = me._needCallBack(funCallback);
			var iosCallBack = callSwitch ? "Y" : "N";

			var configOption = {
				title: me.configData.sharingTitle,
				description: me.configData.sharingIntro,
				url: me.configData.sharingUrl,
				img: me.configData.sharingImgFile,
				needCallBack: false
			}
			me.configOption = $.extend({}, me.configOption, configOption);

			me.configOption.url = encodeURIComponent(me.configOption.url);
			me.configOption.img = encodeURIComponent(me.configOption.img);


			if (platform === 'jdapp') { 
				if (system === 'iphone') {
					var shareMap = {
						Wxfriends: "WeChat_Friend",
						Wxmoments: "WeChat_FriendTimeline",
						Sinaweibo: "Weibo",
						QQfriends: "QQFriend_SHARE_CLIENT",
						QQzone: "QQZone_SHARE_CLIENT",
						Moreshare: ""
					}
					me.configOption.channel = shareMap[me.configOption.channel];
					link = 'openapp.jdmobile://communication?params={' +
						'"action":"syncShareData",' +
						'"title":"' + me.configOption.title + '",' +
						'"content":"' + me.configOption.description + '",' +
						'"shareUrl":"' + me.configOption.url + '",' +
						'"iconUrl":"' + me.configOption.img + '",' +
						'"isCallBack":"' + iosCallBack + '"' +
						'}';
					location.href = link;
				} else if (system === 'android') {
					var configOption = {
						title: me.configOption.title,
						desc: me.configOption.description,
						url: decodeURIComponent(me.configOption.url),
						imgUrl: decodeURIComponent(me.configOption.img),
						callback: iosCallBack
					};
					if (typeof window.shareHelper.setShareInfoCallback === 'function') {
						if (callSwitch) { 
							try {
								shareHelper.setShareInfoCallback(
									configOption.title,
									configOption.desc,
									configOption.url,
									configOption.imgUrl,
									configOption.callback
								)
							} catch (e) {
								shareHelper.setShareInfoCallback(
									configOption.title,
									configOption.desc,
									configOption.url,
									configOption.imgUrl
								)
							}
						} else if (typeof window.shareHelper.setShareInfo === 'function') {
							window.shareHelper.setShareInfo(
								configOption.title,
								configOption.desc,
								configOption.url,
								configOption.imgUrl
							)
						}
					} else if (typeof window.shareHelper.setShareInfo === 'function') {
						shareHelper.setShareInfo(
							configOption.title,
							configOption.desc,
							configOption.url,
							configOption.imgUrl)
					}
				}
			}
		},
		_setWxShare: function() {
			var me = share;
			if (typeof WeixinJSBridge === 'undefined') {
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', me._wxShare, false);
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', me._wxShare);
					document.attachEvent('onWeixinJSBridgeReady', me._wxShare);
				}
			} else {
				me._wxShare();
			}
		}, 
		_wxShare: function() {
			var me = share;
			var configOption = {
				img_url: me.configData.sharingImgFile,
				img_width: "240",
				img_height: "240",
				link: location.href.match(/^(.+?\.html)/)[1],
				desc: me.configData.sharingIntro,
				title: me.configData.sharingTitle
			}

			me.configOption = $.extend({}, me.configOption, configOption);

			WeixinJSBridge.on("menu:share:appmessage", function(b) {
				WeixinJSBridge.invoke("sendAppMessage", me.configOption, function(g) {})
			}); 
			WeixinJSBridge.on("menu:share:timeline", function(b) {
				WeixinJSBridge.invoke("shareTimeline", me.configOption, function(g) {})
			}); 
		}, 
		directAnalysisData: function(data, configs) {
			var me = share;
			me._setShareConfig(configs);
			me._dataMerge(data);
			me._success(data);
		}, 
		requestData: function(options, configs) {
			var me = share;
			me._setShareConfig(configs);
			var option = $.extend({}, {
				url: httpProtocol+"//ngw.m.jd.com/client.action?functionId=babelActivityGetShareInfo&client=wh5&clientVersion=1.0.0",
				data: {
					activityId: "",
					pageId: ""
				},
				success: me._operateData,
				error: me._error
			}, options);
			G_utils.requestDevelop(option);
		}
	}
	share._init();
	return {
		directAnalysisData: share.directAnalysisData,
		requestData: share.requestData
	};
}));
;(function(root, factory) {
    root.babelGlobal.header = factory(root.babelGlobal.utils);
}(this, function(G_utils) {
    var header = {
        init: function(config) {
            var me = this;
            me.config = config;
        },
        checkShow: function(option) {
            var me = this;
            var runtimeEnv = G_utils.runtimeEnv;
            var url = window.location.href;
            if (runtimeEnv.webCon != 'jdapp') {
                if(url.match('&showhead=no')){
                    return
                }
                me.loadHeaderM(option)
                $('.bab_opt_header').removeClass('hide');
            } else if (runtimeEnv.webCon == 'jdapp') { 
                option ? me.jdappHeader(option) : -1;
            }
        },
        loadHeaderM: function(option) {
            var commonHeader = '//st.360buyimg.com/common/commonH_B/js/m_common_header_bottom2.1.js';
            var common = '//st.360buyimg.com/common/commonH_B/js/m_common2.1.js';

            require([commonHeader], function() {
                var mchb = new MCommonHeaderBottom();
                var title = '京东';
                if(option && option.name){
                    title = option.name;
                }
                var headerArg = {
                    hrederId: 'm_common_header',
                    title: title,
                    isShowShortCut: false,
                    selectedShortCut: '4'
                };
                mchb.header(headerArg);
            });

            require([common], function() {});
        },
        jdappHeader: function(option) {
            var me = this;
            var runtimeEnv = G_utils.runtimeEnv;
            var jdappV5 = runtimeEnv.jdapp ? runtimeEnv.jdapp.versionLarge : '';
            jdappV5 = jdappV5 ? jdappV5>=5 : false;
            if(!jdappV5){
                return;
            }
            var imgUrl = option.imgUrl;
            imgUrl = imgUrl.indexOf('http')==-1 ? G_utils.protocol+imgUrl : imgUrl;
            if (runtimeEnv.system == 'android') {
                var titleConf = {
                    isShow: 'N'
                }
                if (imgUrl && imgUrl.length > 0) {
                    titleConf = {
                        isShow: 'Y',
                        imageUrl: imgUrl
                    }
                }
                var cartArr = ['N', 'Y'];
                var cartConf = {
                    isShow: cartArr[option.cartButton]
                }
                    AndroidNavi.setTitle(JSON.stringify(titleConf));
                    AndroidNavi.setCart(JSON.stringify(cartConf));
            } else if (runtimeEnv.system == 'iphone') {
                var titleConf = {
                    action: 'sh_hideImgTitle'
                }
                if (imgUrl && imgUrl.length > 0) {
                    titleConf = {
                        action: 'sh_showImgTitle',
                        imageUrl: imgUrl
                    }
                }
                    G_utils.jumpLink(G_utils.getHeaderIphoneUrl(titleConf));
                var cartArr = ['sh_hideCart','sh_showCart'];
                var cartConf = {
                    action: cartArr[option.cartButton]
                }
                setTimeout(function(e){
                    G_utils.jumpLink(G_utils.getHeaderIphoneUrl(cartConf));
                }, 100);

                            }
        }
    }

    header.init();

    return header;
}));