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
// define('./global/g_excStatus', ['zepto', './g_utils', './g_tracking', '../component/com_toast'], function($, G_utils, G_tracking, toast) {
;(function(){
	//main vars
	//
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
	var returnObj = {
		directGetData: excStatus.directGetData,
		requestData: excStatus.requestData
	};

	//global
    if(!window.babelGlobal){
        window.babelGlobal = {};
    }
    var babelGlobal = window.babelGlobal;
    //OMD
    var moduleName = excStatus;
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = moduleName;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() { return moduleName; });
    } else {
        babelGlobal.excStatus = returnObj;
    }


})();