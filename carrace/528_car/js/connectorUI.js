//var URL = "http://10.8.215.14/soa-bingo-web/";//209.104/soa-bingo-web/";
var URL = "http://h5.m.jd.com/h5api.jsp?functionid=";
//var localURL = "http://10.8.215.1:8080/soa-bingo-web/";

//������Ҫ��������

//var REQUEST_TYPES = [
//						"theCarRaceInitExecute",      // 1
//						"theCarRaceFriendsList",	  // 2
//						"theCarRaceGameOver",         // 3
//						"theCarRaceYiChe",            // 4
//						"theCarRaceWnDoc",            // 5
//						"theCarRaceWeiXinShareOil",   // 6
//						"theCarRaceWeiXinShareHb",    // 7
//						"theCarRaceFriendsRefuel",    // 8
//						//9
//						//10
//						//11
//					];


function CRequestManager() {
    this._init = function () {

    }

    this.sendRequest = function (requestType, requestArg, callback) {//���ӻص�����
        $.ajaxSetup({ cache: false });

        var jqxhr = $.getJSON(URL + requestType + "?" + requestArg, function (json) {
            console.log("success " + requestType);
            if (json.code == 0)
            {
                callback(json);
            }
            else
            {
                //////console.debug("Server Error: " + " " + "contentType" + json.code + " | " + json.msg);
            }
        }).fail(function () {
            console.log("error " + requestType);
        }).always(function () {
            console.log("complete " + requestType);
        });
    }

    this.sendRealRequest = function (requestType, sid, requestArg,  callback) {

        $.ajaxSetup({ cache: false });
        //sid= "072d6887cc11e1a4e4c84ab6a6dd4ec8";

        //info = "E2B55970A1C48C2C1D809A9536468B679D2B4384D292360B9F0DD806D060AD4F";
        //sid = "f930bc61c125a70ef2dbc9569d002d06";
        var tmp;
        if ( requestArg == 'body={" "}' )
        {
            tmp = URL + requestType + "&client=wh5&clientVersion=1.0.0&sid="
            + sid + "&_=1431415665908&callback=jsonp2";
        }
        else
        {
            tmp = URL + requestType + "&client=wh5&clientVersion=1.0.0&sid="
            + sid + "&_=1431415665908&callback=jsonp2&" + requestArg;
        }
        //console.debug(tmp+"!!!send msg time:"+getTodayDate());

        jQuery(document).ready(function(){
            $.ajax({

                type: "get",
                dataType: "jsonp",
                //async: false,
                url: tmp,
                jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
                jsonpCallback:"jsonp2",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
                success: function(json){
                    //alert( "success" + requestArg + "get json data:" + json );
                    //alert("msg "+ requestType+"recive success! json.code="+json.code+"json.msg="+json.msg);
                    //
                    if (s_onLine == true)
                    {
                        if (json.code == 3)
                            jumpLogin(location.href);//http://h5.m.jd.com/active/carrace/index.html
                        else
                        {
                            //console.debug(requestType+"json code"+json.code+"json msg"+json.msg+"json data:"+json+"!!!get msg time:"+getTodayDate());
                            callback(json);
                        }
                    }
                },
                error: function(){
                    //alert('fail');
                }
            });
        });

        /*
        var jqxhr = $.getJSON(tmp, function (json) {
            alert( "msgName:"+requestArg+ "//json code" + json.code + " msg:" + json.msg);
            alert( "json data:" + json );
            console.log("success " + requestType + " params:" + requestArg);
            if (json.code == 0)
            {
                alert( "success " + requestType + " params:" + requestArg );
                callback(json);
            }
            else
            {
                alert( "Error code" + json.code + " msg:" + json.msg );
                ////console.debug("Server Error: " + " " + "contentType" + json.code + " | " + json.msg);
            }
        }).fail(function () {
            alert( "Error json" );
            console.log("error " + requestType);
        }).always(function () {
            console.log("complete " + requestType);
        });*/


    }

    this._init();
}
//http://h5sh.jd.local/h5api.jsp?functionid=theCarRaceWeiXinShareOil&client=wh5&clientVersion=1.0.0&sid=XXXXXXX&_=1431415665908&callback=jsonp2&env=beta  //接口6

//    http://h5sh.jd.local/h5api.jsp?functionid=redEnvelopePageInit&client=wh5&clientVersion=1.0.0&sid=XXXXXXX&_=1431415665908&callback=jsonp2&env=beta&body={} //接口8

//        http://h5sh.jd.local/h5api.jsp?functionid=grabRedEnvelope&client=wh5&clientVersion=1.0.0&sid=XXXXXXX&_=1431415665908&callback=jsonp2&env=beta&body={} //接口9

//            http://h5sh.jd.local/h5api.jsp?functionid=shareRedEnvelope&client=wh5&clientVersion=1.0.0&sid=XXXXXXX&_=1431415665908&callback=jsonp2&env=beta //接口 12

//������ҪCRequest������

//function CRequest(type) {				

//	var xmlHttpRequest,			// 
//		requestType = type,		// �ӿ�����	
//		test_requestId,			// ������
//		available = true;		// �ýӿ��Ƿ���ã����Ѿ�send��δcallback���򲻿���

//	/*
//	var callbacks = [
//						handleCarRaceInitExecute,		//�ӿ�1����ʼ��
//						handleCarRaceFriendsList,		//�ӿ�2������
//						handleCarRaceGameOver			//�ӿ�3����Ϸ����
//					];
//	*/				
//	this.sendRequest = function (requestArg){  

//		if (!available) 
//		{
//			////console.debug("Request not available: " + requestType);
//			return;
//		}

//		xmlHttpRequest = this._createXmlHttpRequest();   
//		xmlHttpRequest.onreadystatechange = this._callback;  

//		//ʵ���ã�
//		xmlHttpRequest.open("GET",URL + requestType + "?" + requestArg,true);  
//		//�����ã�
//		//xmlHttpRequest.open("POST",URL + "?command=" + test_requestId,true);  

//		xmlHttpRequest.send(null);

//		available = false;
//	}

//	this.getType = function(){
//		return type;
//	}

//	this._init = function(){

//		//�����ã�
//		for (var i = 0; i < REQUEST_TYPES.length; i++)
//		{
//			if (requestType == REQUEST_TYPES[i]) 
//			{
//				test_requestId = i + 1;
//				break;
//			}
//		}
//	}
//	this._createXmlHttpRequest = function(){  
//		if(window.ActiveXObject){ //�����IE�����  
//			return new ActiveXObject("Microsoft.XMLHTTP");  
//		}else if(window.XMLHttpRequest){ //��IE�����  
//			return new XMLHttpRequest();  
//		}  
//	}  

//	//�ص�����  
//	this._callback = function(){  

//		if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200)
//		{
//			available = true;

//			////console.debug("GET: " + xmlHttpRequest.responseText);
//			var json = JSON.parse(xmlHttpRequest.responseText); 

//			if (json.code == 0)
//			{
//				////console.debug("Handle: " + requestType);

//				switch (requestType)
//				{
//					//����ӿ�1����ʼ��
//					case "theCarRaceInitExecute":
//						s_oMain.initGameByServer(json);

//						break;

//					//����ӿ�3����Ϸ����
//					case "theCarRaceGameOver":
//						s_oGame.exitByServer(json);
//						break;

//				    case "theCarRaceWnDoc":
//				        $("#messageofday").html(json.result);
//						break;
//				}
//			}else
//			{
//				////console.debug("Server Error: " + " " + contentType + json.code + " | " + json.msg);
//			}
//		}  
//	}

//	this._init();
//}