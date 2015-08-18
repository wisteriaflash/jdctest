//难度：0-简单；1-中等；2-复杂；
GAME_DATA_DIFFICULTY = 1;
//游戏数据配置
GAME_DATA_INGAME = 
[
	// A
	[
		{
			// 赛道基础长度 no collision 33s, 35S /// 400000 37s(SPEED_STEP=10)
			basicRoadLength : 96000,
			// 刷新障碍的密度（即每隔多少距离刷新一堆障碍）
			obstacleCarDistance : 1000,
			// 障碍之间的最小车距
			distanceBetweenCarsMin : 500,
			// 障碍之间的最大车距
			distanceBetweenCarsMax : 900,
			// 速度上升距离
			speedUpdateDistance : 9,
			// 刷新车辆可能出现的车辆品种
			obstacleCarType: [0,1,2,3,4,5],
			// 刷新车辆可能出现的ROAD_FIX_POS组合
			obstacleCarShape: 
			[
				[0], [1], [2], [0,0], [1,1], [2,2], [0,1], [0,2], [1,2]
			],
			// 刷新路障可能出现的路障编号
			obstacleRoadBlockInclude : [4],//[0,1],
			// 刷新车与路障概率表
			obstacleRate : [.9],//[.5, .75],
			// 反转时间/秒
			reverseTime : 2,
			// 无敌时间/秒
			invisibleTime : 1,
			// 加速时间/秒
			//speedUpTime : 1,
			// 
			roadType : "A"
		}
	],
	// B
	[
		{
			// 赛道基础长度    no collision, 20s / 23s
			basicRoadLength : 81000,
			// 刷新障碍的密度（即每隔多少距离刷新一堆障碍）
			obstacleCarDistance : 900,
			// 障碍之间的最小车距
			distanceBetweenCarsMin : 400,
			// 障碍之间的最大车距
			distanceBetweenCarsMax : 700,
			// 速度上升距离
			speedUpdateDistance : 9,
			// 刷新车辆可能出现的车辆品种
			obstacleCarType: [3,4,5],
			// 刷新车辆可能出现的ROAD_FIX_POS组合
			obstacleCarShape: 
			[
				[0], [1], [2], [0,0], [1,1], [2,2], [0,1], [0,2], [1,2]
			],
			// 刷新路障可能出现的路障编号
			obstacleRoadBlockInclude : [4],//[0,1],
			// 刷新车与路障概率表
			obstacleRate : [.92],//[.5, .75],
			// 反转时间/秒
			reverseTime : 2,
			// 无敌时间/秒
			invisibleTime : 1,
			// 加速时间/秒
			//speedUpTime : 1,
			// 
			roadType : "B"
		}
	],
	// C
	[
		{
			// 赛道基础长度
			basicRoadLength : 61500,
			// 刷新障碍的密度（即每隔多少距离刷新一堆障碍）
			obstacleCarDistance : 900,
			// 障碍之间的最小车距
			distanceBetweenCarsMin : 400,
			// 障碍之间的最大车距
			distanceBetweenCarsMax : 700,
			// 速度上升距离
			speedUpdateDistance : 8,
			// 刷新车辆可能出现的车辆品种
			obstacleCarType: [0,1,2,5],
			// 刷新车辆可能出现的ROAD_FIX_POS组合
			obstacleCarShape: 
			[
				[0], [1], [2], [0,0], [1,1], [2,2], [0,1], [0,2], [1,2]
			],
			// 刷新路障可能出现的路障编号
			obstacleRoadBlockInclude : [4],//[0,1],
			// 刷新车与路障概率表
			obstacleRate : [.95],//[.5, .75],
			// 反转时间/秒
			reverseTime : 2,
			// 无敌时间/秒
			invisibleTime : 1,
			// 加速时间/秒
			//speedUpTime : 1,
			// 
			roadType : "C"
		}
	],
    // D
    [
        {
            // 赛道基础长度
            basicRoadLength : 42000,
            // 刷新障碍的密度（即每隔多少距离刷新一堆障碍）
            obstacleCarDistance : 800,
            // 障碍之间的最小车距
            distanceBetweenCarsMin : 450,
            // 障碍之间的最大车距
            distanceBetweenCarsMax : 500,
            // 速度上升距离
            speedUpdateDistance : 8,
            // 刷新车辆可能出现的车辆品种
            obstacleCarType: [0,1,2,5],
            // 刷新车辆可能出现的ROAD_FIX_POS组合
            obstacleCarShape:
                [
                    [0], [1], [2], [0,0], [1,1], [2,2], [0,1], [0,2], [1,2]
                ],
            // 刷新路障可能出现的路障编号
            obstacleRoadBlockInclude : [4],//[0,1],
            // 刷新车与路障概率表
            obstacleRate : [.988],//[.5, .75],
            // 反转时间/秒
            reverseTime : 2,
            // 无敌时间/秒
            invisibleTime : 1,
            // 加速时间/秒
            //speedUpTime : 1,

            //
            roadType : "D"
        }
    ],
    // E
    [
        {
            // 赛道基础长度
            basicRoadLength : 20000,
            // 刷新障碍的密度（即每隔多少距离刷新一堆障碍）
            obstacleCarDistance : 600,
            // 障碍之间的最小车距
            distanceBetweenCarsMin : 350,
            // 障碍之间的最大车距
            distanceBetweenCarsMax : 400,
            // 速度上升距离
            speedUpdateDistance : 3,
            // 刷新车辆可能出现的车辆品种
            obstacleCarType: [1,2,3,4,5],
            // 刷新车辆可能出现的ROAD_FIX_POS组合
            obstacleCarShape:
                [
                    [0], [1], [2], [0,0], [1,1], [2,2], [0,1], [0,2], [1,2]
                ],
            // 刷新路障可能出现的路障编号
            obstacleRoadBlockInclude : [4],//[0,1],
            // 刷新车与路障概率表
            obstacleRate : [.99],//[.5, .75],
            // 反转时间/秒
            reverseTime : 2,
            // 无敌时间/秒
            invisibleTime : 1,
            // 加速时间/秒
            //speedUpTime : 1,

            //
            roadType : "E"
        }
    ],
];