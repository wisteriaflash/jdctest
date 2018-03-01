//解析器 - 加载数据
/*
    1.获取数据：第一屏+剩下数据
    2.解析数据
 */
define('./parser/par_dataload', [
        'zepto',
        '../component/component',
        '../module/module',
        '../global/global'
    ], function($, component, module, global) {

    var utils = global.utils;

    //main
    var dataload = {
        //vars
        pageNum: 1,
        totalPageNum: -1,
        data: null,
        activityData: {
            pageId: '',
            pageUrl: '',
            type: ''    //dev|preview
        },
        //funs
        init: function(){
            var me = this;
            var G_utils = global.utils;
            //data
            me.activityData = {
                pageId: $('#J_bableOpt').attr('data-pageId'),
                pageUrl: G_utils.getNoParamURL()
            }
            $('#J_bableOptPage').toast({
                content: ''
            });
        },
        loadData: function(pageNum){
            var me = this;
            var url = 'http://nbingsoa.m.jd.care/h5BabelGenericChannel';
            var pageType = global.pageType;
            if(pageType == 'dev'){
                url = '../data/test.json';
            }
            var dataType = url.match('.json') ? 'json' : 'jsonp';
            var param = {
                activityId: $('#J_bableOpt').attr('data-activityId'),
                pageNum: '-1'
            }
            param = 'body='+ JSON.stringify(param);
            //load
            $.ajax({
                url: url,
                data: param,
                dataType: dataType,
                success: function(data){
                    // return;
                    // data.code = 2;
                    // data.subCode = '1-1';
                    // delete data.subCode;
                    if (data.code != 0) {
                        //toast
                        $('#J_bableOptPage').toast('show', {
                            content: '数据异常'
                        });
                        return;
                    }
                    global.header.checkShow(data.head);
                    if(data.code == 0 && data.subCode == 0){
                        //
                        me.data = data;
                        // if(me.totalPageNum == -1){
                        //     me.totalPageNum = data.totalPageNum;
                        // }
                        //addData
                        me.activityData.useDiscovery = data.useDiscovery;
                        me.activityData.cartButtonShow = data.head.cartButton == '1' ? true : false;
                        //render
                        me.parserData();
                        component.loading.hide();
                        $('#J_bableOptPage').addClass('show');
                        global.imglazyload.check();
                        me.initActivity();
                    }else{
                        component.loading.hide();
                        //error
                        var id = me.activityData.activityId;
                        global.excStatus.directGetData(id, data.subCode);
                        console.warn('活动异常');
                    }
                },
                error: function(xhr, type){
                    //toast
                    $('#J_bableOptPage').toast('show', {
                        content: 'data load err'
                    });
                    console.warn('data load err');
                }
            });
        },
        parserData: function(){
            var me = this;
            var floorList = me.data.floorList;
            var item, type;
            var start = 0, num = 10;
            for(var i=0,len=floorList.length; i<len; i++){
                item = floorList[i];
                type = item.template;
                if(type.match('guanggao')){
                    type = type.match('_') ? type.split('_')[0] : type;
                }
                me.switchRenderData(type, item);
                // console.log(i,item,type);
            }
            //add tracking
            utils.addTrackingBind();
            //bgColor
            $('body').css('backgroundColor', me.data.backgroundColor);
        },
        switchRenderData: function(type, data){
            var me = this;
            var config = {
                data: data,
                activityData: me.activityData
            }
            switch(type){
                case 'guanggao': module.promo(config); break;
                case 'loucengbiaoti': module.floortitle(config); break;
                case 'shangpin_putong': module.product_normal(config); break;
                case 'jiange': module.floorgap(config); break;
            }
        },
        initActivity: function(){
            var me = this;
            //share
            if(me.data.head.shareButton == '1'){
                var shareData = me.data.head.shareInfo;
                setTimeout(function(){
                    global.share.directAnalysisData(shareData)
                },200);
            }
            //tracking slide
            global.tracking.globalSlideTracking(me.activityData.activityId);
        }
    }

    //init
    dataload.init();

    return dataload;
});
