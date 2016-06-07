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