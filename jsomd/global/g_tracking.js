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
define('./global/g_tracking', ['zepto', '//h5.m.jd.com/active/track/mping.min.js'], function($) {
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
});