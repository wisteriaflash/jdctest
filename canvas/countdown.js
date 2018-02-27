(function() {
//digit - 数模
var digit = [
    [
        [0,0,1,1,1,0,0],
        [0,1,1,0,1,1,0],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [0,1,1,0,1,1,0],
        [0,0,1,1,1,0,0]
    ], //0
    [
        [0,0,0,1,1,0,0],
        [0,1,1,1,1,0,0],
        [0,0,0,1,1,0,0],
        [0,0,0,1,1,0,0],
        [0,0,0,1,1,0,0],
        [0,0,0,1,1,0,0],
        [0,0,0,1,1,0,0],
        [0,0,0,1,1,0,0],
        [0,0,0,1,1,0,0],
        [1,1,1,1,1,1,1]
    ], //1
    [
        [0,1,1,1,1,1,0],
        [1,1,0,0,0,1,1],
        [0,0,0,0,0,1,1],
        [0,0,0,0,1,1,0],
        [0,0,0,1,1,0,0],
        [0,0,1,1,0,0,0],
        [0,1,1,0,0,0,0],
        [1,1,0,0,0,0,0],
        [1,1,0,0,0,0,0],
        [1,1,1,1,1,1,1]
    ], //2
    [
        [1,1,1,1,1,1,1],
        [0,0,0,0,0,1,1],
        [0,0,0,0,1,1,0],
        [0,0,0,1,1,0,0],
        [0,0,1,1,1,0,0],
        [0,0,0,0,1,1,0],
        [0,0,0,0,0,1,1],
        [0,0,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [0,1,1,1,1,1,0]
    ], //3
    [
        [0,0,0,0,1,1,0],
        [0,0,0,1,1,1,0],
        [0,0,1,1,1,1,0],
        [0,1,1,0,1,1,0],
        [1,1,0,0,1,1,0],
        [1,1,1,1,1,1,1],
        [0,0,0,0,1,1,0],
        [0,0,0,0,1,1,0],
        [0,0,0,0,1,1,0],
        [0,0,0,0,1,1,1]
    ], //4
    [
        [1,1,1,1,1,1,1],
        [1,1,0,0,0,0,0],
        [1,1,0,0,0,0,0],
        [1,1,1,1,1,1,0],
        [0,0,0,0,0,1,1],
        [0,0,0,0,0,1,1],
        [0,0,0,0,0,1,1],
        [0,0,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [0,1,1,1,1,1,0]
    ], //5
    [
        [0,0,0,0,1,1,0],
        [0,0,1,1,0,0,0],
        [0,1,1,0,0,0,0],
        [1,1,0,0,0,0,0],
        [1,1,0,1,1,1,0],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [0,1,1,1,1,1,0]
    ], //6
    [
        [1,1,1,1,1,1,1],
        [1,1,0,0,0,1,1],
        [0,0,0,0,1,1,0],
        [0,0,0,0,1,1,0],
        [0,0,0,1,1,0,0],
        [0,0,0,1,1,0,0],
        [0,0,1,1,0,0,0],
        [0,0,1,1,0,0,0],
        [0,0,1,1,0,0,0],
        [0,0,1,1,0,0,0]
    ], //7
    [
        [0,1,1,1,1,1,0],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [0,1,1,1,1,1,0],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [0,1,1,1,1,1,0]
    ],  //8
    [
        [0,1,1,1,1,1,0],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [0,1,1,1,0,1,1],
        [0,0,0,0,0,1,1],
        [0,0,0,0,0,1,1],
        [0,0,0,0,1,1,0],
        [0,0,0,1,1,0,0],
        [0,1,1,0,0,0,0]
    ],  //9
    [
        [0,0,0,0],
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0],
        [0,0,0,0]
    ],  //:
    [
        [1,1,1,1,1,1,1],
        [0,0,0,1,0,0,0],
        [0,0,0,1,0,0,0],
        [0,0,0,1,0,0,0],
        [1,1,1,1,1,1,1],
        [0,0,0,1,0,0,0],
        [0,0,0,1,0,0,0],
        [0,0,1,0,1,0,0],
        [0,1,0,0,0,1,0],
        [1,0,0,0,0,0,1]
    ]// 天
];


//countdown
var countdown = {
    //vars
    viewW: 1000,
    viewH: 600,
    radius: 4,
    marginTop: 60,
    marginLeft: 30,
    endTime: new Date(2018,0,30,11,10,52),
    curShowTimeSeconds: 0,
    //fun
    init: function() {
        var me = this;
        me.bindHandler();
    },
    bindHandler: function(){
        var me = this;
        //onload
        window.onload = function(){
            var canvas = me.getDom('J_canvas');
            //size
            canvas.width = me.viewW;
            canvas.height = me.viewH;
            //cxt
            var context = canvas.getContext('2d');
            //render
            me.curShowTimeSeconds = me.getCurrentShowTimeSeconds();
            setInterval(function(){
                me.render(context);
                me.update();
            }, 100);
        }
    },
    getDom: function(id){
        return document.getElementById(id);
    },
    getCurrentShowTimeSeconds: function(){
        var me = this;
        var curTime = new Date();
        var ret = me.endTime.getTime() - curTime.getTime();
        ret = Math.round(ret/1000);
        return ret>0 ? ret : 0;
    },
    render: function(cxt){
        var me = this;
        //clear
        cxt.clearRect(0, 0, me.viewW, me.viewH);
        //time
        var hours = parseInt(me.curShowTimeSeconds/3600);
        var time = [
            {name: 'days',    num: parseInt(hours/24)},
            {name: 'hours',   num: hours%24},
            {name: 'minutes', num: parseInt((me.curShowTimeSeconds - hours*3600)/60)},
            {name: 'seconds', num: me.curShowTimeSeconds%60}
        ]
        var timeNum, offsetX;
        var numOffset = digit[0][0].length*2+1;
        var symbolOffset = digit[0][digit[0].length-1].length*2+1;
        var otherOffset = 0;

        for(var i=0, len=time.length; i<len; i++){
            timeNum = time[i].num;
            //ten
            offsetX = me.marginLeft + (2*i*numOffset + i*symbolOffset + otherOffset)*(me.radius+1);
            me.renderDigit(offsetX, me.marginTop, parseInt(timeNum/10), cxt);
            //bit
            offsetX = me.marginLeft + ((2*i+1)*numOffset + i*symbolOffset + otherOffset)*(me.radius+1);
            me.renderDigit(offsetX, me.marginTop, parseInt(timeNum%10), cxt);
            //symbol
            if(i != len -1){
                var symbol = 10;
                if(time[i].name == 'days'){
                    symbol = 11;
                }
                offsetX = me.marginLeft + ((2*i+2)*numOffset + i*symbolOffset + otherOffset)*(me.radius+1);
                me.renderDigit(offsetX, me.marginTop, symbol, cxt);
                //offset set
                if(symbol == 11){
                    otherOffset = 1*numOffset;
                }
            }
        }
    },
    renderDigit: function(x, y, num, cxt){
        var me = this;
        //style
        cxt.fillStyle = 'rgb(0,102,153)';

        //graphic
        var centerX, centerY;
        for(var i=0, ilen=digit[num].length; i<ilen; i++){
            for(var j=0, jlen = digit[num][i].length; j<jlen; j++){
                if(digit[num][i][j] == 1){
                    centerX = x + j*2*(me.radius+1) + (me.radius + 1);
                    centerY = y + i*2*(me.radius+1) + (me.radius + 1);
                    //path
                    cxt.beginPath();

                    cxt.arc(centerX, centerY, me.radius, 0, 2*Math.PI);
                    cxt.closePath();

                    //fill
                    cxt.fill();
                }
            }
        }
    },
    update: function(){
        var me = this;
        var nextShowTimeSeconds = me.getCurrentShowTimeSeconds();
        var nexSeconds = nextShowTimeSeconds%60;

        me.curShowTimeSeconds = nextShowTimeSeconds;
    }

}

//init
countdown.init();


})();