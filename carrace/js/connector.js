//var URL = "http://10.8.215.14/soa-bingo-web/";
//var URL = "http://192.168.0.107/projects/TestAS/TestJD.php";
var URL = "http://h5.m.jd.com/h5api.jsp?functionid=";

var REQUEST_TYPES = [
						"theCarRaceInitExecute",		// 1
						"theCarRaceFriendsList",		// 2
						"theCarRaceGameOver",			// 3
						"theCarRaceYiChe",				// 4
						"theCarRaceWnDoc",				// 5
						"theCarRaceWeiXinShareOil",		// 6
						"theCarRaceWeiXinShareHb",		// 7
						"theCarRaceFriendsRefuel", 		// 8
						"theShareWechatInit",			// 9	 
						"theHongbaoFetch",				//10
						"theRateData",					//11
					];

					
function CAsynRequestManager() {
	
	var requests = [];
	
	this._init = function(){
		for (var i = 0; i < REQUEST_TYPES.length; i++)
		{
			requests.push(new CAsynRequest(REQUEST_TYPES[i]));
		}
	}
	
	this.sendRequest = function (requestType, ssid, requestArg){
		for (var i = 0; i < REQUEST_TYPES.length; i++)
		{
			(requestType == REQUEST_TYPES[i]) && (requests[i].sendRequest(requestType, ssid, requestArg));
		}
	}
	this._init();
}

function CAsynRequest(type) {
	
	var xmlHttpRequest,			// 
		requestType = type,		// �ӿ�����	
		test_requestId,			// ������
		available = true;		// �ýӿ��Ƿ���ã����Ѿ�send��δcallback���򲻿���
		
	this.sendRequest = function (requestType, sid, requestArg){
		
		if (!available) 
		{
			////////console.debug("Request not available: " + requestType);
			return;
		}
		
		xmlHttpRequest = this._createXmlHttpRequest();   
		xmlHttpRequest.onreadystatechange = this._callback;  
		
		//ʵ���ã�
        var tmp;
        if ( requestArg == 'body={" "}' )
        {
            tmp = URL + requestType + "&client=wh5&clientVersion=1.0.0&sid="
            + sid + "&_=1431415665908&callback=jsonp2&env=beta";
        }
        else
        {
            tmp = URL + requestType + "&client=wh5&clientVersion=1.0.0&sid="
            + sid + "&_=1431415665908&callback=jsonp2&env=beta&" + requestArg;
        }
        //alert(tmp);

		xmlHttpRequest.open("GET", tmp, true);
		//�����ã�
		//xmlHttpRequest.open("POST",URL + "?command=" + test_requestId,true);
		 
		xmlHttpRequest.send(null);

		available = false;
	}

	this.getType = function(){
		return type;
	}
	
	this._init = function(){
		
		//�����ã�
		for (var i = 0; i < REQUEST_TYPES.length; i++)
		{
			if (requestType == REQUEST_TYPES[i]) 
			{
				test_requestId = i + 1;
				break;
			}
		}
	}
	this._createXmlHttpRequest = function(){  
		if(window.ActiveXObject){ //�����IE�����  
			return new ActiveXObject("Microsoft.XMLHTTP");  
		}else if(window.XMLHttpRequest){ //��IE�����  
			return new XMLHttpRequest();  
		}  
	}  
  
	//�ص�����  
	this._callback = function(){  
		
		if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200)
		{
            //available = true;
            //
            //////////console.debug("GET: " + xmlHttpRequest.responseText);
            //var json = JSON.parse(xmlHttpRequest.responseText);
            //
            //if (s_onLine == true)
            //{
            //    if (json.code == 3)
            //        jumpLogin("http://h5.m.jd.com/active/carrace/index.html");//http://h5.m.jd.com/active/carrace/index.html
            //    else
            //        callback(json);
            //}
            //
			//if (json.code == 0)
			if (true)
			{
				//////console.debug("Handle: " + requestType);
				
				
				switch (requestType)
				{
					/*
					//����ӿ�1����ʼ��
					case "theCarRaceInitExecute":
						s_oMain.initGameByServer(json);
						
						break;
						
					//����ӿ�3����Ϸ����


				    case "theCarRaceWnDoc":
				        $("#messageofday").html(json.result);
						break;
					*/

                    case "theCarRaceGameOver":
                        s_oGame.exitByServer(json);
                        break;
					
					case "theCarRaceWnDoc":
						initDocByServer(json);
						break;
					
					case "theCarRaceFriendsList":
						initFriendListByServer(json);
						break;
					/*
					case "theCarRaceWeiXinShareOil":
						initShareByServer(json);
						
						break;
					*/
					case "theCarRaceFriendsRefuel":
						initRefuelByServer(json);
						
						break;
					
					case "redEnvelopePageInit":
						initBagByServer(json);
						
						break;					
					
					case "grabRedEnvelope":
						initOpenBagByServer(json);
						
						break;						
				}
				
			}else
			{
				console.debug("Server Error: " + json.code + " | " + json.msg);
			}
		}  
	}
	
	this._init();
}
