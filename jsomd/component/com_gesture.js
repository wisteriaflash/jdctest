//基础模块
/*
    1.公共方法提供
 */
define('./component/com_gesture', ['zepto', '../global/g_utils', '../global/g_imglazyload'], function($, G_utils, imglazyload) {
    var name = 'gesture';
    var optStr = name + 'Opt';
    var instanceStr = name + 'Instance';

    // 创建类
    var Gesture = function(item, options) {
        this.element = item;
        this._init(options);
    };

    // 原型方法
    Gesture.prototype = {
        version: '1.0.0',
        swipeW: 0,
        node: '',
        _init: function(options) {
            var me = this;
            var item = me.element;
            var settings = me._getSettings(item);
            var merageSettings = settings ? settings : $.fn.gesture.defaults;
            settings = $.extend({}, merageSettings, options);
            me._setSettings(item, settings);

            me._bindEventSwipe();

        },
        _getSettings: function(item) {
            return item.data(optStr);
        },
        _setSettings: function(item, options) {
            item.data(optStr, options);
        },
        _checkSwipeWidth: function() {
            var me = this;
            var item = me.element;
            var settings = me._getSettings(item);
            var list;
            var wrapCls = $.trim(settings.scrollWrapCls),
                commonCls = $.trim(settings.listWrapCls);
            list = item.find("." + wrapCls + ' .' + commonCls);
            var lastItem = list.eq(list.length - 1);
            var mainW = lastItem.position().left + lastItem.width();
            me.swipeW = mainW;
        },
        _bindEventSwipe: function() {
            var me = this;
            var item = me.element;
            var settings = me._getSettings(item);
            me._checkSwipeWidth();
            var node = $(item).eq(0);
            var winW = $(window).width();
            var count = -1;
            var preOffset = 0;
            var scrollLeft = 0;
            var scrollId = -1;
            var startData, moveDelta;
            var canScroll = true;

            var wrapCls = $.trim(settings.scrollWrapCls),
                lookMoreCls = $.trim(settings.lookMoreCls);
            // check 
            if (node.find("." + wrapCls + " ." + lookMoreCls).length == 0) {
                return;
            }
            // event
            node.find('.' + wrapCls).on("touchstart", function(e) {
                var touches = e.touches[0];
                // startData
                startData = {
                    x: touches.pageX,
                    y: touches.pageY,
                }
            })

            node.find("." + wrapCls).on("scroll touchmove", function(e) {
                var selfItem = $(this);
                if (e.touches) { //touch
                    // ensure swiping with one touch and not pinching
                    if (e.touches.length > 1 || e.scale && e.scale !== 1) return
                    var touches = e.touches[0];
                    //moveData
                    moveDelta = {
                            x: touches.pageX - startData.x,
                            y: touches.pageY - startData.y
                        }
                        //
                    if (Math.abs(moveDelta.y) - Math.abs(moveDelta.x) > 20) {
                        e.preventDefault();
                    }
                }
                scrollLeft = selfItem.scrollLeft();
                // limit 
                var limitX = 20;
                var isAndrolid = G_utils.runtimeEnv.system == 'android';
                if (isAndrolid) {
                    limitX = 10;
                }

                //timeout
                clearTimeout(scrollId);
                scrollId = setTimeout(function() {
                    //
                    var offset = me.swipeW - winW - selfItem.scrollLeft();
                    canScroll = selfItem.scrollLeft() ? true : false;
                    if (offset <= 0 && moveDelta && Math.abs(moveDelta.x) > limitX && canScroll) {
                        count++;
                    } else {
                        count = -1;
                    }
         
                        //check
                    if (count > 0 && moveDelta && Math.abs(moveDelta.x) > limitX) {
                        var moreNode = node.find('.' + lookMoreCls);
                        moreNode.click();
                        count = -1; //reset
                        if (!isAndrolid) {
                            moveDelta = null;
                            count = 0;
                        }
                        setTimeout(function(e) {
                            selfItem.scrollLeft(me.swipeW); //scroll fix
                        }, 1000);
                    }
                    //lazyload
                    imglazyload.check();
                }, 100);
            });
        }
    }

    // 公共方法
    var methods = {
        init: function(options) {
            this.each(function() {
                var $this = $(this);
                if (!$this.data(instanceStr)) {
                    $this.data(instanceStr, new Gesture($this, options));
                }
            });
        },
        instance: function() {
            var arr = [];
            this.each(function() {
                arr.push($(this).data(instanceStr));
            });
            return arr;
        }
    };

    // 实例化
    $.fn.gesture = function() {
        var method = arguments[0];
        if (methods[method]) {
            if (!this.data(instanceStr)) {
                console.error('please init gesture first');
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
    $.fn.gesture.defaults = {
        scrollWrapCls: 'pre_pd_module_wrap',
        listWrapCls: 'pd_commom',
        lookMoreCls: 'look_more'
    };

    //return 
    return Gesture;
});