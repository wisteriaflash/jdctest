;(function(root, factory) {
    root.babelGlobal.header = factory(root.babelGlobal.utils);
}(this, function(G_utils) {
    var header = {
        init: function(config) {
            var me = this;
            me.config = config;
        },
        checkShow: function(option) {
            var me = this;
            var runtimeEnv = G_utils.runtimeEnv;
            var url = window.location.href;
            if (runtimeEnv.webCon != 'jdapp') {
                if(url.match('&showhead=no')){
                    return
                }
                me.loadHeaderM(option)
                $('.bab_opt_header').removeClass('hide');
            } else if (runtimeEnv.webCon == 'jdapp') { 
                option ? me.jdappHeader(option) : -1;
            }
        },
        loadHeaderM: function(option) {
            var commonHeader = '//st.360buyimg.com/common/commonH_B/js/m_common_header_bottom2.1.js';
            var common = '//st.360buyimg.com/common/commonH_B/js/m_common2.1.js';

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
                    AndroidNavi.setTitle(JSON.stringify(titleConf));
                    AndroidNavi.setCart(JSON.stringify(cartConf));
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
                    G_utils.jumpLink(G_utils.getHeaderIphoneUrl(titleConf));
                var cartArr = ['sh_hideCart','sh_showCart'];
                var cartConf = {
                    action: cartArr[option.cartButton]
                }
                setTimeout(function(e){
                    G_utils.jumpLink(G_utils.getHeaderIphoneUrl(cartConf));
                }, 100);

                            }
        }
    }

    header.init();

    return header;
}));