//(function($,jw,undefined){
function wechatToJD(){
    var sw="0j1dke1y0";
    //var cfg =jw.getUrlParam('cfg').split('sw');
    var s="images/tx.jpg0j1dke1y0jeff0j1dke1y040j1dke1y020j1dke1y08";
    console.dir(s.split(sw));
    var cfg=["images/tx.jpg","Jeff","4","2","8"];
    var isinstall = undefined;


    function weixinInvoke() {

        if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
            WXReadyFn();
        } else {
            if (document.addEventListener) {
                document.addEventListener("WeixinJSBridgeReady", WXReadyFn, false);
            } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", WXReadyFn);
                document.attachEvent("onWeixinJSBridgeReady", WXReadyFn);
            }
        }
        function WXReadyFn() {
            WeixinJSBridge.invoke("getInstallState", {
                "packageUrl": "openApp.jdMobile://",
                "packageName": "com.jingdong.app.mall"
            }, function (res) {
                var info = res.err_msg;
                if (info.indexOf("get_install_state:yes") > -1) {
                    isinstall = true;
                }
            });
            // 解决android机器上,联合登录授权页跳回后,右上角分享按钮不见的情
            // WeixinJSBridge.call('showOptionMenu');
            
        }
    }
    function isInWeiXin() {
        var ua = navigator.userAgent.toLowerCase();
        if (/micromessenger/.test(ua)) {
            return true;
        }
        return false;
    }
	
	function play()
	{
        //alert("jump to JD app");
		//var urlRoot = getRootPath();
		var appurl = 'openApp.jdMobile://virtual?params={"category":"jump","des":"getCoupon","action":"to","url":"http://h5.m.jd.com/active/carrace/index.html"}';
		var murl = 'http://h5.m.jd.com/active/download/download.html';

        //window.location.href = appurl;


        //window.location.href = 'openApp.jdMobile://virtual?params={"category":"jump","des":"faxian","sourceType":"h5","sourceValue":"jumpfaxian"}';
		//if (isinstall == 1) {
			location.href = appurl;
		//} else {
		//	if (isInWeiXin()) {
         //       openJdApp(appurl, murl);
		//	} else {
         //       location.href = murl;
		//	}
		//}
		return false;
	}
	
	play();
    //new shareView({el:'#xbox',data:cfg}).render();
}//)($,jw,undefined);

function openJdApp(appurl, murl) {
    var g_sSchema = appurl;
    var g_sDownload = murl;
    var div, tid, startTime;
    var g_sUA = navigator.userAgent.toLowerCase();
    var jdApp = g_sUA.indexOf('jdapp');
    if (jdApp != -1) {
        location.href = appurl;
    } else {
        //创建iframe，呼起app schema
        startTime = Date.now(); //标记呼起时间点
        div = document.createElement('div');
        div.style.visibility = 'hidden';
        div.innerHTML = "<iframe src=" + g_sSchema + " scrolling=\"no\" width=\"1\" height=\"1\"></iframe>";
        document.body.appendChild(div);
        //如果成功呼起，setTimeout不会立即执行
        tid = setTimeout(function () {
            //如果没有呼起，或者呼起后，用户主动返回，还是有可能走进这个逻辑
            var delta = Date.now() - startTime;  //然后判断回来的时间戳
            if (delta < 1400) {  //如果不是我们规定的，差太多，就认为是用户手动返回的, 不跳下载
                location = g_sDownload;   //否则跳下载
            }
        }, 1200);
        //注意：ios在safari进程挂起之后，js代码还会继续运行至少500ms，这里写1200来保证起效。魔法数字，有待优化。
    }
}