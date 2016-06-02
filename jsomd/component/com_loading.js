//loading 汇集
/*
    1.初始loading
    2.加载数据时，显示的loading等
    3.其他
 */

define('./component/com_loading', ['zepto'], function($) {
    //main
    var loading = {
        //vars
        node : null,
        //funs
        init: function(){
            var me = this;
            // me.checkLoading();
            me.node = $('.bab_opt_loading');
        },
        checkLoading: function(){
            var  me = this;
        },
        show: function(){
            var me = this;
            me.node.removeClass('hide');
        },
        hide: function(){
            var me = this;
            me.node.addClass('hide');
        }
    }

    //init
    loading.init();

    return loading;
});