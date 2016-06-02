/*
 * Countdown组件
 *
 * 主要功能：倒计时
 *
 *
 * 配置参数：   
 *     @param: type         @type: string   @des: timeRemain-取剩余时间计算
 *                                                normal-正常计算
 *     @param: timeRemain   @type: string   @des: 剩余毫秒数
 * 
 * 方法：
 *     @method  start       @des: 开始
 *     @method  stop        @des: 停止
 */

define('./component/com_countdown', ['zepto'], function($) {
    var name = 'countdown';
    var optStr = name + 'Opt';
    var instanceStr = name + 'Instance';

    // 创建类
    var Countdown = function(item, options) {
        this.element = item;
        this._init(options);
    };

    // 原型方法
    Countdown.prototype = {
        version:'1.0.0',
        playID: -1,
        node:   '',
        hourPer: 3600000,
        minutePer: 60000,
        // 初始化配置
        _init: function(options) {
            var me = this;
            var item = this.element;
            var settings = this._getSettings(item);
            var merageSettings = settings ? settings : $.fn.countdown.defaults;
            settings = $.extend({}, merageSettings, options);
            me._setSettings(item, settings);
            me._startHandler();
        },
        _startHandler: function(){
            var me = this;
            var me = this;
            var item = this.element;
            var settings = me._getSettings(item);
            var type = settings.type;
            var timeSec = 0;
            //
            if(type == 'timeRemain'){
                timeSec = settings.timeRemain;
            }else if(type == 'normal'){
                var startTime = new Date(settings.startTime).getTime();
                var endTime = new Date(settings.endTime).getTime();
                timeSec = parseInt((endTime - startTime)/1000);
            }
            me.timeSec = timeSec;
            //render
            var timeStr = me._getTimeStr(timeSec);
            item.text(timeStr);
            //loop
            me.playID = setInterval(function(){
                me.timeSec -= 1000;
                if(me.timeSec<=0){
                    me._stopHandler();
                    settings.endCallback && settings.endCallback();
                }
                var timeStr = me._getTimeStr(me.timeSec);
                item.text(timeStr);
            },1000);
        },
        _getTimeStr: function(time){
            var me = this;
            var hour = parseInt(time/me.hourPer);
            time = time - hour*me.hourPer;
            var minute = parseInt(time/me.minutePer);
            time = time - minute*me.minutePer;
            var second = parseInt(time/1000);
            //str
            var hourStr = me._getNumFormat(hour);
            var minuteStr = me._getNumFormat(minute);
            var secondStr = me._getNumFormat(second);
            var str = hourStr+':'+minuteStr+':'+secondStr;
            return str;
        },
        _getNumFormat: function(num){
            var str = num<10 ? '0'+num : num;
            return str;
        },
        _getSettings: function(item) {
            return item.data(optStr);
        },
        _setSettings: function(item, options) {
            item.data(optStr, options);
        },
        _stopHandler: function(){
            var me = this;
            clearInterval(me.playID);
        },
        start: function(options) {
            var me = this;
            me.destroy();
            me._startHandler();
        },
        stop: function() {
            var me = this;
            me._stopHandler();
        }
    };

    // 公共方法
    var methods = {
        init: function(options) {
            this.each(function() {
                var $this = $(this);
                if (!$this.data(instanceStr)) {
                    $this.data(instanceStr, new Countdown($this, options));
                }
            });
        },
        instance: function() {
            var arr = [];
            this.each(function() {
                arr.push($(this).data(instanceStr));
            });
            return arr;
        },
        start: function() {
            var $this = $(this);
            var instance = $this.data(instanceStr);
            if(instance) {
                instance.start();
            }
        },
        stop: function() {
            var $this = $(this);
            var instance = $this.data(instanceStr);
            if(instance){
                instance.stop();
            }
        }
    };

    // 实例化
    $.fn.countdown = function(){
        var method = arguments[0];
        if (methods[method]) {
            if (!this.data(instanceStr)) {
                console.error('please init countdown first');
                return;
            }
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) === 'object' || !method) {
            method = methods.init;
        } else {
            console.error('Method ' + method + ' does not exist on zepto.tab');
            return this;
        }
        return method.apply(this, arguments);
    };

    // 默认配置
    $.fn.countdown.defaults = {
        type: 'timeRemain',              //timeRemian|normal
        startTime: '2016-05-04 12:00',
        endTime: '2016-05-04 12:00',
        timeRemain: 123,                 //剩余毫秒
        endCallback: null,              //
    };

    //exports
    return Countdown;

});