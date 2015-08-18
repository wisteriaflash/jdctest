var loadingTimeLine;
var campaignStartDate = new Date("5/22/2015")

var g_sid = getQueryString("sid");
if (!g_sid) g_sid = "123456";
//g_sid = "00c4f92f29e83bf2242288763dd67e9c";


var g_info = getQueryString("info");
if (!g_info) g_info = "123456";

var endGameMessages = [
    "不抛弃 不放弃！<br>继续加油 大奖到手",
    "别伤心，再来几圈，<br>今日大奖其实并不远",
    "失败是成功的妈妈，<br>继续加油，冲向大奖",
    "这局结束了，但征程才刚开始!<br>拉上好友一起冲向大奖吧",
];

//UI related
var g_mainFrame,                //主界面
    g_rankingFrame,             //排行榜界面
    g_newFuelTipFrame,          //新好友加油提示页面
    g_docFrame,                 //活动规则页面
    g_fuelTipFrame,             //燃油不足界面
    g_overFrame;                //结束界面

function pageInitScreen()
{
    var widthRatio = window.innerWidth / 640;
    var heightRatio = window.innerWidth * 1.775/1136;
    TweenMax.set($("#topframe"), { transformOrigin: "0% 0%", scaleX: widthRatio, scaleY: heightRatio });

    var ty = (window.innerHeight - 1136 * heightRatio) / 2;
    TweenMax.set($("#button_play"), { top: window.innerHeight / heightRatio - 125 - 100 });
    TweenMax.set($("#button_desc"), { top: window.innerHeight / heightRatio - 49 - 30 });
    TweenMax.set($("#button_ranking"), { top: window.innerHeight / heightRatio - 49 - 30 });
    TweenMax.set($("#button_yiche"), { top: window.innerHeight / heightRatio - 48 - 30 });
    //var tyc = window.innerHeight;
   //$("#topframe").css({ "top": ty + "px" });
    //$("#topframe").css({ "height": tyc + "px" });

}


function pageShowLoading() {

    $('<img/>').attr('src', './sprites/loading.jpg').load(function () {
        $(this).remove(); // prevent memory leaks
        $('<img/>').attr('src', './sprites/loading_pointer.png').load(function () {
            $(this).remove(); // prevent memory leaks
            $('<img/>').attr('src', './sprites/loading_text.png').load(function () {
                $(this).remove(); // prevent memory leaks
                $('<img/>').attr('src', './sprites/loading_text.png').load(function () {
                    $(this).remove(); // prevent memory leaks

                    $('#main_loading').css('background-image', 'url(./sprites/loading.jpg)');
                    $('#loading_pointer').css('background-image', 'url(./sprites/loading_pointer.png)');
                    $('#loading_text').css('background-image', 'url(./sprites/loading_text.png)');
                    $('#loading_glow').css('background-image', 'url(./sprites/loading_glow.png)');
                     loadingTimeLine = new TimelineMax({ repeat: -1, repeatDelay: 0 });
                    loadingTimeLine.set($("#loading_text"), { display: 'block', opacity: 0 });
                    loadingTimeLine.to($("#loading_text"), 0.5, { opacity: 1 });
                    loadingTimeLine.to($("#loading_text"), 0.5, { delay: 0, opacity: 0 });
                    pageSizeHandler();
                    gameStart();

                });
            });
        });
    });

}

function pageSizeHandler() {
    pageInitScreen();
}

function pageUpdatePercentage(percent) {

    var tl = new TimelineMax({
        onComplete: function () {
        }
    });
    //tl.set($("#loading_pointer"), { rotationZ: -45 });
    tl.to($("#loading_pointer"), 0.5, { rotationZ: -45 + (270 * percent), ease: Linear.easeNone });
    tl.to($("#loading_glow"), 0.5, { opacity: percent, ease: Linear.easeNone }, 0);

    if (percent >= 1) {
        loadingTimeLine.kill();
        $('mainmenu').css('display', 'block');
        pageLoadingComplete();
    }
}

function pageLoadingComplete() {
    TweenMax.to($("#main_loading"), 1, {
        scale: 0.5, opacity: 0, ease: Quint.easeInOut, onComplete: function () {
            $("#main_loading").css("display", "none");

        }
    });

}

