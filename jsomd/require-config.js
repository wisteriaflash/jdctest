/*
 * requirejs配置
 *
 * 说明：requirejs整体使用配置，gulp构建时也是使用这份配置，保证了配置统一。
 *
 * // mustache: '../../bower_components/mustache.js/mustache',
 * 
 */
// require.js config
var require = {
    // baseUrl: "/src/js/",
    baseUrl: "/",
    paths: {
        zepto: 'lib/zepto',
        mustache: '../../bower_components/mustache.js/mustache',
        fastclick: '../../bower_components/fastclick/lib/fastclick'
    },
    shim: {
        'zepto': {
            exports: '$'
        },
        'build/global/global': {
            deps: ['zepto']
        }
    }
};


//依赖zepto，mping埋点js