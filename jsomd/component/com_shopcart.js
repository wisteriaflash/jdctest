//购物车
define('./component/com_shopcart', ['zepto', '../global/global', './com_loading'], function($, global, comLoading) {
    //main vars
    var utils = global.utils;
    var runtimeEnv = utils.runtimeEnv;
    //main obj
    var shopcart = {
        isLoadData: false,
        init: function(){
            var me = this;
            var jdappV5 = runtimeEnv.jdapp ? runtimeEnv.jdapp.versionLarge : '';
            jdappV5 = jdappV5 ? jdappV5>=5 : false;
            me.jdappV5 = jdappV5;
        },
        addCartLayer: function(callback){
            var me = this;
            var item = $('#J_babCartLayer');
            var addSign = item.length>0 ? true : false;
            //render
            if(item.length == 0 && !me.jdappV5){
                var tpl = '<div id="J_babCartLayer" class="bab_opt_cart_layer">'+
                            '<span class="num"></span>'+
                        '</div>';
                $('#J_bableOpt').append(tpl);
                addSign = true;
                //bindEvent
                $('#J_babCartLayer').on('click', function(e){
                    var url = utils.protocol+'//p.m.jd.com/cart/cart.action';
                    url = utils.parseUrl(url);
                    setTimeout(function() {
                        if (runtimeEnv.webCon == 'jdapp') {
                            var appUrl = 'openApp.jdMobile://virtual?params={"category":"jump","des":"cartB","skuId":0,"skuNum":0}';
                            try {
                                utils.jumpLink(appUrl);
                            } catch (b) {
                                location.href = url;
                            }
                        } else
                            location.href = url;
                    }, 200);
                });
            }
            //callback
            callback && callback();
            return addSign;
        },
        addCartItem: function(sku, successFun, errorFun, cartButtonShow){
            var me = this;
            if(me.isLoadData){
                return;
            }
            me.isLoadData = true;
            //
            var cartButtonShow = cartButtonShow != undefined ? cartButtonShow : false;
            var sid = runtimeEnv.sid;
            var url = utils.protocol + '//m.jd.com/cart/add.json';
            // url = 'https://m.jd.com/cart/add.json';
            url = global.parFormatURL(url);
            var dataConfig = {
                "sid": sid,
                "wareId": sku,
                "num": 1,
                "actId": 1
            };
            //add data
            $.ajax({
                url: url,
                data: dataConfig,
                dataType: 'json',
                success: function(data){
                    if (data.login && data.login === "0") {
                        utils.goLogin();
                    } else if (data.sid && data.cartJson) {
                        var cartJson = data.cartJson;
                        var cartWareNum = cartJson.Num;
                        var isSkuAdded = me.findValueOfKey.call(data, "Id", sku);
                        if (isSkuAdded) {
                            if (cartWareNum && typeof cartWareNum === "number") {
                                me.setCartSkuNum(cartWareNum);
                            }
                            successFun && successFun();
                        } else { //TODO:添加购物车失败
                            errorFun && errorFun();
                        }
                    } else {
                        errorFun && errorFun();
                    }
                },
                error: function(err){
                    errorFun && errorFun();
                },
                beforeSend: function(xhr, settings){
                    comLoading.show();
                },
                complete: function(xhr, status){
                    me.isLoadData = false;
                    comLoading.hide();  
                }
            });
        },
        setCartSkuNum: function(num){
            var me = this;
            if(me.jdappV5){
                if(utils.runtimeEnv.system == 'android'){
                    AndroidNavi && AndroidNavi.refreshCart();
                }else if(utils.runtimeEnv.system == 'iphone'){
                    var appUrl = utils.getHeaderIphoneUrl({
                        action: 'sh_refreshCart'
                    });
                    location.href = appUrl;
                    utils.jumpLink(appUrl);
                }
                return;
            }
            //jdappV5以下
            var cartNode = $('#J_babCartLayer');
            if(cartNode.length == 0){
                return;
            }
            if(num>0){
                var numStr = num>99 ? '99+' : num;
                cartNode.find('.num').text(numStr);
                cartNode.find('.num').show();
            }else{
                cartNode.find('.num').hide();
            }
        },
        //utils
        findValueOfKey: function(key, value){
            var me = shopcart;
            var data = this;
            //
            for(var tmp in data){
                if(data.hasOwnProperty(tmp)){
                    if(data[tmp] instanceof Object){
                        if(me.findValueOfKey.call(data[tmp], key, value)) return true;
                    }else if(data[tmp] == value){
                        return true;
                    }
                }
            }
            return false;
        },
        /*jumpApp: function(url) {
            var node = $('#J_jumpLink');
            //add
            if(node.length == 0){
                node = $('<a>');
                node.attr('id', 'J_jumpLink')
                    .css('display', 'none');
                $('body').append(node);
            }
            node.attr('href', url)
            node.click();
        }*/
    }

    //init
    shopcart.init();
    return shopcart;
});