function gameStart() {
    /*$(function () {
        FastClick.attach(document.body);
    });*/
    //var oMain = new CMain();
    if (!s_oMain)
        s_oMain = new CMain();

    if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0) {
        document.getElementById("canvas").addEventListener("touchmove", touchHandler, false);
    } else {
        document.getElementById("canvas").addEventListener("mousemove", mouseHandler, false);
    }

    $(s_oMain).on("game_start", function (evt) {
    });

    $(s_oMain).on("save_score", function (evt, score) {
    });

    $(s_oMain).on("restart", function (evt) {
        TweenMax.to($("topframe"), 1, { opacity: 1, ease: Quint.easeInOut, display: 'block' });
        TweenMax.to($("mainmenu"), 1, { opacity: 1, ease: Quint.easeInOut, display: 'block' });
    });

    //alert("jd app theCarRaceInitExecute g_sid=" + g_sid);
    s_oRequestManager.sendRealRequest("theCarRaceInitExecute", g_sid, 'body={"date": "'+getTodayDate()+'"}', function (json) {
        s_oMain.initGameByServerResult = json;

        if(json && json.open){
            $("#button_play").attr("openflag",json.open);

            if (window.location.href.split('?')[0] != json.url)
                window.location.href = json.url;
        }
        //if(json.code != 3){
            //s_oRequestManager.sendRealRequest("userInfo", g_sid, 'body={" "}', function(json){
                //if(json && json.userInfoSns){
                    //s_oRequestManager.sendRealRequest("theCarRaceSinfo", g_sid, 'body={"pin":"'
                    //+ g_sid + '","url":"' + json.userInfoSns.yunSmaImageUrl + '","nname":' + json.userInfoSns.unickName +'}', function(json){
                        //console.log(json);
                    //});
                //}
            //});
        //}
        if (json.petrolAddedFlag == 1)
        {
            if ( !g_newFuelTipFrame )
            {
                g_newFuelTipFrame = new showFriendFuel();
            }

            g_newFuelTipFrame.show();
        }
    });
    

    //main menu event handler
    $("#button_yiche").off().click(function () {

        //mPing
        mPingFunction("M618FCHome_YCarRun", location.href.split('?')[0]);

        var openflag = $("#button_play").attr("openflag");
        if(openflag && openflag != 1 ){
            alert("活动已过期");
            return false;
        }
        //window.location.href = "http://m.car.jd.com/topic/baolai/index.shtml";

        window.location.href = s_oMain.initGameByServerResult.ycurl + "?sid="+g_sid;
    });
    $("#button_ranking").off().click(function () {

        //mPing
        mPingFunction("M618FCHome_Ranking", location.href.split('?')[0]);

        var openflag = $("#button_play").attr("openflag");
        if(openflag && openflag > 2 ){
            //alert("活动已过期");
            //return false;
        }
        // temp using debug
        //showEndGame();

        if (!g_rankingFrame)
            g_rankingFrame = new showRanking();

        g_rankingFrame.show();

    });
    $("#button_desc").off().click(function () {

        //mPing
        mPingFunction("M618FCHome_GameRules", location.href.split('?')[0]);

        //获得今日信息
        //s_oRequestManager.sendRealRequest("theCarRaceWnDoc", g_sid, " ", function (json) {
        //    $("#messageofday").html(json.result);
        //});

        if ( !g_docFrame )
            g_docFrame = new showRule();

        g_docFrame.show();
    });
    $("#button_play").off().click(function () {

        //mPing
        mPingFunction("M618FCHome_Start", location.href.split('?')[0]);

        var openflag = $("#button_play").attr("openflag");
        if(openflag && openflag !=1 ){
            alert("活动已过期");
            return false;
        }

        //TweenMax.to($("topframe"), 1, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'none' });
        TweenMax.to($("mainmenu"), 1, { opacity: 0, ease: Quint.easeInOut, display: 'none' });
        //console.debug("Boundary: " + CANVAS_WIDTH + " " + CANVAS_HEIGHT);
        if (s_oMenu) s_oMenu.unload();
        if (s_oMain) s_oMain.gotoGame();
    });
}

