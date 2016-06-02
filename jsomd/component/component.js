/*
 * 组件脚本
 *
 * 主要功能：包含所有的组件模块
 *
 * 
 */

define('./component/component', [
    './com_loading', 
    './com_shopcart',
    './com_slide',
    './com_toast',
    './com_halfslide',
    './com_countdown',
    './com_gesture'
], function(COM_loading, COM_shopcart, COM_slide, COM_toast, COM_halfslide, COM_countdown,COM_gesture) {

    //return
    return {
        loading: COM_loading,
        shopcart: COM_shopcart,
        slide: COM_slide,
        toast: COM_toast,
        halfslide: COM_halfslide,
        countdown: COM_countdown,
        gesture:COM_gesture
    };
});