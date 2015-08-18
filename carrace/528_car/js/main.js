var s_fPrevForceFactor = 1,
    s_fCurForceFactor = 0,
    s_bMobile, s_bAudioActive = true,
    s_iCntTime = 0,
    s_iTimeElaps = 0,
    s_iPrevTime = 0,
    s_iCntFps = 0,
    s_iCurFps = 0,
	s_difficulty = 0,
	s_roadLength = 10000,				//单位：Length	    // 赛道长度
	s_roadId,
	s_multiplier = 0,
	s_oilLeft = 1,					//剩余燃油量
	s_petrolAddedFlag = 0,			//是否有新好友加油
    s_bagDataShare,
    
	s_gameScale = 1,				//游戏体缩放比例（基于宽度）
	s_mapLength = 2,				//重复地图序列数
	s_onLine = true,       		//是否在线模式运行
	//s_onLine = !(getQueryString("offline") == 1), //offline = 1 离线，没有参数或者 = 0 则在线。
	//元件全局引用

    s_oConfigTemp = 0,
	s_oSoundTrackSnd, s_oDrawLayer, s_oStage, s_oMain, s_oSpriteLibrary, s_oGame, s_oMenu, s_oRequestManager;
    //s_oAsynRequestManager;

var CANVAS_WIDTH = 0,		
    CANVAS_HEIGHT = 0,
    //FPS_TIME = 1E3 / 24, 
    STATE_LOADING = 0,
    STATE_MENU = 1,
    STATE_HELP = 1,
    STATE_GAME = 3,
    NUM_LINES = 2,
    //INCREASE_SPEED_UP_INTERVAL = 20,
	//INCREASE_SPEED = 1, 
	//DISTANCE_AMONG_OBSTACLES = 550,
	//ACCELLERATION = 0.1,
		
	//SCORE_INCREASE = 1, 
	MALUS_SCORE = 0, 
	//NUM_LIVES = 1,
    UpdateCountRecord = 0;
	
	
// 游戏内部文本定义
//var	TEXT_SCORE = "里程",
    var TEXT_KM = " 米";
	//TEXT_GAME_OVER = "游戏结束",
	//TEXT_PLAY = " ",
	//TEXT_HELP1 = "避免撞到其他车辆 \n点击屏幕对应位置来让自己左右移动 \n",
	//TEXT_HELP2 = "请尝试\n 行驶尽可能长的里程";

// 游戏玩法本身的数据定义，如赛道长度、难度配置等
var ROAD_FIX_POS = [182, 382, 582],  				// 赛道的三个固定点，用于刷其他车辆
	ROAD_FIX_BORDER = [277, 482, 687],				// 三个车道的边界坐标
	//ROAD_LENGTH = 1800000, 			 				// 赛道长度，目前单位是pix
	INIT_GENERIC_OBSTACLE_POS_Y = -300,				// 一开始进行障碍物生成的基准坐标y 
	// 以上三项单位：像素
	
	/*速度，距离，时间相关--------------------------------------------------------------------------------------
		
		距离：
			两个虚拟单位：Length和Miles（不要跟单词实际意义挂钩）
			意义：Length：大多数配置的距离，也是界面显示的单位为m的那个距离
				  Miles：游戏内直接与速度挂钩的距离，与Length成正比。
				  
			换算： Length = Miles * GAME_MILES_RATE
			
		速度：
			两个虚拟单位：GameSpeed和TextSpeed（不要跟单词实际意义挂钩）
			意义：GameSpeed：游戏中的速度，表示每帧位移的像素。
				  TextSpeed：界面显示的速度。
				  
			换算：TextSpeed = GameSpeed * GAME_SPEED_RATE
			
		距离速度公式：
			Miles = GameSpeed * 帧率 * 秒
	*/
	MAX_STARTING_SPEED = 10,						// 单位：GameSpeed  // 初始速度
	SPEED_STEP = 1.5,									// 单位：GameSpeed  // 速度提高值
	GENERIC_OBSTACLE_ROAD_LENGTH = 2000,            // 单位：像素       // 每一次进行障碍物生成时，最多生成多少距离后的障碍
	REDUCE_SPEED = 20,                              // 单位：GameSpeed  // 撞上障碍之后降低的速度
	MIN_SELF_SPEED = 2,                             // 单位：GameSpeed  // 自己车辆的最低速度，无论撞击多少障碍都不会比这个速度小
	SELF_ACCELLERATION = 0.2,                       // 单位：GameSpeed  // 自己车辆在撞击之后的加速度
	//MAX_SPEED_UPDATE_FREQ = 8,                      // 单位：Miles      // 每过多少公里最大速度提升
	GAME_TIME_RATE = 20,							// 单位：——         // 速度时间比(与MAX_SPEED_UPDATE_FREQ要成一定比例）
	GAME_MILES_RATE = 1000,							// 单位：——         // length与g_miles比（显示用length）
	GAME_SPEED_RATE = 6,							// 单位：——         // speed与speedText比（这个数值不会有连带影响可以随意改，可以在不改变实际速度的情况下让speedText显示的速度比例变化）
	INVISIBLE_SPEED = 30,                      		// 单位：GameSpeed  // 无敌速度
	INVISIBLE_END_TIME = .5,                      	// 单位：秒         // 加速结束后继续无敌的时间
	KILL_LENGTH = 5000,								// 单位：Length	    // 必杀与终点的预定距离
	//---------------------------------------------------------------------------------------------------------
	
	KILLER_Y_MODE = [
		[280, 0  , -150],
		[80 , 0  , 180],
		[180, -100, 0  ]
	],
					 
	ENEMY_CAR_SPRITE_CONFIG = [                     // 车辆障碍物的图片信息配置
        [577, 2, 113, 231, 0, 49, 100],
        [462, 2, 113, 231, 0, 49, 100],
        [347, 2, 113, 231, 0, 49, 100],
        [232, 2, 113, 231, 0, 49, 100],
        [117, 2, 113, 231, 0, 49, 100],
        [2, 2, 113, 231, 0, 49, 100],


		// x, y, width, height, imageIndex*, regX*, regY*
        /*[0, 0, 98, 200, 0, 49, 100],
		[98, 0, 98, 200, 0, 49, 100],
        [196, 0, 98, 200, 0, 49, 100],
        [294, 0, 96, 200, 0, 48, 100],
        [388, 0, 96, 200, 0, 48, 100],
        [484, 0, 96, 200, 0, 48, 100],
        [580, 0, 108, 168, 0, 54, 84],
        [688, 0, 108, 168, 0, 54, 84],
        [796, 0, 108, 168, 0, 54, 84],
        [904, 0, 80, 200, 0, 40, 100],
        [984, 0, 80, 200, 0, 40, 100],
        [1064, 0, 80, 200, 0, 40, 100]*/
			],
	ROAD_BLOCK_CONFIG =              // 路障配置
		[
			[{ path: "./sprites/game_obstacle1.png", name: "roadBlock_1", spriteConfig:[[0, 0, 133, 59, 0, 67, 30]]}],
			[{ path: "./sprites/game_obstacle2.png", name: "roadBlock_2", spriteConfig:[[0, 0, 144, 124, 0, 72, 62]]}],
			[{ path: "./sprites/game_obstacle3.png", name: "roadBlock_3", spriteConfig:[[0, 0, 95, 129, 0, 48, 65]]}],
			[{ path: "./sprites/game_obstacle4.png", name: "roadBlock_4", spriteConfig:[[0, 0, 121, 76, 0, 60, 38]]}],
			[{ path: "./sprites/game_bonus_invisible.png", name: "invisible", spriteConfig:[[0, 0, 82, 84, 0, 41, 42]]}],
			[{ path: "./sprites/jtm_reverse.png", name: "reverser", spriteConfig:[[0, 0, 170, 170, 0, 85, 85]]}]
		];
	
	/*
	GAME_DATA_INGAME = 			 // 赛道难度和相关数据配置，后面考虑放到json里面
		[
			// 简单模式
			[
				{
					// 刷新障碍的密度（即每隔多少距离刷新一堆障碍）
					obstacleCarDistance : 800,
					// 障碍之间的最小车距
					distanceBetweenCarsMin : 200,
					// 障碍之间的最大车距
					distanceBetweenCarsMax : 600,
					// 刷新车辆可能出现的车辆品种
					obstacleCarType: [0,1,2,3,4,5],
					// 刷新车辆可能出现的ROAD_FIX_POS组合
					obstacleCarShape: 
						[
							[0], [1], [2], [0,0], [1,1], [2,2]
						],
					// 刷新路障可能出现的路障编号
					obstacleRoadBlockInclude : [0,1],
					// 反转时间
					reverseTime : 5,
					// 无敌时间
					invisibleTime : 5
				}
			],
			// 中等模式
			[
				{
					// 刷新障碍的密度（即每隔多少距离刷新一堆障碍）
					obstacleCarDistance : 600,
					// 障碍之间的最小车距
					distanceBetweenCarsMin : 400,
					// 障碍之间的最大车距
					distanceBetweenCarsMax : 650,
					// 刷新障碍可能出现的车辆品种
					obstacleCarType: [0,1,2,3,4,5],
					// 刷新车辆可能出现的ROAD_FIX_POS组合
					obstacleCarShape: 
						[
							[0], [1], [2], [0,0], [1,1], [2,2], [0,1], [0,2], [1,2]
						],
					// 刷新路障可能出现的路障编号
					obstacleRoadBlockInclude : [0,1,2,3],
					// 反转时间
					reverseTime : 5,
					// 无敌时间
					invisibleTime : 5
				}
			],
			// 困难模式
			[
				{
					// 刷新障碍的密度（即每隔多少距离刷新一堆障碍）
					obstacleCarDistance : 300,
					// 障碍之间的最小车距
					distanceBetweenCarsMin : 200,
					// 障碍之间的最大车距
					distanceBetweenCarsMax : 300,
					// 刷新障碍可能出现的车辆品种
					obstacleCarType: [0,1,2,3,4,5],
					// 刷新障碍可能出现的ROAD_FIX_POS组合
					obstacleCarShape: 
						[
							[0], [1], [2], [0,0], [1,1], [2,2], [0,1], [0,2], [1,2]
						],
					// 刷新路障可能出现的路障编号
					obstacleRoadBlockInclude : [0,1],
					// 反转时间
					reverseTime : 5,
					// 无敌时间
					invisibleTime : 5
				}
			],
		];
	*/


