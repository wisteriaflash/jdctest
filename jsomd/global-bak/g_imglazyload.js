;(function(){
    
    function elementInViewport(elem, windowRegion, containerRegion) {
        var me = this;
        // if (!elem.width()) {
        //     return false;
        // }
        var elemOffset = elem.offset(),
            inContainer = true,
            inWin,
            left = elemOffset.left,
            top = elemOffset.top,
            elemRegion = {
                left: left,
                top: top,
                right: left + $(elem).width(),
                bottom: top + $(elem).height()
            };
        inWin = isCross(windowRegion, elemRegion);

        if (inWin && containerRegion) {
            inContainer = me.isCross(containerRegion, elemRegion); // maybe the container has a scroll bar, so do this.
        }

        // 确保在容器内出现
        // 并且在视窗内也出现
        return inContainer && inWin;
    }

    function isCross(r1, r2) {
        var r = {};
        r.top = Math.max(r1.top, r2.top);
        r.bottom = Math.min(r1.bottom, r2.bottom);
        r.left = Math.max(r1.left, r2.left);
        r.right = Math.min(r1.right, r2.right);
        return r.bottom >= r.top && r.right >= r.left;
    }

    function getBoundingRect(elem) {
        var vh, vw, left, top;
        if (elem !== undefined) {
            vh = elem.height();
            vw = elem.width();
            var offset = elem.offset();
            left = offset.left;
            top = offset.top;
        } else {
            var win = $(window);
            vh = win.height()
            vw = win.width();
            left = win.scrollLeft();
            top = win.scrollTop();
        }


        right = left + vw,
        bottom = top + vh;

        return {
            left: left,
            top: top,
            right: right,
            bottom: bottom
        };
    }



    //struct
    /*
     * init: 初始调用，默认添加img[data-src]元素，绑定事件
     *       设置标志位，防止重复调用
     * check: 检查，推荐使用$(window).trigger('scroll')来触发懒加载
     * 
     * type区分：默认、opt类型
     *     默认：每次check，整体取一遍img[data-src]元素，再次判断
     *     opt类型：自主添加元素，加载后的元素移除即可
     *     
     * 
     * 尽量简化调用等
     * 
     */
    var imglazyload = {
        id: -1,
        initSign: false,
        init: function(){
            var me = this;
            //bindEvent
            me.bindHandler();
        },
        addElement: function(){
            var me = this;
        },
        check: function() {
            var me = this;
            var tmp = false;
            var windowRegion = getBoundingRect();
            //
            var items = $('img[data-src]');
            items = items.filter(':visible');
            $.each(items, function(index, item) {
                item = $(item);
                tmp = elementInViewport(item, windowRegion);
                if(tmp){
                    me.loadImg(item);    
                }
            });
            //init
            if(!me.initSign){
                me.initSign = true;
                me.init();
            }
        },
        loadImg: function(node) {
            var url = node.attr('data-src');
            if(url.length == 0){
                return;
            }
            var callback = node.data('callback');
            var img = new Image();
            $(img).on('load', function(e) {
                node.attr('data-src','');
                node.attr('src', $(this).attr('src'));
                node.addClass('fadein');
                callback && callback.success && callback.success(node)
            });
            $(img).on('error', function(e) {
               callback && callback.error && callback.error(node)
            });
            img.src = node.attr('data-src');
        },
        bindHandler: function(){
            var me = this;
            $(window).on('scroll touchmove', function(e){
                clearTimeout(me.id);
                me.id = setTimeout(function(){
                    me.check();
                }, 100);
            });
        }
    }

    //init
    // imglazyload.init();

    //return
    // return imglazyload;
    


    //global
    if(!window.babelGlobal){
        window.babelGlobal = {};
    }
    var babelGlobal = window.babelGlobal;
    //OMD
    var moduleName = imglazyload;
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = moduleName;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() { return moduleName; });
    } else {
        babelGlobal.imglazyload = imglazyload;
    }
})();