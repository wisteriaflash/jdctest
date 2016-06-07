;(function(root, factory) {
    root.babelGlobal.imglazyload = factory();
}(this, function() {
    function elementInViewport(elem, windowRegion, containerRegion) {
        var me = this;
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
            inContainer = me.isCross(containerRegion, elemRegion); 
        }

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



    var imglazyload = {
        id: -1,
        initSign: false,
        init: function(){
            var me = this;
            me.bindHandler();
        },
        addElement: function(){
            var me = this;
        },
        check: function() {
            var me = this;
            var tmp = false;
            var windowRegion = getBoundingRect();
            var items = $('img[data-src]');
            items = items.filter(':visible');
            $.each(items, function(index, item) {
                item = $(item);
                tmp = elementInViewport(item, windowRegion);
                if(tmp){
                    me.loadImg(item);    
                }
            });
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

    return imglazyload;
}));