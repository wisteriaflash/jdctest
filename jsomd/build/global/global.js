;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./g_utils', './g_excStatus', './g_header', './g_imglazyload', './g_share', './g_tracking'], factory);
  } else {
    root.babelGlobal.global = factory(root.babelGlobal.utils, root.babelGlobal.excStatus, root.babelGlobal.header, root.babelGlobal.imglazyload, root.babelGlobal.share, root.babelGlobal.tracking);
  }
}(this, function(G_utils, G_excStatus, G_header, G_imglazyload, G_share, G_tracking) {

    return {
        header: G_header,
        utils : G_utils,
        imglazyload: G_imglazyload,
        excStatus: G_excStatus,
        share: G_share,
        tracking: G_tracking
    };
}));