function CGame() {
	var e = false,
    g_currentSpeed,		// 单位：GameSpeed //当前速度
	g_maxSpeed,			// 单位：GameSpeed //当前最大速度
	g_miles = 0,		// 单位：Miles     //当前速度
    p = 0,
    g_life, q, v = 0,
    B, x, s = [], n, r, button1, button2, button3, w, t, u, C, D, _helpPic, E;//,
	//gameContainer;
	
	var genericBlockStartPosY = INIT_GENERIC_OBSTACLE_POS_Y;
	var totalRunRoadLength = 0;
	
	var banner,
		reverseTimer,		
		reverseTime,			// 反转时间
		reverseText,
		invisibleTimer,
		invisibleTime,			// 无敌时间
		invisibleText,
		isSpeedUp = false,				// 是否加速状态
		killLength = KILL_LENGTH * (1 + Math.random() * .2), // 单位：Length //必杀与终点的实际距离
		killGenerated = false,			// 是否已生成必杀
		speedUpdateDistance,			// 单位：Miles     //每过多少公里最大速度提升
		objLayer,
		flag,
        flag618,
		roadMark,
		progressBar,			// 赛程进度
		speedText, fuelText;
		
    this._init = function() {
		//////console.debug("Difficulty: " + s_difficulty);
		//s_difficulty = GAME_DATA_DIFFICULTY; 
		
		//var tempW = CANVAS_WIDTH;
		//CANVAS_WIDTH = 768;
		
		//gameContainer = new createjs.Container;
		//s_oStage.addChild(gameContainer);
		this.resize();
		
        var a = new createjs.Shape;
        a.graphics.beginFill("#5B89A1").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(a);
        //B = new createjs.Bitmap(s_oSpriteLibrary.getSprite("bg_game"));
        //s_oStage.addChild(B);
        this._initLineObjects();
		
		a = s_oSpriteLibrary.getSprite("road_logo");
		roadMark = new CFlag(a);
        roadMark.move(- CANVAS_HEIGHT * .2 + 720);
        //console.debug("roadMark pos" + roadMark.getPos().y);

		
		objLayer = new createjs.Container;
		s_oStage.addChild(objLayer);
		
		g_life = 1;
        q = 1;
        //a = s_oSpriteLibrary.getSprite("hero");
		n = new CHero(ROAD_FIX_POS[q], s_oSpriteLibrary.getSprite("hero"), s_oSpriteLibrary.getSprite("effect_invisible"));
		
		a = s_oSpriteLibrary.getSprite("flag");
		flag = new CFlag(a);
        flag.move(- CANVAS_HEIGHT * .2 - 250);
        //console.debug("flag pos" + flag.getPos().y);

        a = s_oSpriteLibrary.getSprite("618flag");
        flag618 = new CFlag(a);
        flag618.move(- CANVAS_HEIGHT *.2 - 100);
        //console.debug("flag618 pos" + flag618.getPos().y);

		
		
        //a = new createjs.Shape;
        //a.graphics.beginFill("rgba(0,0,0,1)").drawRect(0, 0, CANVAS_WIDTH, 100);
		//a.graphics.beginFill("rgba(0,0,0,1)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT * .05);
        //s_oStage.addChild(a);
        //a = new createjs.Shape;
        //a.graphics.beginFill("rgba(0,0,0,1)").drawRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
		//a.graphics.beginFill("rgba(0,0,0,1)").drawRect(0, CANVAS_HEIGHT * .95, CANVAS_WIDTH, CANVAS_HEIGHT * .05);
        //s_oStage.addChild(a);
		
		banner = new createjs.Container;
		
		a = new createjs.Bitmap(s_oSpriteLibrary.getSprite("banner_bg"));
		banner.scaleX = banner.scaleY = CANVAS_WIDTH / a.getBounds().width;
        banner.addChild(a);
		
		progressBar = new createjs.Shape;
		progressBar.graphics.beginFill("rgba(244,222,2,1)").drawRect(0, 0, 1006, 8);
		banner.addChild(progressBar);
		progressBar.x = 160;
		progressBar.y = 88;
		progressBar.scaleX = 0;
		
		//s_oStage.addChild(banner);
		
		
		a = new createjs.Bitmap(s_oSpriteLibrary.getSprite("footer_bg"));
		a.scaleX = a.scaleY = CANVAS_WIDTH / a.getBounds().width;
		a.y = CANVAS_HEIGHT - a.getBounds().height * a.scaleY;
        s_oStage.addChild(a);
		
		
		/*
        a = s_oSpriteLibrary.getSprite("but_exit");
        x = new CGfxButton(CANVAS_WIDTH - CANVAS_HEIGHT * .025, CANVAS_HEIGHT * .025, CANVAS_HEIGHT * .04, CANVAS_HEIGHT * .04, a, !0);
        x.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        E = new CToggle(CANVAS_WIDTH - CANVAS_HEIGHT * .075, CANVAS_HEIGHT * .025, CANVAS_HEIGHT * .04, CANVAS_HEIGHT * .04, s_oSpriteLibrary.getSprite("audio_icon"), s_bAudioActive);
		E.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
		*/
		
        //a = s_oSpriteLibrary.getSprite("life");
        //a = new createjs.Bitmap(a);
        //a.x = 10;
        //a.y = 15;
        //s_oStage.addChild(a);
        t = new createjs.Text(/*TEXT_SCORE + ":*/ "0" + TEXT_KM, "bold 45px Arial", "#ffffff");
		t.scaleX = t.scaleY = CANVAS_HEIGHT * .03 / t.getBounds().height + .15;
        t.x = CANVAS_WIDTH / 2;
        t.y = CANVAS_HEIGHT * .005;
        t.textAlign = "center";
		s_oStage.addChild(t);
        
		fuelText = new createjs.Text("" + (s_oilLeft-1), "bold 30px Arial", "#ffffff");
		fuelText.scaleX = fuelText.scaleY = CANVAS_HEIGHT * .03 / fuelText.getBounds().height;
        fuelText.x = CANVAS_WIDTH * .2;
        fuelText.y = CANVAS_HEIGHT * .965;
        fuelText.textAlign = "center";
		s_oStage.addChild(fuelText);
		
		speedText = new createjs.Text("" + MAX_STARTING_SPEED * GAME_SPEED_RATE, "bold 30px Arial", "#ffffff");
		speedText.scaleX = speedText.scaleY = CANVAS_HEIGHT * .03 / speedText.getBounds().height;
        speedText.x = CANVAS_WIDTH * .78;
        speedText.y = CANVAS_HEIGHT * .965 - 1;
        speedText.textAlign = "right";
		s_oStage.addChild(speedText);
		
		//u = new createjs.Text("X", "bold 50px Arial", "#ffffff");
        //u.x = 130;
        //u.y = 30;
        //u.textAlign ="center";
		reverseText = new createjs.Text("反转", "bold 30px Arial", "#ffffff");
		reverseText.scaleX = reverseText.scaleY = CANVAS_HEIGHT * .03 / reverseText.getBounds().height;
        reverseText.x = CANVAS_WIDTH * .025;
        reverseText.y = CANVAS_HEIGHT * .01;
        reverseText.textAlign ="left";
		reverseText.visible = false;
		invisibleText = new createjs.Text("无敌", "bold 30px Arial", "#ffffff");
        invisibleText.scaleX = invisibleText.scaleY = CANVAS_HEIGHT * .03 / invisibleText.getBounds().height;
        invisibleText.x = CANVAS_WIDTH * .05 + reverseText.getBounds().width * reverseText.scaleX;
        invisibleText.y = CANVAS_HEIGHT * .01;
        invisibleText.textAlign ="left";
		invisibleText.visible = false;
        //s_oStage.addChild(invisibleText);
		//s_oStage.addChild(reverseText);
		//s_oStage.addChild(u);
        r = new createjs.Shape;
        r.graphics.beginFill("red").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        r.alpha = 0.1;
        r.visible = false;
        s_oStage.addChild(r);

        _helpPic = new CHelpPanel(s_oSpriteLibrary.getSprite("bg_help"));
        g_currentSpeed = MAX_STARTING_SPEED;
        g_maxSpeed = MAX_STARTING_SPEED;
		
		//CANVAS_WIDTH = tempW;
		reverseTimer = new Stopwatch();
		invisibleTimer = new Stopwatch();
		
		//////console.debug("g_miles: " + g_miles);
    };
	
	this.resize = function(){
		
		//alert(CANVAS_WIDTH);
		s_gameScale = CANVAS_WIDTH / 768;
		
		ROAD_FIX_POS = [Math.floor(CANVAS_WIDTH * .26), Math.floor(CANVAS_WIDTH * .52), Math.floor(CANVAS_WIDTH * .78)],  				// 赛道的三个固定点，用于刷其他车辆
		ROAD_FIX_BORDER = [Math.floor(CANVAS_WIDTH * .33), Math.floor(CANVAS_WIDTH * .67), CANVAS_WIDTH],				// 三个车道的边界坐标
		INIT_GENERIC_OBSTACLE_POS_Y = -300 * s_gameScale;				// 一开始进行障碍物生成的基准坐标y
		//GENERIC_OBSTACLE_ROAD_LENGTH = 2000 * s_gameScale;            // 每一次进行障碍物生成时，最多生成多少距离后的障碍
		REDUCE_SPEED = 20 * s_gameScale;                              // 撞上障碍之后降低的速度
		MIN_SELF_SPEED = 2 * s_gameScale;                             // 自己车辆的最低速度，无论撞击多少障碍都不会比这个速度小
		SELF_ACCELLERATION = 0.2;                       			// 自己车辆在撞击之后的加速度
		speedUpdateDistance = Math.floor(GAME_DATA_INGAME[s_difficulty][0].speedUpdateDistance * s_gameScale);                      	// 每过多少公里最大速度提升
	}
	
    this.unload = function() {
        //x.unload();
        //x = null;
		
		D.unload();
		D = null;
		
		banner.removeAllChildren();
		banner = null;
		
		n.unload();
		
		objLayer.removeAllChildren();
        s_oStage.removeAllChildren();
		//s_oStage.removeChild(gameContainer);
		//gameContainer = null;
    };
	
	this.addObjToLayer = function(sprite) {
		objLayer.addChild(sprite);
	}
	
	this.removeObjFromLayer = function(sprite) {
		objLayer.removeChild(sprite);
        sprite = null;
	}
	
    this._onExitHelp = function() {
        _helpPic.unload();
        s_oStage.removeChild(_helpPic);
        e = !0
    };
    this._initLineObjects = function() {
        var a = s_oSpriteLibrary.getSprite("road_tile");
        D = new CScrollingBg(a)
    };
	this._addObstacleToCache = function(obs){
		for(var i = 0; i < s.length; ++i)
		{
			if (s[i] == null)
			{
				s[i] = obs;
				return;
			}
		}
		s.push(obs);
	};
	this._initObstacleCars = function(startPosY, genericObstacleRoadLength) {
		// 车辆障碍相关定义
		var obstaclePosInfo = GAME_DATA_INGAME[s_difficulty][0].obstacleCarShape;
		var obstacleDistanceMin = GAME_DATA_INGAME[s_difficulty][0].distanceBetweenCarsMin * s_gameScale;
		var obstacleDistanceMax = GAME_DATA_INGAME[s_difficulty][0].distanceBetweenCarsMax * s_gameScale;
		var obstacleShapeDistance = GAME_DATA_INGAME[s_difficulty][0].obstacleCarDistance * s_gameScale;
		var obstacleCarTypes = GAME_DATA_INGAME[s_difficulty][0].obstacleCarType;
		var obstacleRate = GAME_DATA_INGAME[s_difficulty][0].obstacleRate;
		reverseTime = GAME_DATA_INGAME[s_difficulty][0].reverseTime;
		invisibleTime = GAME_DATA_INGAME[s_difficulty][0].invisibleTime;
		var carEnemyPic = s_oSpriteLibrary.getSprite("enemy");
		var carSpriteSheetImages = [carEnemyPic];
		var carSpriteSheetFrames = [];
		for(var i = 0; i < obstacleCarTypes.length; ++i)
		{
			carSpriteSheetFrames[i] = ENEMY_CAR_SPRITE_CONFIG[obstacleCarTypes[i]];
		}
		var enemyCarSpriteSheet = new createjs.SpriteSheet({images: carSpriteSheetImages, frames: carSpriteSheetFrames});
		
		// 路障相关定义
		var obstacleRoadBlockTypes = GAME_DATA_INGAME[s_difficulty][0].obstacleRoadBlockInclude;
		
		var obstacleStartPosY = startPosY;
		var currObstacleShapePosY = 0;
		while(obstacleStartPosY >= startPosY - obstacleShapeDistance)//genericObstacleRoadLength)
		{
			// 挑选一个车辆组合
			var obstacleShape = obstaclePosInfo[Math.floor(Math.random()*(obstaclePosInfo.length))];
			// 将车辆刷新到组合对应的位置上
			for(var i = 0; i < obstacleShape.length; ++i)
			{
				var posX = ROAD_FIX_POS[obstacleShape[i]];
				var posY = (i === 0 ? 
					obstacleStartPosY : 
					obstacleStartPosY - Math.floor(Math.random()*(obstacleDistanceMax-obstacleDistanceMin+1)+obstacleDistanceMin));
				if (posY < currObstacleShapePosY)
					currObstacleShapePosY = posY;
				// 决定是刷车辆还是路障
				//var freshType = Math.floor(Math.random()*2);
				var freshType = this._generateByRate(obstacleRate);
				if (0 === freshType)
				{
					var g = new CObstacleCar(posX, posY, enemyCarSpriteSheet, "Car");
					this._addObstacleToCache(g);
					//////console.debug("+Car " + posY);
				}
				else
				{
					// 挑选一个路障
					//var obstacleRoadBlockIndex = obstacleRoadBlockTypes[Math.floor(Math.random() *(obstacleRoadBlockTypes.length))];
					var obstacleRoadBlockIndex = freshType - 1;
					var obstacleRoadBlockType = ROAD_BLOCK_CONFIG[obstacleRoadBlockTypes[obstacleRoadBlockIndex]];
					
					// 太靠近终点不刷无敌
					noInvisibleLength = killLength + invisibleTime * INVISIBLE_SPEED * 60 * 2;//2为缓冲估计值，可多不可少
					if (obstacleRoadBlockType[0].name == "invisible")
					{
						if (s_roadLength - g_miles * GAME_MILES_RATE <= noInvisibleLength)
						{
							//////console.debug("stop generate invisible " + (invisibleTime * INVISIBLE_SPEED * 60 * 2));
							break;
						}
					}
					
					// 根据路障获取createjs.sprite
					var roadBlockEnemyPic = s_oSpriteLibrary.getSprite(obstacleRoadBlockType[0].name);
					var roadBlockSpriteSheetImages = [roadBlockEnemyPic];
					var roadBlockSpriteSheetFrames = obstacleRoadBlockType[0].spriteConfig;
					var enemyRoadBlockSpriteSheet = new createjs.SpriteSheet({images: roadBlockSpriteSheetImages, frames: roadBlockSpriteSheetFrames});
			
					// 将路障刷新到组合对应的位置上
					var g = new CObstacleCar(posX, posY, enemyRoadBlockSpriteSheet, obstacleRoadBlockType[0].name);
					this._addObstacleToCache(g);
				}
			}
			obstacleStartPosY = -(Math.abs(currObstacleShapePosY)+obstacleShapeDistance);
		}
		return obstacleStartPosY;
	};
	
	this._initObstacleCars2 = function(startPosY) {
		// 车辆障碍相关定义
		var obstaclePosInfo = GAME_DATA_INGAME[s_difficulty][0].obstacleCarShape;
		var obstacleDistanceMin = GAME_DATA_INGAME[s_difficulty][0].distanceBetweenCarsMin * s_gameScale;
		var obstacleDistanceMax = GAME_DATA_INGAME[s_difficulty][0].distanceBetweenCarsMax * s_gameScale;
		var obstacleShapeDistance = GAME_DATA_INGAME[s_difficulty][0].obstacleCarDistance * s_gameScale;
		var obstacleCarTypes = GAME_DATA_INGAME[s_difficulty][0].obstacleCarType;
		var obstacleRate = GAME_DATA_INGAME[s_difficulty][0].obstacleRate;
		reverseTime = GAME_DATA_INGAME[s_difficulty][0].reverseTime;
		invisibleTime = GAME_DATA_INGAME[s_difficulty][0].invisibleTime;
		var carEnemyPic = s_oSpriteLibrary.getSprite("enemy");
		var carSpriteSheetImages = [carEnemyPic];
		var carSpriteSheetFrames = [];
		for(var i = 0; i < obstacleCarTypes.length; ++i)
		{
			carSpriteSheetFrames[i] = ENEMY_CAR_SPRITE_CONFIG[obstacleCarTypes[i]];
		}
		var enemyCarSpriteSheet = new createjs.SpriteSheet({images: carSpriteSheetImages, frames: carSpriteSheetFrames});
		
		// 路障相关定义
		var obstacleRoadBlockTypes = GAME_DATA_INGAME[s_difficulty][0].obstacleRoadBlockInclude;
		
		var obstacleStartPosY = startPosY;
		var currObstacleShapePosY = 0;
		
		// 3车随机距离
		var randomDistance = 400;
		// 3车刷新位置
		var oriY = -1000;
		
		for (var a = 0; a < s.length; a++) 
		{
			if (s[a] != null)
			{
				if (s[a].getObstracleType() == "Car" && s[a].getY() < oriY + 1000 && s[a].getY() > oriY - randomDistance - 1000)
				{
					s[a].reset();
					s[a] = null;
				}
			}
		}
		//alert(minY);
		
		// 挑选一个车辆组合
		var obstacleShape = obstaclePosInfo[Math.floor(Math.random()*(obstaclePosInfo.length))];
		// 将车辆刷新到组合对应的位置上
		var modeRandom = Math.floor(Math.random()* KILLER_Y_MODE.length);
        for(var i = 0; i < 3; ++i)
		{
			var posX = ROAD_FIX_POS[i];
			/*var posY = (i === 0 ? 
				obstacleStartPosY : 
				obstacleStartPosY - Math.floor(Math.random()*(obstacleDistanceMax-obstacleDistanceMin+1)+obstacleDistanceMin));
			if (posY < currObstacleShapePosY)
				currObstacleShapePosY = posY;*/
			var posY = 0;

            //posY = (oriY - Math.random() * randomDistance) * s_gameScale;
			posY = (oriY - KILLER_Y_MODE[modeRandom][i]) * s_gameScale;
			
			//////console.debug("3Cars:" + posY);
			var g = new CObstacleCar(posX, posY, enemyCarSpriteSheet, "Car");
			this._addObstacleToCache(g);
			
		}
		
	};
	
	this._generateByRate = function(rateList) {
		var pt = Math.random();
		for(var i = 0; i < rateList.length; ++i)
		{
			if (pt < rateList[i])
			{
				return i
			}
		}
		
		return rateList.length;
	}
	
    this._increaseScore = function() {
        g_miles += g_currentSpeed / GAME_TIME_RATE;//SCORE_INCREASE; toDecimal2(
        t.text = /*TEXT_SCORE + ": " + */ Math.floor(g_miles/2 * 1000)  + TEXT_KM; // Math.floor(g_miles)*10 GAME_MILES_RATE * / 10
		//////console.debug("Progress:" + (g_miles * GAME_MILES_RATE) + " " + s_roadLength);
		//progressBar.scaleX = (g_miles * GAME_MILES_RATE / s_roadLength < 1) ? g_miles * GAME_MILES_RATE / s_roadLength : 1;
		speedText.text = Math.floor(g_currentSpeed * GAME_SPEED_RATE);
        //p += SCORE_INCREASE;
        //p > INCREASE_SPEED_UP_INTERVAL && (p = 0, g_currentSpeed += INCREASE_SPEED)
    };
    this._lifeLost = function(vv) {
        if (invisibleTimer.isRunning()) return;
		var a = this;
		if (vv.getObstracleType() == "invisible")
		{	
			invisibleTimer.start();
			invisibleTimer.reset();
			
			n.setEffect("invisible");
			invisibleText.visible = true;
		}else
		{
			r.visible = true;			
			if (vv.getObstracleType() == "reverser")
			{
				reverseTimer.isRunning() || reverseTimer.start();
				reverseTimer.reset();
				
				reverseText.visible = true;
			}
			
			//碰撞路障或车
			createjs.Tween.get(r).to({
				alpha: 0.6
			}, 400).call(function() {
				a._resetHurt()
			});
			g_miles -= MALUS_SCORE;
			0 > g_miles && (g_miles = 0);
			//t.text = /*TEXT_SCORE + ": " + */ Math.floor(g_miles ) + TEXT_KM; //* GAME_MILES_RATE * 10) / 10
			//createjs.Sound.play("crash");
			if ( null != vv && vv.getObstracleType() == "Car" )
				g_life --;
			//u.text = "X" + l;
			0 === g_life && this._gameOver(false)
		}
    };
    this._resetHurt = function() {
        r.visible = false;
        r.alpha = 0.5
    };
    this._gameOver = function (isWin) {

        e = false;
        var self = this;
		if (isWin)
		{
			//g_miles = s_roadLength;
			progressBar.scaleX = 1;
			//t.text = /*TEXT_SCORE + ": " + */ Math.floor(s_roadLength * 10) / 10 + TEXT_KM;
		}

        //if (!g_overFrame)
        //    g_overFrame = new showEndGame();

		if (s_onLine)
		{
			s_oRequestManager.sendRealRequest("theCarRaceGameOver", g_sid, 'body={"roadId":"'
            + s_roadId + '","gameDate":"' + getTodayDate() + '","vol":1,"mileage":' + Math.floor( g_miles/2 * 1000) +'}', function (json) {

                showEndGame(json, Math.floor(g_miles/2*1000));
                //g_overFrame.show(json, Math.floor(g_miles/2 * 1000));
		        });
		}else
		{
            showEndGame(null, Math.floor(g_miles/2 * 1000));
		}
	};
	
	this.exitByServer = function(dataObj) {
    //    if (dataObj && g_overFrame)
    //        showMilesData(dataObj, Math.floor(g_miles/2 * 1000));
    };
	/*
    this._onReleaseLeft = function() {
        0 === q || (q--, n.move(ROAD_FIX_POS[q]), createjs.Sound.play("steer"))
    };
    this._onReleaseRight = function() {
        q === NUM_LINES || (q++, n.move(ROAD_FIX_POS[q]), createjs.Sound.play("steer"))
    };
	this._onReleaseMiddle = function(){
		(q < 1 && this._onReleaseRight()) || (q > 1 && this._onReleaseLeft());
	};
	*/
	
	this.moveCar = function(dir) {
		if (dir == "left")
		{
			0 === q || (q--, n.move(ROAD_FIX_POS[q]));//(q--, n.move(ROAD_FIX_POS[q]), createjs.Sound.play("steer"));
		}else if (dir == "right")
		{
			q === NUM_LINES || (q++, n.move(ROAD_FIX_POS[q]));//, createjs.Sound.play("steer")
		}
	}
	
	this.dragCar = function(x) {
		for (var i = 0; i < ROAD_FIX_BORDER.length; i++)
		{
			if (x <= ROAD_FIX_BORDER[i])
			{
				reverseTimer.isRunning() && (i = ROAD_FIX_BORDER.length - 1 - i);
				if (q != i)
				{
					q = i;
					n.move(ROAD_FIX_POS[q]);
					//createjs.Sound.play("steer");
				}
				break;
			}
		}
	}
	/*
	this.moveHeroRoadXPosByClickPos = function(clickRoadLine){
		if (e === true)
		{
			q < clickRoadLine && this.moveCar("right");//this._onReleaseRight();
			q > clickRoadLine && this.moveCar("left");//this._onReleaseLeft();
		}
	};
	*/
	this._onEndMoveLeft = function()
	{
		n.stopMoveLeftOrRight();
	}
	this._onEndMoveRight = function()
	{
		n.stopMoveLeftOrRight();
	}
    this._onExit =
        function() {
            this.unload();
            s_oMain.gotoMenu();
            $(s_oMain).trigger("restart")
        };
    this._onAudioToggle = function() {
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    };
    this._checkCollision = function(a) {
        var selfPos = n.getPos(),
            obstaclePos = a.getPos();
		var selfRect = { width : n.getWidth(), height:n.getHeight()},
			obstacleRect = { width : a.getWidth(), height : a.getHeight()};
		var obstacleXRange = { min : obstaclePos.x - obstacleRect.width / 2, max : obstaclePos.x + obstacleRect.width / 2 },
			obstacleYRange = { min : obstaclePos.y - obstacleRect.height / 2, max : obstaclePos.y + obstacleRect.height / 2};
		var selfXRange = { min : selfPos.x - selfRect.width / 2, max : selfPos.x + selfRect.width / 2},
			selfYRange = { min : selfPos.y - selfRect.height / 2, max : selfPos.y + selfRect.height / 2};
		var notCollsion = selfXRange.max < obstacleXRange.min || selfXRange.min > obstacleXRange.max || selfYRange.max < obstacleYRange.min || selfYRange.min > obstacleYRange.max;
		
        if (notCollsion === false && a.getObstracleType() !== "Car" && a.getObstracleType() !== "invisible" && !invisibleTimer.isRunning())
        {
            g_currentSpeed -= REDUCE_SPEED;
			if (g_currentSpeed < 0)
				g_currentSpeed = 0;
        }

        return !notCollsion;
    };
    this._updateMove = function() {
		
		/*
		if (g_miles%MAX_SPEED_UPDATE_FREQ === 0 && g_miles !== 0)
		{
			g_maxSpeed += ACCELLERATION;
			flag.move();
		}
		*/
		var tmp = g_maxSpeed;
		g_maxSpeed = MAX_STARTING_SPEED + Math.floor(g_miles / speedUpdateDistance) * SPEED_STEP;//ACCELLERATION;
		
		if (tmp < g_maxSpeed){
			////console.debug("SpeedChange:" + tmp + " " + g_maxSpeed);
			//roadMark.move(0);
		}
		
		if (isSpeedUp)//invisibleTimer.isRunning() )
		{
			
			g_currentSpeed = (g_maxSpeed + SPEED_STEP > INVISIBLE_SPEED) ? g_maxSpeed + SPEED_STEP : INVISIBLE_SPEED;
		}else
		{
			if (g_currentSpeed < g_maxSpeed)
			{
				g_currentSpeed = g_currentSpeed + SELF_ACCELLERATION < g_maxSpeed ? g_currentSpeed + SELF_ACCELLERATION : g_maxSpeed;
			}else
			{
				g_currentSpeed = g_maxSpeed;
			}
		}
		totalRunRoadLength += g_currentSpeed;
        n.update();
        D.update(Math.floor(g_currentSpeed));
		flag.update(Math.floor(g_currentSpeed));
        flag618.update(Math.floor(g_currentSpeed));
		roadMark.update(Math.floor(g_currentSpeed));
    };
    this.updateObstacles = function() {
        for (var a = 0; a < s.length; a++) 
		{
			if (s[a] != null)
			{
				if (s[a].getObstracleType() == "Car")
				{
					s[a].update(g_currentSpeed * s_fCurForceFactor);
				}
				else
				{
					s[a].update(g_currentSpeed);
				}

				this._checkCollision(s[a]) ? (this._lifeLost(s[a]), s[a].reset(), s[a]=null ) : s[a].getFront() > CANVAS_HEIGHT && (s[a].reset(), s[a]=null);
			}
		}
		var comparePosY = Math.abs(genericBlockStartPosY)
		/*
		if (totalRunRoadLength + CANVAS_HEIGHT >= comparePosY)
		{
			genericBlockStartPosY = this._initObstacleCars(genericBlockStartPosY, GENERIC_OBSTACLE_ROAD_LENGTH);
		}
		*/
		
		if (s_roadLength - g_miles * GAME_MILES_RATE <= killLength && !killGenerated)
		{
			//必杀
			////console.debug("generate killer");
			killGenerated = true;
			this._initObstacleCars2(genericBlockStartPosY);
		}else if (totalRunRoadLength + CANVAS_HEIGHT >= comparePosY && !killGenerated)
		{
			//正常刷障碍和车
			genericBlockStartPosY = this._initObstacleCars(genericBlockStartPosY, GENERIC_OBSTACLE_ROAD_LENGTH);
		}
    };
    this.update = function(){
		
		if (reverseTimer && reverseTimer.isRunning() && reverseTimer.getElapsedTime() > reverseTime * 1000) 
		{
			reverseTimer.stop();
			reverseText.visible = false;
		}
		
		var speedUpTime = Math.max((invisibleTime - INVISIBLE_END_TIME), 0);
		isSpeedUp = (invisibleTimer && invisibleTimer.isRunning() && !(invisibleTimer.getElapsedTime() > speedUpTime * 1000));
			
		if (invisibleTimer && invisibleTimer.isRunning() && invisibleTimer.getElapsedTime() > invisibleTime * 1000) 
		{
			n.setEffect("");
			invisibleTimer.stop();
			invisibleText.visible = false;
		}

		
		// if (UpdateCountRecord == 2)
        // {
		if (false !== e)
		{
			this._updateMove();
			
			if (g_miles * GAME_MILES_RATE >= s_roadLength)
			{
				this._gameOver(true);
				return;
			}
			this.updateObstacles();
			v += s_iTimeElaps;
			if (1E3 <= v)
			{
				v -= 1E3;
				this._increaseScore();
			}
		}
        //     UpdateCountRecord = 0;
        // }
        // else
        // {
        //     UpdateCountRecord++;
        // }
		
    };
    s_oGame = this;
    this._init()
	
	
}
function CFlag(bmd){
	
	var isMoving = false;
	var isLock = false;
	var sprite;
	
	this._init = function(bmd) {
		sprite = new createjs.Bitmap(bmd);
		sprite.scaleX = sprite.scaleY = CANVAS_WIDTH / sprite.getBounds().width;
		s_oStage.addChild(sprite);
		sprite.y = - sprite.getBounds().height * sprite.scaleY;
	}
	
	this.move = function (y) {
		isMoving = true;
		if (y <= 0) sprite.y = - sprite.getBounds().height * sprite.scaleY - y;
	}
	
	this.update = function(speed) {
		if (isMoving)
		{
			sprite.y += Math.floor(speed);
			
			if (sprite.y > CANVAS_HEIGHT + Math.floor(speed))
			{
				isMoving = false;
				sprite.y = - sprite.getBounds().height * sprite.scaleY;
			}
		}
	}
	this._init(bmd);
}