function showRule() {

    this.show = function(){
        TweenMax.set($("rule"), { top: 1136, opacity: 1, display: 'block' });
        TweenMax.to($("mainmenu"), 0.5, { top: -1136, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("rule"), 0.5, { top: 0, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("#button_yiche"), 0.5, { bottom: 1166, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("#button_ranking"), 0.5, { bottom: 1166, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("#button_desc"), 0.5, { bottom: 1166, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("#button_play"), 0.5, { bottom: 1236, opacity: 1, ease: Quint.easeInOut });
    };

    $("#ruleGoIndex").off().click(function () {
        TweenMax.to($("rule"), 0.5, { top: 1136, opacity: 1, ease: Quint.easeInOut, display: 'none' });
        TweenMax.to($("mainmenu"), 0.5, { top: 0, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("#button_yiche"), 0.5, { bottom: 30, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("#button_ranking"), 0.5, { bottom: 30, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("#button_desc"), 0.5, { bottom: 30, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("#button_play"), 0.5, { bottom: 100, opacity: 1, ease: Quint.easeInOut });

        var toTime = getTodayDate();
        s_oRequestManager.sendRealRequest("theCarRaceInitExecute", g_sid, 'body={"date": "'+toTime+'"}', function (json) {
            s_oMain.initGameByServerResult = json;
        });

    });


}

function showFriendFuel() {

    this.show = function()
    {
        TweenMax.set($("#friend_fuel"), { scale: 0.5, opacity: 0, display: 'block' });
        TweenMax.set($("smoothlayer"), { opacity: 0, display: 'block' });
        TweenMax.to($("#friend_fuel"), 0.5, { scale: 1, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("smoothlayer"), 0.5, { opacity: 1, ease: Quint.easeInOut });
    };

    $("#friend_fuel_ok").off().click(function () {
        ffAutoScrollStop();

        TweenMax.to($("#friend_fuel"), 0.5, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'none' });
        TweenMax.to($("smoothlayer"), 0, { opacity: 0, ease: Quint.easeInOut, display: 'none' });
    });
    $("#friendfueltext").off().on('touchstart', function () {
        ffAutoScrollStop();
    });
    $("#friendfueltext").off().on('touchend', function () {
        ffAutoScrollStart();
    });
    s_oRequestManager.sendRealRequest("theCarRaceFriendsList", g_sid, " ", function (json) {
        TweenMax.to($("#friendfueltext"), 1, { opacity: 1 });
        var html = "";
        if ( json.code == 0 )
        {
            json.list = json.list.sort(function(a,b){
                return b.datetime - a.datetime ;
            });
            for (var i = 0; i < json.list.length; i++) {
                var odate = new String(json.list[i].datetime);
                var sdate = odate.substr(4, 2) + "-" + odate.substr(6, 2) + " " + odate.substr(8, 2) + ":" + odate.substr(10, 2) + ":" + odate.substr(12, 2);
                html += "<friendfuelitem><friendfuelimage  style=\"background-image:url('" + (json.list[i].url || "") + "')\"></friendfuelimage><friendfuelname>" + (json.list[i].nname || "好友") + "</friendfuelname><friendfuelcount>" + sdate + "</friendfuelcount></friendfuelitem>";
            }
            $("friendfueltext").html(html);
            //ffAutoScrollStart();
        }else{
            //alert(json.msg);
        }
    });

    if ( s_oMain.initGameByServerResult && s_oMain.initGameByServerResult.residualOilVolume)
        $("#friend_my_fuel").html("X " + s_oMain.initGameByServerResult.residualOilVolume);


}
var ffTimer = 0;
var ffBeginTimer = 0;
function ffAutoScrollStart() {
    //if (ffTimer == 0 && ffBeginTimer == 0) {
    //    var top = $("#friendfueltext").scrollTop();
    //    ffBeginTimer = window.setTimeout(function () {
    //        ffTimer = window.setInterval(function () {
    //            top++;
    //            $("#friendfueltext").scrollTop(top);
    //        }, 100);
    //    }, 4000);
    //}
}
function ffAutoScrollStop() {
    //window.clearTimeout(ffBeginTimer);
    //window.clearInterval(ffTimer);
    //ffTimer = 0;
    //ffBeginTimer = 0;

}

function showInsufficientFuel(callback) {

    this.show = function(){
        TweenMax.set($("insufficient"), { scale: 0.5, opacity: 0, display: 'block' });
        TweenMax.set($("smoothlayer"), { opacity: 0, display: 'block' });
        TweenMax.to($("insufficient"), 0, { scale: 1, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("smoothlayer"), 0, { opacity: 1, ease: Quint.easeInOut });
    };

    $("#insufficient_share").off().click(function () {
        //TweenMax.to($("insufficient"), 1, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'none' });
        //TweenMax.to($("smoothlayer"), 1, { opacity: 0, ease: Quint.easeInOut, display: 'none' });
        //callback();

        //mPing
        mPingFunction("M618FCBombBox_InviteFriendFillFuel", location.href.split('?')[0]);

        //0514
        shareFunction();

    });
    $("#insufficient_buy").off().click(function () {
        //TweenMax.to($("insufficient"), 0, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'none' });
        //TweenMax.to($("smoothlayer"), 0, { opacity: 0, ease: Quint.easeInOut, display: 'none' });
        //callback();

        //mPing
        mPingFunction("M618FCBombBox_YCarFillFuel", location.href.split('?')[0]);

        window.location.href = s_oMain.initGameByServerResult.ycurl + "?sid="+g_sid;
    });

    $("#noOilIndex").off().click(function () {
        TweenMax.to($("insufficient"), 0, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'none' });
        TweenMax.to($("smoothlayer"), 0, { opacity: 0, ease: Quint.easeInOut, display: 'none' });

        //TweenMax.to($("topframe"), 0, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'block' });
        TweenMax.to($("mainmenu"), 0, { opacity: 1, ease: Quint.easeInOut, display: 'block' });
        TweenMax.to($("#button_yiche"), 0, { bottom: 1166, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("#button_ranking"), 0, { bottom: 1166, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("#button_desc"), 0, { bottom: 1166, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("#button_play"), 0, { bottom: 1236, opacity: 1, ease: Quint.easeInOut });

        s_oRequestManager.sendRealRequest("theCarRaceInitExecute", g_sid, 'body={"date": "'+getTodayDate()+'"}', function (json) {
            s_oMain.initGameByServerResult = json;
        });
    });
}

function getTodayDate()
{
    var today = new Date();
    var dayOfMonth = today.getDate();
    today.setDate(dayOfMonth);

    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yy = today.getFullYear();
    var hh = today.getHours();
    var mn = today.getMinutes();
    var ss = today.getSeconds();
    if (dd < 10)
        dd = "0" + dd;
    if (mm < 10)
        mm = "0" + mm;
    if (yy < 10)
        yy = "0" + yy;
    if (hh < 10)
        hh = "0" + hh;
    if (mn < 10)
        mn = "0" + mn;
    if (ss < 10)
        ss = "0" + ss;

    return (yy + mm + dd + hh + mn + ss);
}

var rankingCurrentPage = 1;
var selectDate;
var rankingCurrentList = 0;//0, today 1, history
var _sumPage = 1;
function showRanking() {

    this.show = function(){
        $("#rankingtext").scrollTop(0);

        TweenMax.set($("ranking"), { scale: 0.5, opacity: 0, display: 'block' });
        TweenMax.set($("smoothlayer"), { opacity: 0, display: 'block' });
        TweenMax.to($("ranking"), 0, { scale: 1, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("smoothlayer"), 0, { opacity: 1, ease: Quint.easeInOut });
    }

    $("#ranking_ok").off().click(function () {
        rankingAutoScrollStop();
        TweenMax.to($("ranking"), 0.3, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'none' });
        TweenMax.to($("smoothlayer"), 0.3, { opacity: 0, ease: Quint.easeInOut, display: 'none' });
    });
    $("#ranking_today").off().click(function () {
        rankingCurrentPage = 0;
        _isValid = true;
        showTodayRanking();
    });

    var _isValid = true;
    $("#ranking_history").off().click(function () {
        rankingCurrentPage = 1;
        var today = new Date();
        var dayOfMonth = today.getDate();
        today.setDate(dayOfMonth - 1);

        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yy = today.getFullYear();
        var hh = today.getHours();
        var mn = today.getMinutes();
        var ss = today.getSeconds();
        if (dd < 10)
            dd = "0" + dd;
        if (mm < 10)
            mm = "0" + mm;
        if (yy < 10)
            yy = "0" + yy;
        if (hh < 10)
            hh = "0" + hh;
        if (mn < 10)
            mn = "0" + mn;
        if (ss < 10)
            ss = "0" + ss;


        if ((mm + "/" + dd) == "05/21" || (mm + "/" + dd) == "05/30") {
            _isValid = false;
        }
        else {
            $("#ranking_selecteddate").html(mm + "/" + dd);
            _isValid = true;
        }

        showHistoryRanking(yy + mm + dd + hh + mn + ss, _isValid);
    });

    $("#ranking_date").off().click(function () {
        showDateDropdown();
    });
    $("#rankingtext").off().on('touchstart', function () {
        rankingAutoScrollStop();
    });
    $("#rankingtext").off().on('touchend', function () {
        rankingAutoScrollStart();
    });

    $("#ranking_leftarrow").off().click(function () {
        if (_isValid == false)
            return false;

        rankingCurrentPage--;
        if (rankingCurrentPage < 1)
        {
            rankingCurrentPage = 1;

            return false;
        }
        showHistoryRanking(selectDate);

    });
    $("#ranking_rightarrow").off().click(function () {
        if (_isValid == false)
            return false;

        rankingCurrentPage++;

        if ( _sumPage >= 1 && rankingCurrentPage > _sumPage)
        {
            rankingCurrentPage = _sumPage;

            return false;
        }

        if (rankingCurrentPage > 10 )
        {
            rankingCurrentPage = 10;

            return false;
        }

        showHistoryRanking(selectDate);
    });
    //下拉框填入
    var html = "";
    var totalDay = Math.floor((new Date() - campaignStartDate) / 86400000);
    for (var i = totalDay; i > 0 ; i--)
    {
        var today = new Date();
        var dayOfMonth = today.getDate();
        today.setDate(dayOfMonth - i);

        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yy = today.getFullYear();
        var hh = today.getHours();
        var mn = today.getMinutes();
        var ss = today.getSeconds();
        if (dd < 10)
            dd = "0" + dd;
        if (mm < 10)
            mm = "0" + mm;
        if (yy < 10)
            yy = "0" + yy;
        if (hh < 10)
            hh = "0" + hh;
        if (mn < 10)
            mn = "0" + mn;
        if (ss < 10)
            ss = "0" + ss;
        html += "<rdpdateitem data-content='" +yy+mm+dd+hh+mn+ss + "'>" + mm + "/" + dd + "</rdpdateitem>";

        _sumPage = 1;

    }
    $("rankingdropdown").html(html);

    $("rdpdateitem").off().click(function () {
        TweenMax.to($("rankingdropdown"), 0, { opacity: 0, display: 'none' });
        $("#ranking_selecteddate").html($(this).html());

        rankingCurrentPage = 1;

        showHistoryRanking($(this).attr("data-content"));

    });
    if (s_oMain.initGameByServerResult != undefined)
    {
    $("#ranking_totalmiles").html(s_oMain.initGameByServerResult.mileage + "米");

        if (s_oMain.initGameByServerResult.ranking >= 1)
            $("#ranking_rank").html("前58%" ); //("第"+s_oMain.initGameByServerResult.ranking+"名");
        else
            $("#ranking_rank").html("前" + Math.floor(s_oMain.initGameByServerResult.ranking * 100) + "%");
    }

    _sumPage = 0;

    showTodayRanking();

    rankingAutoScrollStart();

}
var rankingTimer = 0;
var rankingBeginTimer = 0;
function rankingAutoScrollStart() {
    /*if (rankingTimer == 0 && rankingBeginTimer == 0) {
        var top = $("#rankingtext").scrollTop();
        rankingBeginTimer = window.setTimeout(function () {
            rankingTimer = window.setInterval(function () {
                top++;
                $("#rankingtext").scrollTop(top);
            }, 100);
        }, 4000);
    }*/
}
function toDecimal2(x) {//保留2位小数
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

function rankingAutoScrollStop() {
    window.clearTimeout(rankingBeginTimer);
    window.clearInterval(rankingTimer);
    rankingTimer = 0;
    rankingBeginTimer = 0;

}
function showDateDropdown() {
    TweenMax.set($("#ranking_dropdown"), { opacity: 0, display: 'block' });
    TweenMax.to($("#ranking_dropdown"), 0, { opacity: 1 });
    $("#ranking_dropdown").focus();
    //$("#ranking_dropdown").focusout(function () {
    //    TweenMax.to($("#ranking_dropdown"), 0.4, { opacity: 0, display: 'none' });
    //});

}

function showTodayRanking() {
    rankingAutoScrollStop();
    TweenMax.to($("rankingdropdown"), 0, { opacity: 0, display: 'none' });
    TweenMax.to($("#ranking_leftarrow"), 0, { opacity: 0, display: 'none' });
    TweenMax.to($("#ranking_rightarrow"), 0, { opacity: 0, display: 'none' });
    TweenMax.to($("#ranking_page"), 0, { opacity: 0, display: 'none' });

    TweenMax.to($("#ranking_history"), 0, { opacity: 0 });
    TweenMax.to($("#ranking_today"), 0, { opacity: 1 });
    TweenMax.to($("#ranking_date"), 0, { opacity: 0,display:'none' });
    TweenMax.to($("#rankingtext"), 0, {
        opacity: 0, onComplete: function () {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yy = today.getFullYear();
            var hh = today.getHours();
            var mn = today.getMinutes();
            var ss = today.getSeconds();
            if (dd < 10)
                dd = "0" + dd;
            if (mm < 10)
                mm = "0" + mm;
            if (yy < 10)
                yy = "0" + yy;
            if (hh < 10)
                hh = "0" + hh;
            if (mn < 10)
                mn = "0" + mn;
            if (ss < 10)
                ss = "0" + ss;
            s_oRequestManager.sendRealRequest("theCarRaceGetCurrentRanking", "", " ", function (json) {
                TweenMax.to($("#rankingtext"), 0, { opacity: 1 });
                var html = "";
                for (var i = 0; i < json.list.length; i++)
                {
                    html += "<rankingitem><rankingname>" +  json.list[i].miles + "</rankingname><mile>" +json.list[i].name + "</mile><position>" + json.list[i].ranking + "</position></rankingitem>";
                }
                $("rankingtext").html(html);

                if ( typeof (json.num) == "undefined" )
                    _sumPage = 1;
                else
                    _sumPage = json.num;

                //$("ranking_page").html(rankingCurrentPage+"/"+_sumPage);


                //rankingAutoScrollStart();
            });
        }
    });
}

function showHistoryRanking(date, ret) {
    selectDate = date;

    TweenMax.to($("#ranking_leftarrow"), 0, { opacity: 1, display: 'block' });
    TweenMax.to($("#ranking_rightarrow"), 0, { opacity: 1, display: 'block' });
    TweenMax.to($("#ranking_page"), 0, { opacity: 1, display: 'block' });

    TweenMax.to($("#ranking_history"), 0, { opacity: 1 });
    TweenMax.to($("#ranking_today"), 0, { opacity: 0 });
    TweenMax.to($("#ranking_date"), 0, { opacity: 1, display: 'block' });
    TweenMax.to($("#rankingtext"), 0, {
        opacity: 0, onComplete: function () {

            if ( ret == false )
            {
                return false;
            }

            s_oRequestManager.sendRealRequest("theCarRaceGetHistoricalRanking", "", 'body={"page":"' + rankingCurrentPage + '","date":"' + date + '"}', function (json) {
                TweenMax.to($("#rankingtext"), 0, { opacity: 1 });
                var html = "";

                if ( json.list )
                {
                    for (var i = 0; i < json.list.length; i++) {
                        html += "<rankingitem><rankingname>" + json.list[i].miles + "</rankingname><position>" + json.list[i].ranking + "</position><mile>" + json.list[i].name + "</mile></rankingitem>";
                    }
                    $("#rankingtext").html(html);

                    if ( typeof (json.num) == "undefined" )
                        _sumPage = 1;
                    else
                    {
                        $("#ranking_page").html(rankingCurrentPage + "/" + _sumPage);
                        _sumPage = json.num;
                    }


                    //rankingAutoScrollStart();
                }
            });
        }
    });
}

function isWeixinBrowser() {
    var ua = navigator.userAgent.toLowerCase();
    return (/micromessenger/.test(ua)) ? true : false;
}

// Asyn callback UI function
function showMilesData(json, miles){
    if (json){
        $("#endgame_messagemile").html("本局战绩："+Math.floor(miles )+"米<br/>当日总成绩："+json.mileage+"米");

        if (json.rov)
            s_oilLeft = json.rov;

        if (json.info){
            g_info = json.info;
        }
    }
    else
    {
        $("#endgame_messagemile").html("本局战绩："+Math.floor(miles )+"米");

    }

    if (isWeixinBrowser()) {
        TweenMax.set($("#endgame_trial"), { display: 'block' });
        TweenMax.set($("#endgame_reward"), { display: 'block' });

    }
    else {
        if ( json != null && json.rpb) {
            TweenMax.set($("#endgame_redpacket"), { display: 'block' });
            TweenMax.set($("#endgame_shareresult"), { display: 'none' });
            /*$("#endgame_messagehead").html("恭喜");*/
            $("#endgame_message1").html("恭喜，获得豪车红包!");
            $("#endgame_message3").html("（分享给好友即可拆开）");
        }
        else {
            TweenMax.set($("#endgame_redpacket"), { display: 'none' });
            TweenMax.set($("#endgame_shareresult"), { display: 'block' });
            $("#endgame_message1").html(endGameMessages[Math.floor(Math.random() * 4)]);
        }
        TweenMax.set($("#endgame_challenge"), { display: 'block' });

        //temp for debug
        //TweenMax.set($("#endgame_redpacket"), { display: 'block' });
        //TweenMax.set($("#endgame_shareresult"), { display: 'none' });
    }
}

function showEndGame(json, miles) {

    TweenMax.to($("#topframe"), 0, { display:'block', opacity: 1, ease: Quint.easeInOut });


    //TweenMax.to($("#topframe"), 0, { display:'block', opacity: 1, ease: Quint.easeInOut });

    //TweenMax.to($("#endgame"), 0, { display:'block', opacity: 1, ease: Quint.easeInOut });
    //TweenMax.to($("smoothlayer"), 0, {display:'block', opacity: 0, ease: Quint.easeInOut });


    TweenMax.set($("endgame"), { scale: 0.5, opacity: 0, display: 'block' });
    TweenMax.set($("smoothlayer"), { opacity: 0, display: 'block' });
    TweenMax.to($("endgame"), 0, { scale: 1, opacity: 1, ease: Quint.easeInOut });
    TweenMax.to($("smoothlayer"), 0, { opacity: 1, ease: Quint.easeInOut });

    showMilesData(json, miles);

    $("#endGameGoIndex").off().click(function () {

        TweenMax.to($("endgame"), 0, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'none' });
        TweenMax.to($("smoothlayer"), 0, { opacity: 0, ease: Quint.easeInOut, display: 'none' });

        //TweenMax.to($("topframe"), 1, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'block' });
        TweenMax.to($("mainmenu"), 0, { opacity: 1, ease: Quint.easeInOut, display: 'block' });
        TweenMax.to($("#button_yiche"), 0, { bottom: 1166, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("#button_ranking"), 0, { bottom: 1166, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("#button_desc"), 0, { bottom: 1166, opacity: 1, ease: Quint.easeInOut });
        TweenMax.to($("#button_play"), 0, { bottom: 1236, opacity: 1, ease: Quint.easeInOut });

        var toTime = getTodayDate();
        s_oRequestManager.sendRealRequest("theCarRaceInitExecute", g_sid, 'body={"date": "'+toTime+'"}', function (json) {
            s_oMain.initGameByServerResult = json;
        });
    });

    $("#endgame_challenge").off().click(function () {

        //mPing
        mPingFunction("M618FCGameOver_PlayAgain", location.href.split('?')[0]);

        //TweenMax.to($("topframe"), 0.3, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'none' });
        TweenMax.to($("endgame"), 0, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'none' });
        TweenMax.to($("smoothlayer"), 0, { opacity: 0, ease: Quint.easeInOut, display: 'none' });

        //restart
        s_oRequestManager.sendRealRequest("theCarRaceInitExecute", g_sid, 'body={"date": "'+getTodayDate()+'"}', function (json) {
            s_oMain.initGameByServerResult = json;

            s_oMain.gotoGame();

        });

        if (s_onLine == false)
            s_oMain.gotoGame();
    });

    $("#endgame_trial").off().click(function () {

        TweenMax.to($("topframe"), 1, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'none' });
        TweenMax.to($("endgame"), 1, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'none' });
        TweenMax.to($("smoothlayer"), 1, { opacity: 0, ease: Quint.easeInOut, display: 'none' });

        //restart
        s_oMain.showGameScene();

    });
    $("#endgame_redpacket").off().click(function () {
        //keep the UI appear
        //TweenMax.to($("endgame"), 1, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'none' });
        //TweenMax.to($("smoothlayer"), 1, { opacity: 0, ease: Quint.easeInOut, display: 'none' });

        //alert("shareRedEnvelope begin");

        //mPing
        mPingFunction("M618FCGameOver_ShareRedEnvelopes", location.href.split('?')[0]);

        s_oRequestManager.sendRealRequest("shareRedEnvelope", g_sid, " ", function (json) {

            //alert("shareRedEnvelope GET success, the params is: code:" + json.code + "msg:" + json.message );
        });

        //s_oRequestManager.sendRealRequest("theCarRaceWeiXinShareOil", g_sid, " ", function(json) {
		//s_oRequestManager.sendRequest("theCarRaceWeiXinShareOil", 'body={"pin":"' + sid + '"}', function (json) {

            //alert("theCarRaceWeiXinShareOil GET success, the params is: code:" + json.code + "msg:" + json.message );
			var shareURL = getRootPath() + '/bag.html?';

            shareURL += 'info=' + g_info;

			var finalURL = "openApp.jdMobile://communication";
			var param = [encodeURIComponent("亲，需要来京东APP参加游戏喔"),encodeURIComponent("每日里程榜的前3000名可获得最高4666元加油卡！"),shareURL, "http://h5.m.jd.com/active/carrace/sprites/icon.jpg"];

			if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPod') > 0  || navigator.userAgent.indexOf('iPad') > 0)
			{
				finalURL += "?params={\"action\":\"share\",\"title\":\"" + param[0] + "\",\"content\":\"" + param[1] + "\",\"shareUrl\":\"" + param[2] + "\",\"iconUrl\":\"" + param[3] + "\"}";
			}else if (navigator.userAgent.indexOf('Android') > 0)
			{
				finalURL += "?params={\"des\":\"share\",\"type\":\"111\",\"title\":\"" + param[0] + "\",\"content\":\"" + param[1] + "\",\"shareUrl\":\"" + param[2] + "\",\"iconUrl\":\"" + param[3] + "\"}";
			}else
			{
				//console.debug("not mobile");
				return;
			}

            window.location.href = finalURL;
		//});


    });

    $("#endgame_reward").off().click(function () {

        //TweenMax.to($("endgame"), 1, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'none' });
        //TweenMax.to($("smoothlayer"), 1, { opacity: 0, ease: Quint.easeInOut, display: 'none' });


        wechatToJD();

    });
    $("#endgame_shareresult").off().click(function () {
        //keep UI appear
        //TweenMax.to($("endgame"), 1, { scale: 0.5, opacity: 0, ease: Quint.easeInOut, display: 'none' });
        //TweenMax.to($("smoothlayer"), 1, { opacity: 0, ease: Quint.easeInOut, display: 'none' });

		shareFunction();

    });
}

function shareFunction(){
    s_oRequestManager.sendRealRequest("theCarRaceWeiXinShareOil", g_sid, " ", function (json) {

        var shareURL = getRootPath() + '/share.html?';
        if (json.data)
        {
            g_info = json.data;

            shareURL += 'info=' + json.data;
            //
            //alert("json.data=" + json.data);
            //alert("shareURL=" + shareURL);
        }

        var finalURL = "openApp.jdMobile://communication";
        //var param = ["夺豪车抢优惠","快来抢优惠吧！！",shareURL,"sprites/life.png"];
        /*var param = ["p1","p2",shareURL,"sprites/life.png"];*/

        var param = [encodeURIComponent("4666元加油卡就要到手，快来帮我加油！"),encodeURIComponent("加急 加急！帮我加把油，陆风汽车豪送的4666元的加油卡就要到手!"),shareURL,"http://h5.m.jd.com/active/carrace/sprites/icon.jpg"];

        if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPod') > 0  || navigator.userAgent.indexOf('iPad') > 0)
        {
            finalURL += ("?params={\"action\":\"share\",\"title\":\"" + param[0]
            + "\",\"content\":\"" + param[1] + "\",\"shareUrl\":\"" + param[2]
            + "\",\"iconUrl\":\"" + param[3] + "\"}");
        }else if (navigator.userAgent.indexOf('Android') > 0)
        {
            finalURL += ("?params={\"des\":\"share\",\"type\":\"111\",\"title\":\"" + param[0] + "\",\"content\":\"" + param[1] + "\",\"shareUrl\":\"" + param[2] + "\",\"iconUrl\":\"" + param[3] + "\"}");
        }else
        {
            //console.debug("not mobile");
            return;
        }

        window.location.href = finalURL;

    });
}

function mPingFunction(eventID, pageName)
{
    try{
    ///Click PING
    var eventId = eventID;							//必选参数，事件id
    var click = new MPing.inputs. Click (eventId);  //构造click 请求
    click. event_param = eventId;					// 设置click的参数,可以设置其他参数
    click.updateEventSeries();					//更新事件串
    var mping = new MPing();					//构造上报实例
    mping.send(click); 						//上报click
    } catch (e){}


    ///PV PING
    try{
        var pv= new MPing.inputs.PV();   //构造pv 请求
        pv. pageParam = pageName;         // 设置pv的参数，可以设置其他参数
        var mping = new MPing();        //构造上报实例
        mping.send(pv);                //上报pv
    } catch (e){}

}

function getQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}

function getRootPath() {
	//获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	var curWwwPath = window.document.location.href;
    //alert("getRootPath curWwwPath: "+curWwwPath);
	//获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName = window.document.location.pathname;
    //alert("getRootPath pathName: "+pathName);
	var pos = curWwwPath.indexOf(pathName);
    //alert("getRootPath pos: "+pathName);
	//获取主机地址，如： http://localhost:8083
	var localhostPaht = curWwwPath.substring(0, pos);
    //alert("getRootPath localhostPaht: "+localhostPaht);
	//获取带"/"的项目名，如：/uimcardprj
	var projectName = pathName.substring(0, pathName.substr(1).lastIndexOf('/')+1);
    //alert("getRootPath projectName: "+projectName);
    //alert("getRootPath return value:"+(localhostPaht + projectName));
	return (localhostPaht + projectName);
}

function jumpLogin (url) {
    //alert( "M page login" );
    window.parent.location.href = 'https://passport.m.jd.com/user/login.action?v=1&returnurl='+encodeURI(url);
};
