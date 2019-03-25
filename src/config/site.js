let SITE_CONF = {
    "netease": {
        "key": "netease",
        "name": "网易新闻",
        "index": "https://news.163.com/",
        "subSite": [],
        "htmlClass": {
            "header": ".ns_area.list li a",
            "content": "",
            "footer": "",
            "side_left": "",
            "side_right": ""
        },
        "pageLinks": {},
        "articles": {},
        "subLinks": {},
        "sourceTimeReg": new RegExp(/(\d{4})-(\d{2})-(\d{0,2}) (\d{2}):(\d{2}):(\d{2})/)
    },
    "sina": {
        "key": "sina",
        "name": "新浪新闻",
        "index": "https://news.sina.com.cn/",
        "subSite": [],
        "htmlClass": {
            "header": ".cNav2 .cNavLinks a",
            "content": "",
            "footer": "",
            "side_left": "",
            "side_right": ""
        },
        "pageLinks": {},
        "articles": {},
        "subLinks": {},
        "sourceTimeReg": new RegExp(/(\d{4})年(\d{2})月(\d{0,2})日 (\d{2}):(\d{2})/)
    },
    "chinanews": {
        "key": "chinanews",
        "name": "中国新闻网",
        "index": "http://www.chinanews.com/",
        "subSite": [],
        "htmlClass": {
            "header": ".nav_navcon li a",
            "content": "",
            "footer": "",
            "side_left": "",
            "side_right": ""
        },
        "pageLinks": {},
        "articles": {},
        "subLinks": {
            "滚动": {
                "column": "滚动",
                "subLink": "http://www.chinanews.com/scroll-news/news1.html"
            },
            "时政": {
                "column": "时政",
                "subLink": "http://www.chinanews.com/china/"
            },
            "国际": {
                "column": "国际",
                "subLink": "http://world.chinanews.com/"
            },
            "社会": {
                "column": "社会",
                "subLink": "http://www.chinanews.com/society/"
            },
            "财经": {
                "column": "财经",
                "subLink": "http://finance.chinanews.com/"
            },
            "产经": {
                "column": "产经",
                "subLink": "http://business.chinanews.com/"
            },
            "金融": {
                "column": "金融",
                "subLink": "http://fortune.chinanews.com/"
            },
            "汽车": {
                "column": "汽车",
                "subLink": "http://auto.chinanews.com/"
            },
            "港澳": {
                "column": "港澳",
                "subLink": "http://www.chinanews.com/gangao/"
            },
            "台湾": {
                "column": "台湾",
                "subLink": "http://www.chinanews.com/taiwan/"
            },
            "华人": {
                "column": "华人",
                "subLink": "http://www.chinanews.com/huaren/"
            },
            "娱乐": {
                "column": "娱乐",
                "subLink": "http://ent.chinanews.com/"
            },
            "体育": {
                "column": "体育",
                "subLink": "http://sports.chinanews.com/"
            },
            "文化": {
                "column": "文化",
                "subLink": "http://cul.chinanews.com/"
            },
            "English": {
                "column": "English",
                "subLink": "http://www.ecns.cn/"
            },
            "中国侨网": {
                "column": "中国侨网",
                "subLink": "http://www.chinaqw.com/"
            },
            "中新经纬": {
                "column": "中新经纬",
                "subLink": "http://www.jwview.com/"
            },
            "图片": {
                "column": "图片",
                "subLink": "http://photo.chinanews.com/"
            },
            "视频": {
                "column": "视频",
                "subLink": "http://www.chinanews.com/shipin/"
            },
            "直播": {
                "column": "直播",
                "subLink": "http://www.chinanews.com/live.shtml"
            },
            "理论": {
                "column": "理论",
                "subLink": "http://www.chinanews.com/theory/"
            },
            "生活": {
                "column": "生活",
                "subLink": "http://life.chinanews.com/"
            },
            "葡萄酒": {
                "column": "葡萄酒",
                "subLink": "http://wine.chinanews.com/"
            },
            "微视界": {
                "column": "微视界",
                "subLink": "http://www.chinanews.com/shipin/minidocu.shtml"
            },
            "演出": {
                "column": "演出",
                "subLink": "http://www.chinanews.com/piaowu/index.html"
            },
            "专题": {
                "column": "专题",
                "subLink": "http://www.chinanews.com/allspecial/index.shtml"
            },
            "新媒体": {
                "column": "新媒体",
                "subLink": "http://m.chinanews.com/home/ "
            },
            "供稿": {
                "column": "供稿",
                "subLink": "http://www.chinanews.com/common/news-service.shtml"
            }
        },
        "sourceTimeReg": new RegExp(/(\d{4})年(\d{2})月(\d{0,2})日 (\d{2}):(\d{2})/)
    },
    "xinhuanet": {
        "key": "xinhuanet",
        "name": "新华网",
        "index": "http://www.xinhuanet.com/",
        "subSite": [],
        "htmlClass": {
            "header": ".navCont > ul li a",
            "content": "",
            "footer": "",
            "side_left": "",
            "side_right": ""
        },
        "pageLinks": {},
        "articles": {},
        "subLinks": {},
        "sourceTimeReg": new RegExp(/(\d{4})-(\d{2})-(\d{0,2}) (\d{2}):(\d{2}):(\d{2})/)
    },
    "people": {
        "key": "people",
        "name": "人民网",
        "index": "http://www.people.com.cn/",
        "subSite": {},
        "htmlClass": {
            "header": "nav>div span a",
            "content": "",
            "footer": "",
            "side_left": "",
            "side_right": ""
        },
        "subLinks": {},
        "pageLinks": {},
        "articles": {},
        "sourceTimeReg":new RegExp(/(\d{4})年(\d{2})月(\d{0,2})日(\d{2}):(\d{2})/)
    }
}
module.exports = SITE_CONF;