function CEndPanel(a) {
    var b, d, e, h, f, c;
    this._init = function(a) {
        b = new createjs.Bitmap(a);
        b.x = 0;
        //b.y = 0;
		b.y = CANVAS_HEIGHT / 2 - b.getBounds().height * s_gameScale / 2;
		b.scaleX = b.scaleY = s_gameScale;
        f = new createjs.Text("", "bold 80px Arial", "#000");
        f.x = CANVAS_WIDTH / 2 + 2;
        f.y = CANVAS_HEIGHT / 2 - 98;
        f.textAlign = "center";
        h = new createjs.Text("", "bold 80px Arial", "#ffffff");
        h.x = CANVAS_WIDTH / 2;
        h.y = CANVAS_HEIGHT / 2 - 100;
        h.textAlign = "center";
        d = new createjs.Text("", "bold 50px Arial", "#000");
        d.x = CANVAS_WIDTH / 2 + 2;
        d.y = CANVAS_HEIGHT / 2 + 22;
        d.textAlign = "center";
        e = new createjs.Text("", "bold 50px Arial", "#ffffff");
        e.x = CANVAS_WIDTH /
            2;
        e.y = CANVAS_HEIGHT / 2 + 20;
        e.textAlign = "center";
        c = new createjs.Container;
        c.alpha = 0;
        c.visible = !1;
        c.addChild(b, d, e, f, h);
        s_oStage.addChild(c)
    };
    this._initListener = function() {
        c.on("mousedown", this._onExit)
    };
    this.show = function(a, isWin) {
		
        f.text = isWin ? "胜利" : "失败";//TEXT_GAME_OVER;
        h.text = isWin ? "胜利" : "失败";//TEXT_GAME_OVER;
        d.text = isWin ? s_roadLength + TEXT_KM : /*TEXT_SCORE + ": " + */Math.floor(a * GAME_MILES_RATE * 10) / 10 + TEXT_KM;
        e.text = isWin ? s_roadLength + TEXT_KM : /*TEXT_SCORE + ": " + */Math.floor(a * GAME_MILES_RATE * 10) / 10 + TEXT_KM;
        c.visible = !0;
        var b = this;
        createjs.Tween.get(c).to({
            alpha: 1
        }, 500).call(function() {
            b._initListener()
        });
        $(s_oMain).trigger("save_score", a)
    };
    this._onExit = function() {
        c.off("mousedown");
        s_oGame._onExit()
    };
    this._init(a)
}

