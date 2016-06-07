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