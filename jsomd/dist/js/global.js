;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./g_utils', './g_tracking'], factory);
  } else {
    root.babelGlobal.excStatus = factory(root.babelGlobal.utils, root.babelGlobal.tracking);
  }
}(this, function(G_utils, G_tracking) {
/**				 
 * 直接解析数据       directGetData(activityId,subCode)
 * @param  activityId       @type: string  
 * @description: 活动ID
 * @param  subCode          @type: string  
 * @description: subCode    1-1 活动未开始 || 1-2 活动过期 || 1 请求失败
 *  
 * 请求数据并解析     requestData(options)
 * @param  options    @type：object  @description: 请求数据的配置
 */

	var httpProtocol = G_utils.protocol;
	var excStatus = {
		activeExcData: [{
			subCode: '1-2', //活动已结束
			class: 'active_out_date',
			info: "呃，活动已结束或过期~"
		}, {
			subCode: '1-1', //活动未开始
			class: 'active_pre_start',
			info: "额，活动还没有开始哦~"
		}, {
			subCode: '1', //处理失败
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
			} // 如果页面过期调用过期页面埋点
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
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.babelGlobal.imglazyload = factory();
  }
}(this, function() {
//全局组件：图片懒加载
/*
    1.图片懒加载判断
    2.图片load，并淡入显示
 */

/*
ex code:

var img = new Image();
// 'load' event
$(img).on('load', function() {
    var num = new Date().getTime();
    var str = "image is loaded "+num+'</br>';
    $('body').append(str);
    console.log("image is loaded",num);
});
img.src = "http://eimg.smzdm.com/201602/02/56b003bbc49e33983.jpg";

var imageNodes = document.querySelectorAll('img[data-src]');

//tab切换后，触发滚动，以调用懒加载
$('a[data-toggle="tab"]').on('shown', function () {
    $(window).trigger('scroll');
});
 */

/*
 * 全局：图片懒加载
 * 自定义：每次重新取img，遍历检查
 * 可视化：先检查mod节点的位置，再遍历节点内img。
 *
 * 事件：scroll,touchmove
 *
 * tab切换时候，自动trigger scroll，来启动懒加载检查
 *
 * ①滑动、轮播组件时候：其内部图片自动加载、或者自动加载下个可视化区域内的图片。
 * 
 * ②：tb焦点图自动切换change时，自动加载下一张图
 *    滑动图：当前可视区域+下一个可视区域内的图片，自动加载。
 *
 *
 * https://github.com/kissygalleryteam/datalazyload/blob/master/2.0.1/src/index.js
 * fun: elementInViewport
 *      isCross
 *      
 * //TODO:
 * 整体：预加载一屏
 * 
 */


    
    function elementInViewport(elem, windowRegion, containerRegion) {
        var me = this;
        // if (!elem.width()) {
        //     return false;
        // }
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
            inContainer = me.isCross(containerRegion, elemRegion); // maybe the container has a scroll bar, so do this.
        }

        // 确保在容器内出现
        // 并且在视窗内也出现
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

        //预读
        // var diff = this.get('diff'),
        //     diffX = diff === DEFAULT ? vw : diff,
        //     diffX0 = 0,
        //     diffX1 = diffX,
        //     diffY = diff === DEFAULT ? vh : diff,
        // // 兼容，默认只向下预读
        //     diffY0 = 0,
        //     diffY1 = diffY,
        right = left + vw,
        bottom = top + vh;

        // if (S.isObject(diff)) {
        //     diffX0 = diff.left || 0;
        //     diffX1 = diff.right || 0;
        //     diffY0 = diff.top || 0;
        //     diffY1 = diff.bottom || 0;
        // }

        // left -= diffX0;
        // right += diffX1;
        // top -= diffY0;
        // bottom += diffY1;

        return {
            left: left,
            top: top,
            right: right,
            bottom: bottom
        };
    }



    //struct
    /*
     * init: 初始调用，默认添加img[data-src]元素，绑定事件
     *       设置标志位，防止重复调用
     * check: 检查，推荐使用$(window).trigger('scroll')来触发懒加载
     * 
     * type区分：默认、opt类型
     *     默认：每次check，整体取一遍img[data-src]元素，再次判断
     *     opt类型：自主添加元素，加载后的元素移除即可
     *     
     * 
     * 尽量简化调用等
     * 
     */
    var imglazyload = {
        id: -1,
        initSign: false,
        init: function(){
            var me = this;
            //bindEvent
            me.bindHandler();
        },
        addElement: function(){
            var me = this;
        },
        check: function() {
            var me = this;
            var tmp = false;
            var windowRegion = getBoundingRect();
            //
            var items = $('img[data-src]');
            items = items.filter(':visible');
            $.each(items, function(index, item) {
                item = $(item);
                tmp = elementInViewport(item, windowRegion);
                if(tmp){
                    me.loadImg(item);    
                }
            });
            //init
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

    //init
    // imglazyload.init();

    //return
    return imglazyload;
}));
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.babelGlobal.tracking = factory();
  }
}(this, function() {
/**
 * 全局埋点代码 自定义开发者模式和可视化模式下使用
 * @param eventId   埋点event_id
 * @param eventParam    埋点event_param
 * @param pageName   埋点page_name
 * @param pageParam    埋点page_param

 * @全局js埋点总共5个方法 
 * @globalPvTracking:0个参数，pv上报 需要pageId作为参数上传
   @globalLabelTracking:3个参数(eventId、Id、Node),只会给具有“J_ping”class名的a标签埋点，
                        第三个参数没有的情况下表示body下a标签,
                        第三个参数可以传递具体节点 $("xxx")，表示该节点下a标签
   @globalSlideTracking:1个参数(activityId),页面滑动到具体位置埋点
   @globalOverdueTracking:1个参数(activityId),给过期页面埋点
   @globalSimulationClick:3个参数(eventId,eventParam,pageId),可视化下模块埋点
 */

	var trackings = {
		//全局变量
		winH: $(window).height(),
		scrollPage: [-1, -1, -1],
		init: function() {
			var me = this;
			//me.globalPvTracking();
		},
		_clickTracking: function(eventId, eventParam, pageName, pageParam,eventLevel) {
			var eventId = eventId || "";
			var eventParam = eventParam || "";
			var pageName = pageName || "";
			var pageParam = pageParam || "";
			var eventLevel = eventLevel || "";
			var click = new MPing.inputs.Click(eventId); // 设置click的参数,可以设置其他参数
			click.event_param = eventParam;
			click.page_name = pageName;
			click.page_param = pageParam;
			click.event_level = eventLevel;
			click.updateEventSeries(); //更新事件串
			var mping = new MPing(); //构造上报实例
			mping.send(click); //上报click
		},
		//全局pv上报埋点js方法
		globalPvTracking: function(pageId) {
			var me = this;
			var url = window.location.href;
			var strs = [];
			strs = url.split("?");
			var pageName = strs[0] || "";
			var pageParam = pageId;
			var pv = new MPing.inputs.PV(); //构造pv请求
			pv.page_name = pageName;
			pv.page_param = pageParam; //设置pv参数
			var mping = new MPing(); //构造上报实例
			mping.send(pv);
		},
		//自定义开发者模式下
		//通天塔-活动页面
		globalLabelTracking: function(eventId, id, node,eventLevel) {
			var Node = node || $("body");
			if (Node.find(".J_ping").length == 0) return;
			if (!eventId) return;
			var eventId = eventId || ""; //事件ID
			var page_param = id || ""; //页面参数
			var url = window.location.href.match(/^(.+?\.html)/)[1] || ""; //去参url
			var page_name = (document.title || "title") + "_" + url; //页面名称
			var arrs = Node.find(".J_ping");
			for (var i = 0, len = arrs.length; i < len; i++) {
				var checkUrl = arrs.eq(i).attr("href").match(/^(.+?\.html)/);
				var a_url = (checkUrl === null ? "url" : checkUrl[1]); //a标签里的href
				var dateId = arrs.eq(i).attr("report-dateid") || "ID";
				var event_param = dateId + "_" + a_url; //事件参数
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
				var eventId = eventId || ""; //事件id
				var eventParam = eventParam || ""; //事件参数
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
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.babelGlobal.utils = factory();
  }
}(this, function() {
//工具函数
/* ex:
 * 京东app-ios的ua: 
 * jdapp;iPhone;4.4.5;9.2.1;ccbe311b0252691b37b1c95aec42476e4c2435f2;network/wifi;ADID/426DEAAC-B01F-4643-9FEF-8F0B31818BFF;pv/100.2;utr/;ref/;psq/0;psn/ccbe311b0252691b37b1c95aec42476e4c2435f2|100;usc/;umd/;pap/JA2015_311210|4.4.5|IOS 9.2.1;ucp/;Mozilla/5.0 (iPhone; CPU iPhone OS 9_2_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13D15
 *
 * 京东app-android的ua: 
 * jdapp;android;4.3.0;4.2.1;863525024459051-6c5f1c1f1e24;network/wifi;pv/3376.12.1358900874425;Mozilla/5.0 (Linux; U; Android 4.2.1; zh-cn; Lenovo A670t Build/JOP40D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30
 */


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
    return utils;
}));