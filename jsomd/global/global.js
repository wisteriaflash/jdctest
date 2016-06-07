/*
 * 全局脚本
 *
 * 主要功能：包含所有的全局功能模块
 *
 * 
 */

define('./global/global', [
        './g_header',
        './g_utils',
        './g_imglazyload',
        './g_excStatus',
        './g_share',
        './g_tracking'
    ], function(G_header, G_utils, G_imglazyload, G_excStatus, G_share, G_tracking) {


    //return
    return {
        header: G_header,
        utils : G_utils,
        imglazyload: G_imglazyload,
        excStatus: G_excStatus,
        share: G_share,
        tracking: G_tracking
    };
});