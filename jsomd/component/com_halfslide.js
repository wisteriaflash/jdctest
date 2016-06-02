/*
 * halfSlide组件，Slide的扩充
 *
 * 主要功能：轮播图（选中项和轮播项的宽度有区别），滑动/自动播放循环展示图片。
 *
 *
 * 配置参数：   
 *     @param: hasDot       @type: boolean  @des: 是否有dot点显示
 *     @param: slideNum     @type: number   @des: 每次滚动项目个数
 *     @param: slideOffset  @type: number   @des: 项目之间的间隔
 *     @param: listCls      @type: string   @des: 轮播列表class
 *     @param: listItem     @type: string   @des: 轮播项的tag/class名
 *     @param: selectCls    @type: string   @des: 选中项class
 *     @param: speed        @type: number   @des: 轮播速度(ms)
 *     @param: isLoop       @type: boolean  @des: 是否循环播放
 *     @param: autoPlay     @type: boolean  @des: 是否自动播放
 *     @param: autoTime     @type: number   @des: 自动播放延迟时间(ms)
 *     @param: changeSlide  @type: function @des: 轮播变更图片时触发该方法
 *     新增参数：
 *     @param: itemWin      @type: number   @des: 轮播项宽度
 *     @param: itemCurWin   @type: number   @des: 轮播选中项宽度
 *     @param: itemCurCls   @type: string   @des: 轮播选中项class名
 *     @param: slideWrap    @type: string   @des: 轮播项的父类
 *
 * 事件：
 *     @event: slideChange       @des: 更改图片时触发该事件
 *
  * 方法：
 *     @method: select    @param: index     @des: 选中slide的索引值项
 */

