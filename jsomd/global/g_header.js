//页头：1.m端公用页头 2.jdapp页头

define('./global/g_header', ['zepto', './g_utils'], function($, G_utils) {
    //header
    var header = {
        init: function(config) {
            var me = this;
            me.config = config;
            // me.checkShow();
        },
        checkShow: function(option) {
            var me = this;
            var runtimeEnv = G_utils.runtimeEnv;
            var url = window.location.href;
            if (runtimeEnv.webCon != 'jdapp') {
                if(url.match('&showhead=no')){//url添加参数：showhead=no 时不显示m页页头
                    return
                }
                me.loadHeaderM(option)
                // option ? me.loadHeaderM(option) : -1;
                $('.bab_opt_header').removeClass('hide');
            } else if (runtimeEnv.webCon == 'jdapp') { //5.0+ webview中的页头才可以调整
                option ? me.jdappHeader(option) : -1;
            }
        },
        loadHeaderM: function(option) {
            //url
            var commonHeader = '//st.360buyimg.com/common/commonH_B/js/m_common_header_bottom2.1.js';
            var common = '//st.360buyimg.com/common/commonH_B/js/m_common2.1.js';

            //common_header
            require([commonHeader], function() {
                var mchb = new MCommonHeaderBottom();
                var title = '京东';
                if(option && option.name){
                    title = option.name;
                }
                var headerArg = {
                    hrederId: 'm_common_header',
                    title: title,
                    isShowShortCut: false,
                    selectedShortCut: '4'
                };
                mchb.header(headerArg);
            });

            //common
            require([common], function() {});
        },
        jdappHeader: function(option) {
            var me = this;
            var runtimeEnv = G_utils.runtimeEnv;
            var jdappV5 = runtimeEnv.jdapp ? runtimeEnv.jdapp.versionLarge : '';
            jdappV5 = jdappV5 ? jdappV5>=5 : false;
            if(!jdappV5){
                return;
            }
            var imgUrl = option.imgUrl;
            imgUrl = imgUrl.indexOf('http')==-1 ? G_utils.protocol+imgUrl : imgUrl;
            //system
            if (runtimeEnv.system == 'android') {
                var titleConf = {
                    isShow: 'N'
                }
                if (imgUrl && imgUrl.length > 0) {
                    titleConf = {
                        isShow: 'Y',
                        imageUrl: imgUrl
                    }
                }
                var cartArr = ['N', 'Y'];
                var cartConf = {
                    isShow: cartArr[option.cartButton]
                }
                // if (typeof window.AndroidNavi === 'object') {
                    AndroidNavi.setTitle(JSON.stringify(titleConf));
                    AndroidNavi.setCart(JSON.stringify(cartConf));
                // }
            } else if (runtimeEnv.system == 'iphone') {
                var titleConf = {
                    action: 'sh_hideImgTitle'
                }
                if (imgUrl && imgUrl.length > 0) {
                    titleConf = {
                        action: 'sh_showImgTitle',
                        imageUrl: imgUrl
                    }
                }
                // setTimeout(function(e){//delay time
                    G_utils.jumpLink(G_utils.getHeaderIphoneUrl(titleConf));
                    // location.href = G_utils.getHeaderIphoneUrl(titleConf);
                // }, 100);
                //cart
                var cartArr = ['sh_hideCart','sh_showCart'];
                var cartConf = {
                    action: cartArr[option.cartButton]
                }
                setTimeout(function(e){//delay time
                    // location.href = G_utils.getHeaderIphoneUrl(cartConf);
                    G_utils.jumpLink(G_utils.getHeaderIphoneUrl(cartConf));
                }, 100);
                
            }
        }//,
        // jumpApp: function(url) {
        //     var node = $('#J_jumpLink');
        //     //add
        //     if(node.length == 0){
        //         node = $('<a>');
        //         node.attr('id', 'J_jumpLink')
        //             .css('display', 'none');
        //         $('body').append(node);
        //     }
        //     node.attr('href', url)
        //     node.click();
        // }
    }

    header.init();

    return header;
});


//页头设置 - 代码转移至g_mheader

/* 
 5.0+可以调整webview下的icon是否显示

 5.0以下的只能配置分享的内容 - 调用全局分享即可
 */

/*
 
 * 2.12 android商城 内嵌m页控制图片title协议
 * 2.13 android商城 内嵌m页控制购物车图标协议
 *
 * 这是安卓webview的调用方法 IOS的开发还在梳理 稍后给到
 *
 * 安卓的开发同学是吴迪
 *
 *
 * IOS是张颂
 * 
 * H5这边配合webview测试的同学是曾通
 *
 *
 * app5.0方法：
 * webview这边是只能控制购物车和分享的
 *
 *
 * 测试demo
 * http://betah5.m.jd.com/active/webview/nav-opration-test.html
 */