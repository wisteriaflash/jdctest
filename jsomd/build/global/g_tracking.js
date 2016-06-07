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