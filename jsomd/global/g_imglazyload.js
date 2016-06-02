//全局组件：图片懒加载
/*
    1.图片懒加载判断
    2.图片load，并淡入显示
 */

/*
ex code:

var img = new Image();
// 'load' event
$(img).on('load', function() {
    var num = new Date().getTime();
    var str = "image is loaded "+num+'</br>';
    $('body').append(str);
    console.log("image is loaded",num);
});
img.src = "http://eimg.smzdm.com/201602/02/56b003bbc49e33983.jpg";

var imageNodes = document.querySelectorAll('img[data-src]');

//tab切换后，触发滚动，以调用懒加载
$('a[data-toggle="tab"]').on('shown', function () {
    $(window).trigger('scroll');
});
 */

/*
 * 全局：图片懒加载
 * 自定义：每次重新取img，遍历检查
 * 可视化：先检查mod节点的位置，再遍历节点内img。
 *
 * 事件：scroll,touchmove
 *
 * tab切换时候，自动trigger scroll，来启动懒加载检查
 *
 * ①滑动、轮播组件时候：其内部图片自动加载、或者自动加载下个可视化区域内的图片。
 * 
 * ②：tb焦点图自动切换change时，自动加载下一张图
 *    滑动图：当前可视区域+下一个可视区域内的图片，自动加载。
 *
 *
 * https://github.com/kissygalleryteam/datalazyload/blob/master/2.0.1/src/index.js
 * fun: elementInViewport
 *      isCross
 *      
 * //TODO:
 * 整体：预加载一屏
 * 
 */

define('./global/g_imglazyload', ['zepto'], function($) {
    
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

        //预读
        // var diff = this.get('diff'),
        //     diffX = diff === DEFAULT ? vw : diff,
        //     diffX0 = 0,
        //     diffX1 = diffX,
        //     diffY = diff === DEFAULT ? vh : diff,
        // // 兼容，默认只向下预读
        //     diffY0 = 0,
        //     diffY1 = diffY,
        right = left + vw,
        bottom = top + vh;

        // if (S.isObject(diff)) {
        //     diffX0 = diff.left || 0;
        //     diffX1 = diff.right || 0;
        //     diffY0 = diff.top || 0;
        //     diffY1 = diff.bottom || 0;
        // }

        // left -= diffX0;
        // right += diffX1;
        // top -= diffY0;
        // bottom += diffY1;

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
    return imglazyload;
});