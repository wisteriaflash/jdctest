/*
 * 全局脚本
 *
 * 主要功能：包含所有的全局功能模块
 *
 * 
 */

define('./global/global',[
        './g_utils',
        './g_imglazyload',
        './g_excStatus'
    ], function(G_utils, G_imglazyload, G_excStatus) {

    //return
    return {
        utils : G_utils,
        imglazyload : G_imglazyload,
        excStatus: G_excStatus
    };
});