define("./global/g_utils",["zepto"],function(e){function t(e){var t;return e instanceof Array&&(e=e.join("")),t=arguments[1]instanceof Array?arguments[1]:a.call(arguments,1),e.replace(r,function(){return t[arguments[1]]})}function n(e,n){var a=e.split(","),r=a[0],s=a[1];if("1"==r)if(e=s,/sale.jd.com\//.test(s))e=c?e.replace(/\/m\//,"/app/"):e.replace(/\/app\//,"/m/"),e=o(e);else if(e.indexOf("has_native=1")>-1)if(c){var l=e.match(/\/active\/(.*)\//);if(l=l?l:e.match(/\/activity\/preview\/(.*)\//),!l)return e=o(e);l=l[1];var d=i(e,"sourceType","test"),u=i(e,"sourceValue","test");e=t('openApp.jdMobile://virtual?params={"category":"jump","des":"babel","sourceType":"{1}","sourceValue":"{2}","activityId":"{0}"}',l,d,u)}else e=o(e);else e=o(e);else e="2"==r?c?t('openApp.jdMobile://virtual?params={"category":"jump","des":"productDetail","skuId":"{0}","sourceType":"h5","sourceValue":"{1}"}',s,s):o("http://item.m.jd.com/ware/view.action?wareId="+s):"3"==r?c?t('openApp.jdMobile://virtual?params={"category":"jump","des":"jshopMain","shopId":"{0}","sourceType":"h5" ,"sourceValue":"double11_find"}',s):o("http://ok.jd.com/m/index-"+s+".html"):"4"==r?c?t('openApp.jdMobile://virtual?params={"category":"jump","des":"productList","sourceType":"sourceType_test" ,"sourceValue":"sourceValue_test", "from":"search", "keyWord": "{0}"}',s):o("http://m.jd.com/ware/search.action?keyword="+s):"4-1"==r?c?t('openApp.jdMobile://virtual?params={"category":"jump","des":"productList","sourceType":"sourceType_test" ,"sourceValue":"sourceValue_test", "from":"category", "cid": "{0}", "levelFirst": "{1}", "levelSecond": "{2}"}',n.cid,n.levelFirst,n.levelSecond):o("http://m.jd.com/products/"+n.levelFirst+"-"+n.levelSecond+"-"+n.cid+".html"):"5"==r?c?t('openApp.jdMobile://virtual?params={"category":"jump","des":"faxian_article","sourceType":"sourceType_test" ,"sourceValue":"sourceValue_test", "id": "{0}"}',s):o("http://h5.m.jd.com/active/faxian/html/innerpage.html?id="+s):o(e);return e}function i(e,t,n){n=n?n:"";var i=new RegExp(t+"=(\\w*)"),o=e.match(i);return o=o?o[1]:n}function o(e){e=e.replace(/(\w*\:)\/\//,d.protocol+"//"),-1==e.indexOf("http")&&(e=d.protocol+e);var t=l.match(/\?(.+)$/);if(!t)return e;if(-1==e.indexOf("?"))return e+t[0];var n=function(e){var t={};return e.forEach(function(e){-1!=e.indexOf("=")&&(e=e.replace(/=/,",").split(","),t[e[0]]=e[1])}),t}(t[1].split("&"));for(key in n){var i=new RegExp("[?|&]"+key+"=","i");i.test(e)||(e+="&"+key+"="+n[key])}return e}var a=Array.prototype.slice,r=/\{(\d+?)\}/g,s=navigator.userAgent.toLowerCase(),c=s.indexOf("jdapp")>-1,l=location.href,d={runtimeEnv:null,protocol:"http:",ajaxSettings:e.ajaxSettings,init:function(){var e=this;e.runtimeEnv=e.checkContainer(),e.protocol=e.getProtocol()},checkContainer:function(){var e=window.navigator.userAgent.toLowerCase(),t={webCon:"",system:""};if(/jdapp/i.test(e)){t.webCon="jdapp";var n=e.split(";"),i=n[2]?n[2]:"",o=i.split(".");o=o[0]?o[0]:"";var a=n[3]?n[3]:"",r=e.match(/network\/(.+?);/);r=r?r[1]:"",t.jdapp={version:i,versionLarge:o,osVersion:a,network:r}}else/MicroMessenger/i.test(e)?t.webCon="weixin":t.webCon="m";/android/i.test(e)?t.system="android":/iPhone/i.test(e)?t.system="iphone":/ipad/.test(e)&&(t.system="ipad");var s=window.location.href.match(/sid=\w*/);return t.sid=s?s[0].replace("sid=",""):"",t},stringStartsWith:function(e,t){return 0===e.lastIndexOf(t,0)},getProtocol:function(){var e=this,t=window.location.href,n=e.stringStartsWith(t,"https")?"https":"http";return n+=":"},requestDevelop:function(t){var n=this;n.ajaxSettings.type="get",n.ajaxSettings.charset="utf8",n.ajaxSettings.dataType="jsonp",n.ajaxSettings.timeout=1e4;var i=t.success,o=t.error;return t.data="body="+JSON.stringify(t.data),t.success=function(e,t,n){if("0"==e.code)i&&i(e,t,n);else if("3"==e.code){var o=location.pathname.indexof(".html")<0?"":location.href.match(/^(.+?\.html)/)[1];location.href="https://passport.m.jd.com/user/login.action?returnurl="+encodeURIComponent(o)}else alert("网络跑累了，请稍候再来！")},t.error=o||function(){alert("网络飞到外太空")},e.ajax(t)},getNoParamURL:function(){var e=window.location.href,t=e.match(/.*\.html/);return t=t?t[0]:e},getPageUrl:function(e,t){var n,i=this;switch(e){case"goodsDetail":n="jdapp"==i.runtimeEnv.webCon?'openApp.jdMobile://virtual?params={"category":"jump","des":"productDetail","skuId":"'+t.sku+'","sourceType":"h5","sourceValue":"double11_find"}':"http://item.m.jd.com/ware/view.action?wareId="+t.sku+"&sid="+i.runtimeEnv.sid;break;case"newgoodshop":n="jdapp"==i.runtimeEnv.webCon?'openApp.jdMobile://virtual?params={"category":"jump","des":"jshopMain","shopId":"'+t.shopId+'","sourceType":"h5" ,"sourceValue":"double11_find"}':"http://ok.jd.com/m/index-"+t.shopId+".htm?sid="+i.runtimeEnv.sid;break;case"none":n="javascript:void(0)";break;default:console.warn("page type not find:"+e),n="javascript:void(0)"}return n},goLogin:function(){var e=encodeURIComponent(window.location.href),t="https://passport.m.jd.com/user/login.action?returnurl="+e;window.location.href=t},getHeaderIphoneUrl:function(e){var t=JSON.stringify(e),n="openapp.jdmobile://communication?params="+t;return n},addTrackingBind:function(){try{MPing.inputs.Click.attachEvent()}catch(e){}},getByteLen:function(e){return null==e?0:("string"!=typeof e&&(e+=""),e.replace(/[^\x00-\xff]/g,"01").length)},jumpLink:function(t,n){var i=e("#J_jumpLink");0==i.length&&(i=e("<a>"),i.attr("id","J_jumpLink").css("display","none"),e("body").append(i));var o=n?n:"_self";i.attr({href:t,target:o}),i.click()}};return d.init(),d.parseUrl=n,d}),define("global/g_utils",function(){}),define("./global/g_header",["zepto","./g_utils"],function(e,t){var n={init:function(e){var t=this;t.config=e},checkShow:function(n){var i=this,o=t.runtimeEnv,a=window.location.href;if("jdapp"!=o.webCon){if(a.match("&showhead=no"))return;i.loadHeaderM(n),e(".bab_opt_header").removeClass("hide")}else"jdapp"==o.webCon&&(n?i.jdappHeader(n):-1)},loadHeaderM:function(e){var t="//st.360buyimg.com/common/commonH_B/js/m_common_header_bottom2.1.js",n="//st.360buyimg.com/common/commonH_B/js/m_common2.1.js";require([t],function(){var t=new MCommonHeaderBottom,n="京东";e&&e.name&&(n=e.name);var i={hrederId:"m_common_header",title:n,isShowShortCut:!1,selectedShortCut:"4"};t.header(i)}),require([n],function(){})},jdappHeader:function(e){var n=t.runtimeEnv,i=n.jdapp?n.jdapp.versionLarge:"";if(i=i?i>=5:!1){var o=e.imgUrl;if(o=-1==o.indexOf("http")?t.protocol+o:o,"android"==n.system){var a={isShow:"N"};o&&o.length>0&&(a={isShow:"Y",imageUrl:o});var r=["N","Y"],s={isShow:r[e.cartButton]};AndroidNavi.setTitle(JSON.stringify(a)),AndroidNavi.setCart(JSON.stringify(s))}else if("iphone"==n.system){var a={action:"sh_hideImgTitle"};o&&o.length>0&&(a={action:"sh_showImgTitle",imageUrl:o}),t.jumpLink(t.getHeaderIphoneUrl(a));var r=["sh_hideCart","sh_showCart"],s={action:r[e.cartButton]};setTimeout(function(e){t.jumpLink(t.getHeaderIphoneUrl(s))},100)}}}};return n.init(),n}),define("global/g_header",function(){}),define("./global/g_imglazyload",["zepto"],function(e){function t(t,i,o){var a,r=this,s=t.offset(),c=!0,l=s.left,d=s.top,u={left:l,top:d,right:l+e(t).width(),bottom:d+e(t).height()};return a=n(i,u),a&&o&&(c=r.isCross(o,u)),c&&a}function n(e,t){var n={};return n.top=Math.max(e.top,t.top),n.bottom=Math.min(e.bottom,t.bottom),n.left=Math.max(e.left,t.left),n.right=Math.min(e.right,t.right),n.bottom>=n.top&&n.right>=n.left}function i(t){var n,i,o,a;if(void 0!==t){n=t.height(),i=t.width();var r=t.offset();o=r.left,a=r.top}else{var s=e(window);n=s.height(),i=s.width(),o=s.scrollLeft(),a=s.scrollTop()}return right=o+i,bottom=a+n,{left:o,top:a,right:right,bottom:bottom}}var o={id:-1,initSign:!1,init:function(){var e=this;e.bindHandler()},addElement:function(){},check:function(){var n=this,o=!1,a=i(),r=e("img[data-src]");r=r.filter(":visible"),e.each(r,function(i,r){r=e(r),o=t(r,a),o&&n.loadImg(r)}),n.initSign||(n.initSign=!0,n.init())},loadImg:function(t){var n=t.attr("data-src");if(0!=n.length){var i=t.data("callback"),o=new Image;e(o).on("load",function(n){t.attr("data-src",""),t.attr("src",e(this).attr("src")),t.addClass("fadein"),i&&i.success&&i.success(t)}),e(o).on("error",function(e){i&&i.error&&i.error(t)}),o.src=t.attr("data-src")}},bindHandler:function(){var t=this;e(window).on("scroll touchmove",function(e){clearTimeout(t.id),t.id=setTimeout(function(){t.check()},100)})}};return o}),define("global/g_imglazyload",function(){}),define("./global/g_tracking",["zepto","//h5.m.jd.com/active/track/mping.min.js"],function(e){var t={winH:e(window).height(),scrollPage:[-1,-1,-1],init:function(){},_clickTracking:function(e,t,n,i,o){var e=e||"",t=t||"",n=n||"",i=i||"",o=o||"",a=new MPing.inputs.Click(e);a.event_param=t,a.page_name=n,a.page_param=i,a.event_level=o,a.updateEventSeries();var r=new MPing;r.send(a)},globalPvTracking:function(e){var t=window.location.href,n=[];n=t.split("?");var i=n[0]||"",o=e,a=new MPing.inputs.PV;a.page_name=i,a.page_param=o;var r=new MPing;r.send(a)},globalLabelTracking:function(t,n,i,o){var a=i||e("body");if(0!=a.find(".J_ping").length&&t){for(var t=t||"",r=n||"",s=window.location.href.match(/^(.+?\.html)/)[1]||"",c=(document.title||"title")+"_"+s,l=a.find(".J_ping"),d=0,u=l.length;u>d;d++){var p=l.eq(d).attr("href").match(/^(.+?\.html)/),f=null===p?"url":p[1],g=l.eq(d).attr("report-dateid")||"ID",h=g+"_"+f;l.eq(d).attr("report-eventid",t),l.eq(d).attr("report-eventparam",h),l.eq(d).attr("report-pagename",c),l.eq(d).attr("report-pageparam",r),l.eq(d).attr("report-eventlevel",event_level)}try{MPing.inputs.Click.attachEvent()}catch(m){}}},globalSlideTracking:function(t,n){var i,o,a=this,r=!1,s="";e(window).on("touchstart",function(e){if(e.touches.length){var t=e.touches[0];i=t.pageY}}),e(window).on("touchmove",function(e){if(e.touches.length){var t=e.touches[0];o=t.pageY-i}}),e(window).on("touchend",function(n){if(Math.abs(o)>0&&(e(window).scrollTop()>=a.winH&&e(window).scrollTop()<2*a.winH&&a.scrollPage[0]<0?(s="Babel_Screen2",r=!0,a.scrollPage[0]++):e(window).scrollTop()>=5*a.winH&&e(window).scrollTop()<6*a.winH&&a.scrollPage[1]<0?(s="Babel_Screen6",r=!0,a.scrollPage[1]++):e(window).scrollTop()>=9*a.winH&&e(window).scrollTop()<10*a.winH&&a.scrollPage[2]<0&&(s="Babel_Screen10",r=!0,a.scrollPage[2]++)),r)try{var i=window.location.href.match(/^(.+?\.html)/)[1]||"",c=t||"",l=i,d="",u=u||"";a._clickTracking(s,c,l,d,u),r=!1}catch(n){}})},globalOverdueTracking:function(e,t){var n=this;try{var i="Babel_OutOfTime",o=window.location.href.match(/^(.+?\.html)/)[1]||"",a=e||"",r=o,s=s||"",t=t||"";n._clickTracking(i,a,r,s,t)}catch(c){}},globalSimulationClick:function(e,t,n,i){var o=this;try{var e=e||"",t=t||"",a=window.location.href.match(/^(.+?\.html)/)[1]||"",r=a,s=n||"",i=i||"";o._clickTracking(e,t,r,s,i)}catch(c){}}};return t.init(),t}),define("global/g_tracking",function(){}),define("./component/com_toast",["zepto"],function(e){var t="toast",n=t+"Opt",i=t+"Instance",o=function(e,t){this.element=e,this._init(t)};o.prototype={version:"1.0.0",playID:-1,node:"",_init:function(t){var n=this,i=this.element,o=this._getSettings(i),a=o?o:e.fn.toast.defaults;o=e.extend({},a,t);var r=n._initDomConfig();o=e.extend({},o,r),n._setSettings(i,o),n._renderHandler()},_initDomConfig:function(){var t,n=this.element,i={};for(var o in e.fn.toast.defaults)t=n.attr("data-"+o),t&&(i[o]=t);return i},_renderHandler:function(){var t=this,n=this.element;if(e("#J_toast").length>0)return void(t.node=e(".jdui_toast"));var i=t._getSettings(n),o='<div id="J_toast" class="jdui_toast animated fadeIn"><span class="jdui_icon"></span><div class="jdui_text"></div></div>';t.node=e(o),t.node.addClass(i.conCls),t.node.find(".jdui_text").html(i.content),i.iconCls?t.node.find(".jdui_icon").addClass(i.iconCls):t.node.find(".jdui_icon").attr("class","jdui_icon"),e("body").append(t.node)},_getSettings:function(e){return e.data(n)},_setSettings:function(e,t){e.data(n,t)},show:function(t){var n=this,i=this.element,o=n._getSettings(i);t&&(o=e.extend({},o,t)),n._setSettings(i,o),n.node.attr("class","jdui_toast animated fadeIn"),n.node.addClass(o.conCls),n.node.find(".jdui_text").html(o.content),n.node.find(".jdui_icon").attr("class","jdui_icon"),o.iconCls&&n.node.find(".jdui_icon").addClass(o.iconCls),"none"===n.node.css("display")&&(n.node.css({display:"inline-block"}),setTimeout(function(){n.node.css({opacity:1,"-webkit-transform":"translate3d(-50%, -30px, 0)",transform:"translate3d(-50%, -30px, 0)"})},50),clearTimeout(n.playID),n.playID=setTimeout(function(){n.node.css({opacity:0,"-webkit-transform":"translate3d(-50%, 0, 0)",transform:"translate3d(-50%, 0, 0)"}),setTimeout(function(){n.node.css({display:"none"})},50)},o.showTime))},hide:function(){var e=this;clearTimeout(e.playID),setTimeout(function(){e.node.css({opacity:0,"-webkit-transform":"translate3d(-50%, 0, 0)",transform:"translate3d(-50%, 0, 0)"}),setTimeout(function(){e.node.css({display:"none"})},50)},300)}};var a={init:function(t){this.each(function(){var n=e(this);n.data(i)||n.data(i,new o(n,t))})},instance:function(){var t=[];return this.each(function(){t.push(e(this).data(i))}),t},show:function(t){var n=e(this),o=n.data(i);o&&o.show(t)},hide:function(){var t=e(this),n=t.data(i);n&&n.hide()}};return e.fn.toast=function(){var e=arguments[0];if(a[e]){if(!this.data(i))return void console.error("please init toast first");e=a[e],arguments=Array.prototype.slice.call(arguments,1)}else{if("object"!=typeof e&&e)return console.error("Method "+e+" does not exist on zepto.tab"),this;e=a.init}return e.apply(this,arguments)},e.fn.toast.defaults={content:"提示信息",conCls:"",iconCls:"",showTime:2e3},o}),define("component/com_toast",function(){}),define("./global/g_excStatus",["zepto","./g_utils","./g_tracking","../component/com_toast"],function(e,t,n,i){var o=t.protocol,a={activeExcData:[{subCode:"1-2","class":"active_out_date",info:"呃，活动已结束或过期~"},{subCode:"1-1","class":"active_pre_start",info:"额，活动还没有开始哦~"},{subCode:"1","class":"active_request_fail",info:"刷新页面"}],_init:function(){e("body").toast()},_bindHandle:function(){var t=e(".active_request_fail .fail_note");t.length&&t.on("click",function(){window.location.href=location.href})},directGetData:function(e,t){var n=a;n._goExceptionUi({activityId:e,subCode:t})},requestData:function(n){var i=a,r=e.extend({},{url:o+"//ngw.m.jd.com/client.action?functionId=babelActivityGetShareInfo&client=wh5&clientVersion=1.0.0",data:{activityId:"",pageId:""},success:i._goExceptionUi,error:i._error},n);t.requestDevelop(r)},_goExceptionUi:function(t){var n=a;if("0"!==t.subCode&&void 0!==t.subCode){var i=e.trim(t.subCode).length,o=t.subCode.substring(0,1),r=t.subCode.substring(i-1,i);"1"!==o||1!==i&&(3!==i||"1"!==r&&"2"!==r)?e("body").toast("show",{content:"网络跑累了，请稍候再来！"}):n._operateExc(t)}else void 0===t.subCode&&e("body").toast("show",{content:"网络跑累了，请稍候再来！"})},_operateExc:function(t){var i,o,r=a;r.activeExcData.forEach(function(e){e.subCode===t.subCode&&(i=e.info,o=e["class"])});var s=e('<div class="page_fail_wrap"></div>'),c=e('<div class="fail_show '+o+'"><span></span><a class="fail_note">'+i+"</a></div>");s.append(c),s.appendTo(e("body")),e("body").addClass("page_fail"),r._bindHandle(),"1-2"===t.subCode&&n.globalOverdueTracking(t.activityId)},_error:function(){e("body").toast("show",{content:"网络飞到外太空！"})}};return a._init(),{directGetData:a.directGetData,requestData:a.requestData}}),define("global/g_excStatus",function(){}),define("./global/g_share",["zepto","./g_utils","../component/com_toast"],function(e,t,n){var i=t.runtimeEnv.system,o=t.runtimeEnv.webCon,a=t.protocol,r={configData:null,configOption:{},_init:function(){e("body").toast()},_judgeEmptyObj:function(e){var t=!1;if("object"==typeof e&&!(e instanceof Array)){for(var n in e){t=!0;break}return t}},_success:function(e){var t=r;"jdapp"===o?t._setJdAppShare():"weixin"===o&&t._setWxShare()},_error:function(){e("body").toast("show",{content:"网络飞到外太空！"})},_operateData:function(t){var n=r;n._dataMerge(t),"0"===t.subCode?n._success(t):e("body").toast("show",{content:"网络跑累了，请稍候再来！"})},_dataMerge:function(t){var n=r;return n.configData=e.extend({},n.configData,t),n},_setShareConfig:function(t){var n=this,i=e.extend({},{sharingTitle:"test title",sharingImgFile:"//m.360buyimg.com/babel/jfs/t2146/59/1639581949/6519/6f836d0b/56ceb5baN90d3de13.png",sharingIntro:"test content",sharingUrl:location.href.match(/^(.+?\.html)/)[1],imgW:"240",imgH:"240"},t);"weixin"===o?n.configOption={img_url:i.sharingImgFile,img_width:i.imgW,img_height:i.imgH,link:i.sharingUrl,desc:i.sharingIntro,title:i.sharingTitle}:"jdapp"===o&&(n.configOption={title:i.sharingTitle,description:i.sharingIntro,url:i.sharingUrl,img:i.sharingImgFile,channel:"Wxfriends",needCallBack:!0})},_needCallBack:function(e){var t;return t="function"==typeof window.jdappShareRes&&"boolean"==typeof e?e:"function"==typeof window.jdappShareRes&&"boolean"!=typeof e?me.configOption.needCallBack:!1},_setJdAppShare:function(t){var n,a=this,r=a._needCallBack(t),s=r?"Y":"N",c={title:a.configData.sharingTitle,description:a.configData.sharingIntro,url:a.configData.sharingUrl,img:a.configData.sharingImgFile,needCallBack:!1};if(a.configOption=e.extend({},a.configOption,c),a.configOption.url=encodeURIComponent(a.configOption.url),a.configOption.img=encodeURIComponent(a.configOption.img),"jdapp"===o)if("iphone"===i){var l={Wxfriends:"WeChat_Friend",Wxmoments:"WeChat_FriendTimeline",Sinaweibo:"Weibo",QQfriends:"QQFriend_SHARE_CLIENT",QQzone:"QQZone_SHARE_CLIENT",Moreshare:""};a.configOption.channel=l[a.configOption.channel],n='openapp.jdmobile://communication?params={"action":"syncShareData","title":"'+a.configOption.title+'","content":"'+a.configOption.description+'","shareUrl":"'+a.configOption.url+'","iconUrl":"'+a.configOption.img+'","isCallBack":"'+s+'"}',location.href=n}else if("android"===i){var c={title:a.configOption.title,desc:a.configOption.description,url:decodeURIComponent(a.configOption.url),imgUrl:decodeURIComponent(a.configOption.img),callback:s};if("function"==typeof window.shareHelper.setShareInfoCallback)if(r)try{shareHelper.setShareInfoCallback(c.title,c.desc,c.url,c.imgUrl,c.callback)}catch(d){shareHelper.setShareInfoCallback(c.title,c.desc,c.url,c.imgUrl)}else"function"==typeof window.shareHelper.setShareInfo&&window.shareHelper.setShareInfo(c.title,c.desc,c.url,c.imgUrl);else"function"==typeof window.shareHelper.setShareInfo&&shareHelper.setShareInfo(c.title,c.desc,c.url,c.imgUrl)}},_setWxShare:function(){var e=r;"undefined"==typeof WeixinJSBridge?document.addEventListener?document.addEventListener("WeixinJSBridgeReady",e._wxShare,!1):document.attachEvent&&(document.attachEvent("WeixinJSBridgeReady",e._wxShare),document.attachEvent("onWeixinJSBridgeReady",e._wxShare)):e._wxShare()},_wxShare:function(){var t=r,n={img_url:t.configData.sharingImgFile,img_width:"240",img_height:"240",link:location.href.match(/^(.+?\.html)/)[1],desc:t.configData.sharingIntro,title:t.configData.sharingTitle};t.configOption=e.extend({},t.configOption,n),WeixinJSBridge.on("menu:share:appmessage",function(e){WeixinJSBridge.invoke("sendAppMessage",t.configOption,function(e){})}),WeixinJSBridge.on("menu:share:timeline",function(e){WeixinJSBridge.invoke("shareTimeline",t.configOption,function(e){})})},directAnalysisData:function(e,t){var n=r;n._setShareConfig(t),n._dataMerge(e),n._success(e)},requestData:function(n,i){var o=r;o._setShareConfig(i);var s=e.extend({},{url:a+"//ngw.m.jd.com/client.action?functionId=babelActivityGetShareInfo&client=wh5&clientVersion=1.0.0",data:{activityId:"",pageId:""},success:o._operateData,error:o._error},n);t.requestDevelop(s)}};return r._init(),{directAnalysisData:r.directAnalysisData,requestData:r.requestData}}),define("global/g_share",function(){}),define("./global/global",["./g_header","./g_utils","./g_imglazyload","./g_excStatus","./g_share","./g_tracking"],function(e,t,n,i,o,a){return{header:e,utils:t,imglazyload:n,excStatus:i,share:o,tracking:a}}),define("global/global",function(){}),require(["global/global"],function(){}),define("global",function(){});