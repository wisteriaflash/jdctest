define("./parser/par_dataload", [ "zepto", "../component/component", "../module/module", "../global/global" ], function(a, t, e, i) {
    var o = i.utils, n = {
        pageNum: 1,
        totalPageNum: -1,
        data: null,
        activityData: {
            pageId: "",
            pageUrl: "",
            type: ""
        },
        init: function() {
            var t = this, e = i.utils;
            t.activityData = {
                pageId: a("#J_bableOpt").attr("data-pageId"),
                pageUrl: e.getNoParamURL()
            }, a("#J_bableOptPage").toast({
                content: ""
            });
        },
        loadData: function(e) {
            var o = this, n = "http://nbingsoa.m.jd.care/h5BabelGenericChannel", r = i.pageType;
            "dev" == r && (n = "../data/test.json");
            var c = n.match(".json") ? "json" : "jsonp", d = {
                activityId: a("#J_bableOpt").attr("data-activityId"),
                pageNum: "-1"
            };
            d = "body=" + JSON.stringify(d), a.ajax({
                url: n,
                data: d,
                dataType: c,
                success: function(e) {
                    if (0 != e.code) return void a("#J_bableOptPage").toast("show", {
                        content: "数据异常"
                    });
                    if (i.header.checkShow(e.head), 0 == e.code && 0 == e.subCode) o.data = e, o.activityData.useDiscovery = e.useDiscovery, 
                    o.activityData.cartButtonShow = "1" == e.head.cartButton, o.parserData(), t.loading.hide(), 
                    a("#J_bableOptPage").addClass("show"), i.imglazyload.check(), o.initActivity(); else {
                        t.loading.hide();
                        var n = o.activityData.activityId;
                        i.excStatus.directGetData(n, e.subCode), console.warn("活动异常");
                    }
                },
                error: function(t, e) {
                    a("#J_bableOptPage").toast("show", {
                        content: "data load err"
                    }), console.warn("data load err");
                }
            });
        },
        parserData: function() {
            for (var t, e, i = this, n = i.data.floorList, r = 0, c = n.length; c > r; r++) t = n[r], 
            e = t.template, e.match("guanggao") && (e = e.match("_") ? e.split("_")[0] : e), 
            i.switchRenderData(e, t);
            o.addTrackingBind(), a("body").css("backgroundColor", i.data.backgroundColor);
        },
        switchRenderData: function(a, t) {
            var i = this, o = {
                data: t,
                activityData: i.activityData
            };
            switch (a) {
              case "guanggao":
                e.promo(o);
                break;

              case "loucengbiaoti":
                e.floortitle(o);
                break;

              case "shangpin_putong":
                e.product_normal(o);
                break;

              case "jiange":
                e.floorgap(o);
            }
        },
        initActivity: function() {
            var a = this;
            if ("1" == a.data.head.shareButton) {
                var t = a.data.head.shareInfo;
                setTimeout(function() {
                    i.share.directAnalysisData(t);
                }, 200);
            }
            i.tracking.globalSlideTracking(a.activityData.activityId);
        }
    };
    return n.init(), n;
});