define('./component/com_halfslide', ['zepto'], function($) {
    //vars
    var name = 'halfslide';
    var optStr = name+'Opt';
    var instanceStr = name+'-instance';
    //halfSlide class
    var halfSlide = function(item, options) {
        this.element = item;
        this._init(options);
    };
    //fun
    halfSlide.prototype = {
        version: '1.0.0',
        autoPlayID: -1,
        itemLen: 0,
        isScrolling: undefined,
        slideStart: {},
        slideDelta: {},
        slideIndex: 0,
        _init: function(options) {
            var me = this;
            var item = this.element;
            var settings = this._getSettings(item);
            var mergeData = settings ? settings : $.fn.halfslide.defaults;
            settings = $.extend({}, mergeData, options);
            this._setSettings(item, settings);

            //init
            me._resizeSlide();
            me._renderHandler();
            me._bindHandler();
            me._autoPlay();
        },
        _resizeSlide: function(){
            var me = this;
            var item = this.element;
            var settings = me._getSettings(item);
            //list
            var listNode = item.find('.' + settings.listCls);
            if(!listNode.hasClass('jdui_slide_list')){
                listNode.addClass('jdui_slide_list');    
            }
            //item
            var itemArr = listNode.find(settings.listItem);
            itemArr = itemArr.length==0 ? listNode.find('.'+settings.listItem) : itemArr;
            me.itemLen = itemArr.length;
            if(me.itemLen == 0 || itemArr.eq(0).width() == 0){
                console.log('item not exit;')
                return;
            }
            //style
            me.slideWidth = settings.itemWin;
            var winW = $(window).width();
            var listNum = Math.ceil(winW/me.slideWidth);
            listNum = listNum>1 ? listNum-1 : listNum;
            me.listNum = listNum;   //data
            var perWidh = me.slideWidth + settings.slideOffset;
            var len = settings.isLoop ? me.itemLen+listNum*2+1 : me.itemLen;
            listNode.css({
                width: perWidh * len
            });
            itemArr.css({
				'width': me.slideWidth
			});
        },
        _renderHandler: function(){
            var me = this;
            var item = this.element;
            var settings = me._getSettings(item);
            if(settings.hasDot){
                //dot
                var dotNode = item.find('.jdui_slide_dot');
                if(dotNode.length == 0){
                    dotNode = $('<ul>');
                    dotNode.addClass('jdui_slide_dot');    
                }
                dotNode.html('');
                for(var i=0; i<me.itemLen; i++){
                    dotNode.append('<li>');
                }
                dotNode.find('li').eq(0).addClass(settings.selectCls);
                item.append(dotNode);    
            }
            //clone first/last
            var listNode = item.find('.' + settings.listCls);
            var itemArr = listNode.find(settings.listItem);
            //first/last
            var first, last, second;
            for(var i=0; i<me.listNum; i++){
                first = itemArr.eq(i);
                last = itemArr.eq(me.itemLen-1-i);
                listNode.append(first.clone());
                if(i==0){
                    last.clone().insertBefore(first);
                }
            }
			second = itemArr.eq(1);
			listNode.append(second.clone());
            //reset
            var pos = me.getSlidePos(me.slideIndex+1);
            me.cssTranslateFun(pos,0);
			listNode.find('li').eq(1).addClass(settings.itemCurCls);
			listNode.find('li').css({
                'width': settings.itemWin+'px'
            });
			listNode.find('.'+settings.itemCurCls).css({
                'width': settings.itemCurWin+'px'
            });
			var _wrapHeight = listNode.find('.'+settings.itemCurCls).height();
            listNode.css({
				'height': _wrapHeight+'px'
			});
			
			var floorNum = $(settings.slideWrap).parents('.bab_opt_mod').attr('data-floornum'),
				itemCls = '.bab_opt_mod_'+floorNum+' .'+settings.listCls+ ' ' +settings.listItem,
				str = '<style>'+itemCls+'{width:'+ settings.itemWin +'px!important;}'+  itemCls+ '.'+settings.itemCurCls+'{width:'+ settings.itemCurWin +'px!important;}</style>';
			listNode.append(str);
			
        },
        _bindHandler: function(){
            var me = this;
            var item = me.element;
            var settings = me._getSettings(item);
            //event
            item.on('touchstart', function(e){
                clearInterval(me.autoPlayID);
                me.slideTouchstart(e);
            });
            item.on('touchmove', function(e){
                me.slideTouchmove(e);
            });
            item.on('touchend', function(e){
                me.slideTouchend(e);
                me._autoPlay();
            });
        },
        _autoPlay: function(){
            var me = this;
            var item = this.element;
            var settings = me._getSettings(item);
            if(!settings.autoPlay){
                return;
            }
            //
            me.autoPlayID = setInterval(function(){
                var index = me.slideIndex;
                index += settings.slideNum;
                me.slideChange(index);
            }, settings.autoTime);
        },
        _getSettings: function(item){
            return item.data(optStr);
        },
        _setSettings: function(item,options){
            item.data(optStr, options);
        },
        slideTouchstart: function(event){
            var me = this;
            var touches = event.touches[0];
            //startData
            me.slideStart = {
              x: touches.pageX,
              y: touches.pageY,
              time: +new Date
            }
            me.isScrolling = undefined;
            me.slideDelta = {};
        },
        slideTouchmove: function(event){
            var me = this;
            var item = me.element;
            var settings = me._getSettings(item);
            // ensure swiping with one touch and not pinching
            if ( event.touches.length > 1 || event.scale && event.scale !== 1) return
            var touches = event.touches[0];
            //moveData
            me.slideDelta = {
              x: touches.pageX - me.slideStart.x,
              y: touches.pageY - me.slideStart.y
            }
			if(typeof me.isScrolling == 'undefined') {
              me.isScrolling = !!( me.isScrolling || Math.abs(me.slideDelta.x) < Math.abs(me.slideDelta.y) );
            }
            //check
            if(!me.isScrolling){
                event.preventDefault();    
            }
            if(!me.isScrolling && settings.touchMove){
                var pos = me.getSlidePos(me.slideIndex);
                pos += me.slideDelta.x;
                me.cssTranslateFun(pos, 0);
            }
        },
        slideTouchend: function(event){
            var me = this;
            var item = me.element;
            var settings = me._getSettings(item);
            //
            var duration = +new Date - me.slideStart.time;
            var touches = event.touches[0];
            var index = me.slideIndex;
            if(!me.slideDelta.x){
              return;
            }
            var dir = me.slideDelta.x<0; //(true:right, false:left)
            if(!me.isScrolling){
                if(dir){//right
                    // index = index+1>me.itemLen-1 ? index : index+1;
                    index += settings.slideNum;
                }else{//left
                    // index = index-1<0 ? 0: index-1;
                    index -= settings.slideNum;
                }
                me.slideChange(index);
            }
        },
        getSlidePos: function(index){
            var me = this;
            var item = me.element;
            var settings = me._getSettings(item);
            //
            var pos = index*(me.slideWidth+settings.slideOffset);
            pos *= -1;
            return pos;
        },
        cssTranslateFun: function(pos, speed, index){
            var me = this;
            var item = me.element;
            var settings = me._getSettings(item);
			
            //
            var listNode = item.find('.' + settings.listCls);
			listNode.find('li').removeClass(settings.itemCurCls).eq(index+1).addClass(settings.itemCurCls);
			listNode.find('li').css({
                '-webkit-transition-duration': speed+'ms',
                'transition-duration': speed+'ms',
				'width': ''
            });
			listNode.css({
                '-webkit-transition-duration': speed+'ms',
                'transition-duration': speed+'ms',
                '-webkit-transform': 'translate3d('+pos+'px, 0px, 0px)',
                'transform': 'translate3d('+pos+'px, 0px, 0px)'
            });
			
			
			
			
			
        },
        slideChange: function(index){
            var me = this;
            var item = me.element;
            var settings = me._getSettings(item);
            //reset
            if(!settings.isLoop){
                index = index<0 ? 0 : index;
                index = index>me.itemLen-1 ? me.itemLen-1 : index;
            }
            //
            var pos = me.getSlidePos(index+1);
            me.cssTranslateFun(pos, settings.speed, index);
            //reset
            var resetIndex = index;
            if(settings.isLoop){
                resetIndex = me.slideReset(index);    
            }
            //dot
            var selectCls = settings.selectCls;
            var dotNode = item.find('.jdui_slide_dot li');
            dotNode.removeClass(selectCls);
            dotNode.eq(resetIndex).addClass(selectCls);
            //data
            me.slideIndex = resetIndex;
            //event
            if (typeof settings.changeSlide === "function"){
                settings.changeSlide(resetIndex);
            }
            item.trigger('slideChange',resetIndex);
        },
        slideReset: function(index){
            var me = this;
            var item = me.element;
            var settings = me._getSettings(item);
            //
            var resetIndex = index;
            if(index>=me.itemLen){
                resetIndex = 0;
            }else if(index<0){
                resetIndex = me.itemLen-1;
            }
            if(index != resetIndex){
                var time = settings.speed;
                setTimeout(function(){
                    var pos = me.getSlidePos(resetIndex+1);
                    me.cssTranslateFun(pos,0);
					$(settings.slideWrap).find('li').eq(resetIndex+1).addClass(settings.itemCurCls);
                },time+50);
            }
            return resetIndex;
        }
    }

    //public fun
    var methods = {
        init: function(options) {
            this.each(function() {
                var $this = $(this);
                if (!$this.data(instanceStr)) {
                    $this.data(instanceStr, new halfSlide($this, options));
                }
            });
        },
        instance: function() {
            var arr = [];
            this.each(function() {
                var $this = $(this);
                arr.push($this.data(instanceStr));
            });
            return arr;
        },
        select: function(index){
            var $this = $(this);
            var item = $this.data(instanceStr);
            var instance = $this.data(instanceStr);
            if(instance){
                instance.slideChange(index);
            }
        }
    }

    //construct
    $.fn.halfslide = function() {
        var method = arguments[0];
        if (methods[method]) {
            if (!this.data(instanceStr)) {
                console.log('please init slide first');
                return;
            }
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods.init;
        } else {
            console.log('Method ' + method + ' does not exist on zepto.slide');
            return this;
        }
        return method.apply(this, arguments);
    }

    // defaults
    $.fn.halfslide.defaults = {
        hasDot: true,
        slideNum: 1,
        slideOffset: 0,
        listCls: 'jdui_slide_list',
        listItem: 'li',     //tag或者class名均可
        selectCls: 'select',
        speed: 300,         //scroll speed
        isLoop: true,       //是否循环
        autoPlay: true,
        autoTime: 3000,    //自动播放的延迟时间->3000ms,
        touchMove: false,
		itemWin: 0,
		itemCurWin: 0,
		slideWrapWin: $(window).width(),
		itemCurCls: 'cur',
        changeSlide: null
    };

    //exports
    return halfSlide;

});