function CSpriteLibrary() {
    var spriteCache, currAddSpriteNum, currLoadedFileNum, onImgLoaded, onAllPreloaderImagesLoaded, mainHandler;
    this.init = function(_onImgLoaded, _onAllImagesLoaded, _mainHandler) {
        currLoadedFileNum = currAddSpriteNum = 0;
        onImgLoaded = _onImgLoaded;
        onAllPreloaderImagesLoaded = _onAllImagesLoaded;
        mainHandler = _mainHandler;
        spriteCache = {}
    };
    this.addSprite = function(spriteName, spritePath) {
        spriteCache.hasOwnProperty(spriteName) || (spriteCache[spriteName] = {
            szPath: spritePath,
            oSprite: new Image
        }, currAddSpriteNum++)
    };
    this.getSprite = function(c) {
        return spriteCache.hasOwnProperty(c) ? spriteCache[c].oSprite : null
    };
    this._onSpritesLoaded = function() {
        onAllPreloaderImagesLoaded.call(mainHandler)
    };
    this._onSpriteLoaded = function() {
        onImgLoaded.call(mainHandler);
        ++currLoadedFileNum == currAddSpriteNum && this._onSpritesLoaded()
    };
    this.loadSprites = function() {
        for (var item in spriteCache) 
		{
			spriteCache[item].oSprite.oSpriteLibrary = this, 
			spriteCache[item].oSprite.onload = function() {
                this.oSpriteLibrary._onSpriteLoaded()
            }, spriteCache[item].oSprite.src =
            spriteCache[item].szPath
		}
    };
    this.getNumSprites = function() {
        return currAddSpriteNum
    }
}

function trace(a) {
    console.log(a)
}
/*
window.addEventListener("orientationchange", onOrientationChange);

function onOrientationChange() {
    window.matchMedia("(orientation: portrait)").matches && sizeHandler();
    window.matchMedia("(orientation: landscape)").matches && sizeHandler()
}
*/
function sizeHandler() {
    window.scrollTo(0, 1);
    if (s_oMain)
	{
		////console.debug("Resize");
		s_oMain.resize();
	}
	/*
	if ($("#canvas")) {
        var a = CANVAS_WIDTH,
            b = CANVAS_HEIGHT,
            d = window.innerWidth;
        s_multiplier = Math.min(window.innerHeight / b, d / a);
        a *= s_multiplier;
        b *= s_multiplier;
        $("#canvas").css("width", a + "px");
        $("#canvas").css("height", b + "px");
        $("#canvas").css("left", d / 2 - a / 2 + "px")
    }
	*/
}

/*
function canvasEventHandler(){
	var isMobile = jQuery.browser.mobile;
	var eventName = isMobile === true ? "click" : "mousedown";
	$("#canvas").bind(eventName, function(event){
		if (s_oGame != null)
		{
			var clickPosX = event.offsetX / s_multiplier;
			for(var i = 0; i <ROAD_FIX_BORDER.length; ++i)
			{
				if (clickPosX <= ROAD_FIX_BORDER[i])
				{
					s_heroMovePos = i;
					break;
				}	
			}
		
			if (s_heroMovePos === -1)
				s_heroMovePos = ROAD_FIX_BORDER.length - 1;
		
			s_oGame.moveHeroRoadXPosByClickPos(s_heroMovePos);
		}
	})
}
*/
function randomFloatBetween(a, b, d) {
    "undefined" === typeof d && (d = 2);
    return parseFloat(Math.min(a + Math.random() * (b - a), b).toFixed(d))
}

function shuffle(a) {
    for (var b = a.length, d, e; 0 !== b;) e = Math.floor(Math.random() * b), b -= 1, d = a[b], a[b] = a[e], a[e] = d;
    return a
}

function CScrollingBg(a) {
    var b, d, e, scale;
    this._init = function(a) {
        e = a;
        d = [];
		scale = CANVAS_WIDTH / a.width;
		s_mapLength = 0;
        //for (var f = -a.height; f < CANVAS_HEIGHT;f += a.height) {
		for (var i = 0; i < 2; i++) {
            var c = new createjs.Bitmap(a);
            c.scaleX = c.scaleY = scale//s_gameScale;
			//c.y = f * s_gameScale;
			c.y = a.height * i * scale;//s_gameScale;
            d.push(c);
            s_oStage.addChild(c);
			
			s_mapLength++;
        }
        b = 0
		
		//this.resize(a);
    };
	
	this.unload = function() {
		d = null;
		e = null;
	}
	
	this.resize = function(a) {
		for (var i = 0; i < d.length; i++) {
			d[i].scaleX = d[i].scaleY = CANVAS_WIDTH / a.width;
		}
	};
	
    this.update = function(a) {
        //for (var f = 0; f < d.length; f++) d[f].y > CANVAS_HEIGHT && (d[f].y = d[b].y - e.height, b = f), d[f].y += a
		//for (var f = 0; f < d.length; f++) d[f].y > CANVAS_HEIGHT && (d[f].y = d[b].y - e.height * s_gameScale, b = f), d[f].y += a
		for (var f = 0; f < d.length; f++) d[f].y > CANVAS_HEIGHT && (d[f].y = d[b].y - e.height * scale, b = f), d[f].y += a
    };
    this._init(a)
}

function CPreloader() {
    var a;
    this._init = function() {
        this._onAllPreloaderImagesLoaded()
    };
    this._onPreloaderImagesLoaded = function() {};
    this._onAllPreloaderImagesLoaded = function() {
        a = new createjs.Text("加载中...", "bold 42px Arial center", "#ffffff");
        a.x = CANVAS_WIDTH / 2 - 40;
        a.y = CANVAS_HEIGHT / 2;
        s_oStage.addChild(a)
    };
    this.unload = function() {
        s_oStage.removeChild(a)
    };
    this.refreshLoader = function(b) {
        a.text = b + "%"
    };
    this._init()
}

function CObstacleCar(_spritePosX, _spritePosY, _spriteSheet, _obstracleType) {
    var e, obstacleMoveSpeed, spriteSheet, sprite, spriteIndex, obstracleType;
    this._init = function(_spritePosX, _spritePosY, _spriteSheet, _obstracleType) {
		if (_obstracleType == "Car")
		{
			obstacleMoveSpeed = -2;
		}
		else
		{
			obstacleMoveSpeed = 0;
		}
        spriteSheet = _spriteSheet;
        spriteIndex = Math.floor((spriteSheet.getNumFrames()) * Math.random());
        sprite = new createjs.Sprite(spriteSheet, spriteIndex);
        sprite.stop();
        sprite.x = _spritePosX;
        sprite.y = _spritePosY;
		sprite.scaleX = sprite.scaleY = s_gameScale;
        //s_oStage.addChildAt(sprite, 5 + s_mapLength);
		s_oGame.addObjToLayer(sprite);
		obstracleType = _obstracleType;
        e = 100;
    };
    this.reset = function() {
		// 将sprite设置在看不见的地方
        sprite.y = 2000;
		s_oGame.removeObjFromLayer(sprite);
    };
    this.getPos = function() {
        return {
            x: sprite.x,
            y: sprite.y
        }
    };
    this.getY = function() {
        return sprite.y;
    };
    this.getFront = function() {
        return sprite.y - e * s_gameScale;
    };
	this.getWidth = function(){
		var rect = spriteSheet.getFrameBounds(spriteIndex);
		return rect.width * s_gameScale;
	};
	this.getHeight = function(){
		var rect = spriteSheet.getFrameBounds(spriteIndex);
		return rect.height * s_gameScale;
	};
    this.isActive = function() {
        return true;
    };
    this.update = function(a) {
        sprite.y += a + obstacleMoveSpeed * s_gameScale;
    };
    this.getObstracleType = function(){
        return obstracleType;
    };
    this._init(_spritePosX, _spritePosY, _spriteSheet, _obstracleType)
}
/*
function CMenu() {
    var a, b, d;
    this._init = function() {
        a = new createjs.Bitmap(s_oSpriteLibrary.getSprite("bg_menu"));
        s_oStage.addChild(a);
		
		var e = s_oSpriteLibrary.getSprite("but_play");
        b = new CTextButton(CANVAS_WIDTH / 2 + 120, CANVAS_HEIGHT / 2 + 60, e, TEXT_PLAY, "Arial", "#000000", 42);
        b.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
		
		//_oAudioToggle = new CToggle(CANVAS_WIDTH - 60, 60, s_oSpriteLibrary.getSprite("audio_icon"), s_bAudioActive), _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
		_oAudioToggle = new CToggle(CANVAS_WIDTH - 60, 60, s_oSpriteLibrary.getSprite("audio_icon"), s_bAudioActive), _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
		
		//d = new createjs.Shape;
        //s_oStage.addChild(d);
		
		this.resize();
    };
	
	this.resize = function() {
		a.scaleX = CANVAS_WIDTH / 768//a.sourceRect.width;
		a.scaleY = a.scaleX;//CANVAS_HEIGHT / 1024//a.sourceRect.height;
		//////console.debug("Scale: " + CANVAS_WIDTH + " " + a.sourceRect.width + " " + CANVAS_HEIGHT + " " + a.sourceRect.height);
		
		b.resize(CANVAS_WIDTH / 2 + 120, CANVAS_HEIGHT / 2 + 60, 42);
        
		_oAudioToggle.resize(CANVAS_WIDTH - 60, 60, s_oSpriteLibrary.getSprite("audio_icon"), s_bAudioActive);
		
		
		if (d && s_oStage) s_oStage.removeChild(d);
		d = new createjs.Shape;
		//d.clear();
        d.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(d);
		
		createjs.Tween.get(d).to({
            alpha: 0
        }, 1E3).call(function() {
            d.visible = !1
        });
	}
	
    this.unload = function() {
        b.unload();
        b = null;
        s_oStage.removeChild(a);
        a = null
    };
    this._onButPlayRelease = function() {
        this.unload();
        s_oMain.gotoGame()
    };
    this._onAudioToggle = function() {
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    };
	s_oMenu = this;
    this._init()
}
*/
function CMain() {
    var currLoadedFileNum = 0,
        totalFileNum = 0, currState = STATE_LOADING,
        preLoader, gameHandler,
		realStage;
    //用于保存theCarRaceInitExecute的结果
    var initGameByServerResult;

    this.initContainer = function() {
        var a = document.getElementById("canvas");
        realStage = new createjs.Stage(a);
		s_oStage = new createjs.Container();
		realStage.addChild(s_oStage);
        createjs.Touch.enable(realStage);
        s_bMobile = jQuery.browser.mobile;
        s_iPrevTime = (new Date).getTime();
        createjs.Ticker.setFPS(60);	//帧率
        createjs.Ticker.addEventListener("tick", this._update);
        s_oSpriteLibrary = new CSpriteLibrary;
        preLoader = new CPreloader;
        !1 === s_bMobile && (realStage.enableMouseOver(20));
		//this._initSounds();
        this._loadImages();
		
		this.resize();

        //s_oAsynRequestManager = new CAsynRequestManager();
		s_oRequestManager = new CRequestManager();
    };
	
	// Kevin：自适应
	this.resize = function(){
		
		CANVAS_WIDTH = window.innerWidth;//screen.width;//document.body.clientWidth;
		CANVAS_HEIGHT = window.innerHeight;//screen.height;//document.body.clientHeight;
		////console.debug("Size: " + CANVAS_WIDTH + " " + CANVAS_HEIGHT + " " + window.innerWidth + " " + window.innerHeight);
		canvas.width = CANVAS_WIDTH;
		canvas.height = CANVAS_HEIGHT;
		
		if (s_oGame) s_oGame.resize();
		if (s_oMenu) s_oMenu.resize(); 
	}
	
    this._initSounds = function() {
   //      createjs.Sound.initializeDefaultPlugins() &&
   //          (createjs.Sound.alternateExtensions = ["ogg"], 
			// createjs.Sound.addEventListener("fileload", createjs.proxy(this.handleFileLoad, this)), 
			// createjs.Sound.registerSound("./sounds/soundtrack.mp3", "soundtrack"), 
			// createjs.Sound.registerSound("./sounds/jump.mp3", "jump"), 
			// createjs.Sound.registerSound("./sounds/jump_end.mp3", "jump_end"), 
			// createjs.Sound.registerSound("./sounds/crash.mp3", "crash"), 
			// createjs.Sound.registerSound("./sounds/steer.mp3", "steer"), 
			// totalFileNum += 5)
    };
    this.handleFileLoad = function() {
        currLoadedFileNum++;
        currLoadedFileNum === totalFileNum && (preLoader.unload(),
			// (s_oSoundTrackSnd = createjs.Sound.play("soundtrack", {
   //              interrupt: createjs.Sound.INTERRUPT_ANY,
   //              loop: -1,
   //              volume: 0.5 
   //          })),
			this.gotoMenu())
			//this.gotoGame())
    };
    this._loadImages = function() {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
        //s_oSpriteLibrary.addSprite("but_play", "./sprites/bt_play.png");
        //s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        //s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_help", "./sprites/game_help_panel.jpg");
        s_oSpriteLibrary.addSprite("road_tile", "./sprites/game_road_tile.jpg");
        s_oSpriteLibrary.addSprite("hero", "./sprites/game_player_car.png");
        //s_oSpriteLibrary.addSprite("but_right", "./sprites/but_right.png");
        //s_oSpriteLibrary.addSprite("but_left", "./sprites/but_left.png");
        //s_oSpriteLibrary.addSprite("but_jump", "./sprites/but_jump.png");
        s_oSpriteLibrary.addSprite("enemy", "./sprites/enemy.png");
        s_oSpriteLibrary.addSprite("life", "./sprites/life.png");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        //s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
		s_oSpriteLibrary.addSprite("flag", "./sprites/flag1.png");
		s_oSpriteLibrary.addSprite("road_logo", "./sprites/game_road_logo1.png");
		s_oSpriteLibrary.addSprite("banner_bg", "./sprites/game_banner_bg.png");
		s_oSpriteLibrary.addSprite("footer_bg", "./sprites/game_footer.png");
		s_oSpriteLibrary.addSprite("effect_invisible", "./sprites/game_effect_invisible.png");
        s_oSpriteLibrary.addSprite("618flag", "./sprites/618.png");
		for(var i = 0; i < ROAD_BLOCK_CONFIG.length; ++i)
			s_oSpriteLibrary.addSprite(ROAD_BLOCK_CONFIG[i][0].name, ROAD_BLOCK_CONFIG[i][0].path);
        totalFileNum += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites()
    };
    this._onImagesLoaded = function() {
        currLoadedFileNum++;
        preLoader.refreshLoader(Math.floor(currLoadedFileNum / totalFileNum * 100));
        currLoadedFileNum === totalFileNum && (preLoader.unload()
        //,
 		// (s_oSoundTrackSnd = createjs.Sound.play("soundtrack", {
   //          interrupt: createjs.Sound.INTERRUPT_ANY,
   //          loop: -1,
   //          volume: 0.5
   //      }))
        ),
		//this.gotoMenu(),
		pageUpdatePercentage(currLoadedFileNum / totalFileNum)
    };
    this._onAllImagesLoaded = function() {};
    this.onAllPreloaderImagesLoaded = function() {
        this._loadImages()
    };

    this.gotoMenu = function() {
        pageUpdatePercentage(1);
		//new CMenu;
        currState = STATE_MENU
    };

    this.gotoGame = function() {
		//alert("gotoGame");
        var self = this;

        //if (fromHtml != null)
        //    s_onLine = fromHtml;
		
		if (s_oGame)
		{
			s_oGame.unload();
			s_oGame = null;
		}
		
		if (s_onLine)
		{
            //showEndGame();
            this.initGameByServer(this.initGameByServerResult);
		}else
		{
            //offline
            s_roadLength = GAME_DATA_INGAME[s_difficulty][0].basicRoadLength;
            ////console.debug("当前赛道难度为"+1+"赛度长度为:"+s_roadLength);

            //alert(s_difficulty);
            //s_difficulty ++;
            //if (s_difficulty == 5)
            //    s_difficulty = 4;

			if ( s_oilLeft == 0  )
			{
                if ( !g_fuelTipFrame )
                    g_fuelTipFrame = new showInsufficientFuel();

                g_fuelTipFrame.show();
			}
			else
			{
                this.showGameScene();
			}
		}
		
	};

    this.showGameScene = function()
    {
        TweenMax.to($("topframe"), 0, {opacity: 0, ease: Quint.easeInOut,display:'none' });
        if (gameHandler)
            gameHandler = null;

        gameHandler = new CGame();

        currState = STATE_GAME;
        $(s_oMain).trigger("game_start");
    };
	
	this.initGameByServer = function(dataObj){

        //fuelText.text = s_oilLeft;
        initGameByServerResult = dataObj;

		    //设置赛道类型
		    for (var i = 0; i < GAME_DATA_INGAME.length; i++)
		    {
                if ( dataObj != null && GAME_DATA_INGAME[i][0].roadType == dataObj.roadType){
                    s_difficulty = i;
				    s_roadLength = GAME_DATA_INGAME[s_difficulty][0].basicRoadLength + dataObj.rLen;
					//alert("roadType =" + dataObj.roadType+" roadType" + GAME_DATA_INGAME[i][0].roadType );
                    //alert("roadId = " + dataObj.roadId );
                    s_roadId = dataObj.roadId;
                    s_oilLeft = dataObj.residualOilVolume;
                    s_petrolAddedFlag = dataObj.petrolAddedFlag;

                    console.debug("roadType="+dataObj.roadType+" rlen="+dataObj.rLen);

				    break;
			    }
		    }
			
			//s_roadLength = 20000;

		    if (s_oilLeft == 0) {
                if ( !g_fuelTipFrame )
                    g_fuelTipFrame = new showInsufficientFuel();

                g_fuelTipFrame.show(initGameByServerResult.mileage);
            }
		    else{
			    TweenMax.to($("topframe"), 0, {opacity: 0, ease: Quint.easeInOut,display:'none' });

                if (gameHandler)
                    gameHandler = null;

                gameHandler = new CGame();

			    currState = STATE_GAME;
			    $(s_oMain).trigger("game_start");
		    }

    };

    this.gotoHelp = function() {
        new CHelp;
        currState = STATE_HELP
    };

    this._update = function(a) {
        var c = (new Date).getTime();
        s_iTimeElaps = c - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = c;
        1E3 <= s_iCntTime && (s_iCurFps = s_iCntFps, s_iCntTime -= 1E3, s_iCntFps = 0);
        s_fPrevForceFactor = s_fCurForceFactor = s_iTimeElaps / 33.33;
        currState === STATE_GAME && gameHandler.update();
        realStage.update(a)
    };
	this.getState = function() {
		return currState;
	}
	
    s_oMain = this;
    this.initContainer()
}

function CHero(a, carSprite, effInvisible) {
    var player, car, effectLayer, effectInvisible;
    this._init = function(a, car, effInvisible) {
		
		player = new createjs.Container;
		player.x = a;
        player.y = CANVAS_HEIGHT * .8;//CANVAS_HEIGHT - 250;
		
		car = new createjs.Bitmap(carSprite);
        car.regX = carSprite.width / 2;
        car.regY = carSprite.height / 2;
		car.scaleX = car.scaleY = s_gameScale;
		
		effectInvisible = new createjs.Bitmap(effInvisible);
		effectInvisible.regX = effInvisible.width / 2 + 2;
        effectInvisible.regY = effInvisible.height / 2;
		effectInvisible.scaleX = effectInvisible.scaleY = s_gameScale * 1.2;
		effectInvisible.visible = false;
		
		effectLayer = new createjs.Container;
		effectLayer.addChild(effectInvisible);
		
		player.addChild(car);
		player.addChild(effectLayer);
		s_oStage.addChild(player);
		
    };
	this.unload = function() {
		effectLayer.removeAllChildren();
		effectLayer = null;
    };
	
    this.move = function(a) {
		createjs.Tween.get(player).to({
            x: a
        }, 100, createjs.Ease.cubicOut)
    };
    this.getPos = function() {
        return {
            x: player.x,
            y: player.y
        }
    };
	this.getX = function(){
		return player.x
	}
    this.getY = function() {
        return player.y
    };
	this.getWidth = function() {
		return player.regX * 2 * s_gameScale;
	};
	this.getHeight = function() {
		return player.regY * 2 * s_gameScale;
	};
    this.isTweening = function() {
        return createjs.Tween.hasActiveTweens(player)
    };
	this.setEffect = function(effect){
		for (var i = 0; i < effectLayer.numChildren; i++)
		{
			effectLayer.getChildAt(i).visible = false;
		}
		switch(effect)
		{
			case "invisible":
				effectInvisible.visible = true;	
				break;
            case "":
                effectInvisible.visible = false;
                break;
		}
	}
	
    this.update = function() {
    };
    this._init(a, car, effInvisible)
}

function CHelpPanel(a) {
    var b, d, e, h;
    this._init = function(a) {
        
		d = new createjs.Shape();
		d.graphics.beginFill("rgba(0,0,0,0.5)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		
		e = new createjs.Bitmap(a);
		e.regX = a.width / 2;
		e.regY = a.height / 2;
		e.x = CANVAS_WIDTH / 2;
		e.y = CANVAS_HEIGHT / 2;// - e.getBounds().height * s_gameScale / 2;
		e.scaleX = e.scaleY = CANVAS_WIDTH * .9 / e.getBounds().width;//* s_gameScale;
		
		/*
        d = new createjs.Text(TEXT_HELP1, "bold 30px Arial", "#000000");
        d.textAlign = "center";
        d.x = CANVAS_WIDTH / 2 + 2;
        d.y = CANVAS_HEIGHT / 2 - 182 * s_gameScale;
        b = new createjs.Text(TEXT_HELP1, "bold 30px Arial", "#ffffff");
        b.textAlign = "center";
        b.x = CANVAS_WIDTH / 2;
        b.y = CANVAS_HEIGHT / 2 - 180 * s_gameScale;
        a = new createjs.Text(TEXT_HELP2, "bold 36px Arial", "#000000");
        a.textAlign = "center";
        a.x = CANVAS_WIDTH / 2 + 2;
        a.y = CANVAS_HEIGHT / 2 + 132 * s_gameScale;
        var c = new createjs.Text(TEXT_HELP2, "bold 36px Arial", "#ffffff");
        c.textAlign = "center";
        c.x = CANVAS_WIDTH / 2;
        c.y = CANVAS_HEIGHT / 2 + 130 * s_gameScale;
		*/
        h = new createjs.Container;
        //h.addChild(e, d, b, a, c);
		h.addChild(d , e);
        s_oStage.addChild(h);
		
        var g = this;
        h.on("pressup", function() {
            g._onExitHelp()
        })
    };
	
    this.unload = function() {
		h.removeAllChildren();
        s_oStage.removeChild(h);
        var a = this;
        h.off("pressup", function() {
            a._onExitHelp()
        })
    };
    this._onExitHelp = function() {
        this.unload();
        s_oGame._onExitHelp()
    };
    this._init(a)
};

function gestureHandler(event_, obj) {
// ignore bubbled handlers
//		if ( obj.originalEvent.currentTarget !== obj.originalEvent.target ) { return; }
	
	//手势信息在description里，格式范例： swipe:1:left:up 
	//////console.debug("G_log:" + jQuery(obj.originalEvent.currentTarget).attr('id')+' - '+obj.description+ ' - '+obj.type + ' - ' +obj.direction.orientation);
	//////console.debug("G_direction:" + obj.direction.vector + ' - ' + obj.direction.orientation + ' - ' + obj.direction.lastX + ' - ' + obj.direction.startX);
	//////console.debug("G_delta:" + obj.delta.vector + ' - ' + obj.delta.orientation + ' - ' + obj.delta.lastX + ' - ' + obj.delta.startX);
	event_.preventDefault();
	obj.originalEvent.preventDefault();
	
	var arrD = obj.description.split(':');
	if (arrD[2] == "left")
	{
		//向左滑动；
		//////console.debug("G_Right " + s_oMain);
		s_oMain.getState() == 3 && s_oGame.moveCar("left");
	}else if (arrD[2] == "right")
	{
		//向右滑动；
		//////console.debug("G_Left " + s_oMain.currState);
		s_oMain.getState() == 3 && s_oGame.moveCar("right");
	}
}

function touchHandler(e) {
	var point;
	point = e.touches[0];
	//////console.debug("Touch: " + point.clientX + " " + point.pageX + " " + point.screenX + " " + CANVAS_WIDTH);
	
	s_oMain.getState() == STATE_GAME && s_oGame.dragCar(point.pageX);
}

function mouseHandler(e) {
	////console.debug("Mouse: " + e.clientX + " " + e.pageX);
}

//----------------------------------------------------------------------
// Main Script
//----------------------------------------------------------------------
(function(a) {
	(jQuery.browser = jQuery.browser || {}).mobile = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,
		4))
})(navigator.userAgent || navigator.vendor || window.opera);

//$(window).resize(function() {
//    sizeHandler()
//    pageSizeHandler();
//});
/*
$(document).ready(function(){
	
	//$(function() {
	//	FastClick.attach(document.body);
	//});
	
	//jQuery('#canvas').bind('swiperight',function(){//console.debug("G_Right")});
	//jQuery('#canvas').bind('swipeleft',function(){//console.debug("G_Left")});
	
	var oMain = new CMain();
	
	//jQuery('#canvas').bind('swipeone',gestureHandler);
	
	//jQuery('#canvas').bind('swipeone',gestureHandler);
	
	if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPod') > 0  || navigator.userAgent.indexOf('iPad') > 0  || navigator.userAgent.indexOf('Android') > 0) {
		document.getElementById("canvas").addEventListener("touchmove", touchHandler, false);           
	}else
	{
		document.getElementById("canvas").addEventListener("mousemove", mouseHandler, false);
	}
	
	$(oMain).on("game_start", function(evt) {
	});
	
	$(oMain).on("save_score", function(evt,score) {
	});
	
	$(oMain).on("restart", function(evt) {
	});
	
	//$(window).resize(resizeCanvas); 
	//resizeCanvas();
});
*/