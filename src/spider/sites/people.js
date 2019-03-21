const {Spider} = require('../Spider');
const SITE_CONF = require('../config/site.json');
const cheerio = require('cheerio');
const moment = require('moment');
class People extends Spider {
    constructor(site) {
        super(site);
        this.site.pageLinks = new Set();
        this.site.articles = new Map();
        this.runFlag = true;
    }
    async parseHead() {
        let {$} = await this.getPageContent(this.site.site);
        let $headers = $(SITE_CONF.people.htmlClass.header).children();
        let subLinks = {};
        for (let $key in $headers) {
            if (+$key >= 0 && $headers[$key].tagName === "span") {
                subLinks[cheerio($headers[$key]).children('a').text()] = cheerio($headers[$key]).children('a').attr('href');
            }
        }
        // this.setSubLinks(subLinks);
        return this;
    }
    async handleAllLinks () {
        if (!this.site.subLinks) {
            return;
        }
        let linkReg = new RegExp(/\/?n1\/(\d{4})\/(\d{4})\/\S\d+-\d+.html?(#\S+)*/);
        for (const subLink of Object.values(this.site.subLinks)) {
            let {$, res} = await this.getPageContent(subLink);
            let $a = $('a');
            for (let $key in $a) {
                if (+$key >= 0) {
                    let href = cheerio($a[$key]).attr('href');
                    if (href && !this.site.pageLinks.has(href)) {
                        href = href.replace(/#\S+/, '');
                        if (linkReg.exec(href) && !!!href.match(/tv|v./)) {
                            let year = +linkReg.exec(href)[1];
                            let nowYear = +moment().format('YYYY');
                            let nowDate = +moment().format('MMD');
                            let date = +linkReg.exec(href)[2];
                            if (year === nowYear && nowDate === date) {
                                href = href[0] === '/' ? res.request.url + href.substring(1) : href;
                                this.site.pageLinks.add(href);
                                let article = await this.parseArticle(href);
                                article && this.site.articles.set(href, article);
                            }
                        };
                    }
                }
            }
        }
    }
    async parseArticle(pageLink) {
        let {$} = await this.getPageContent(pageLink);
        if ( $ && $('body') ) {
            let info = '';
            let content = '';
            if ( $('.text_con')[0]) {
                info = $('.text_title .box01 div.fl') ? $('.text_title .box01 div.fl').text().trim() : '';
                info = !info && $('.sou') ? $('.sou').text().trim() : info;
                content = $('.text_con .text_con_left p') ? $('.text_con .text_con_left p').text().trim() : '';
                content = !content && $('.show_text') ? $('.show_text').text().trim() : content;
            }
            else if ($('.pic_c')[0]) {
                info = $('.pic_c .page_c .fr') ? $('.pic_c .page_c .fr').text().trim() : '';
                content = $('.content') ? $('.content p').text().trim() : '';

            } else if ($('.zdfy div')[0]) {
                info = $('.page_c:last') ? $('.page_c:last').text().trim() : '';
                content = $('.content') ? $('.content p').text().trim() : '';
            } else if ($('video')[0]) {
                info = $('.publishtime') ? $('.publishtime').text().trim() : '';
                content = $('.v-intro') ? $('.v-intro p').text().trim() : '';
            } else if ($('.d2_content')[0]) {
                info = $('.ptime') ? $('.ptime').text().trim() : '';
            } else if ($('.wb-p1')[0]) {
                info = $('.tit-ld p:last') ? $('.tit-ld p:last').text().trim() : '';
            }
            let article = {
                title:$('h1') ? $('h1').text().trim() : '',
                info,
                content,
                url: pageLink
            };
            this.log(article);
            return article;
        }
        return null;
    }
    async run () {
        await this.parseHead();
        let times = 0;
        // setInterval(async ()=>{
        //     if (this.runFlag) {
                await this.handleAllLinks();
                // times++;
                this.log(`第${times}抓取`);
            // }
        // }, 5 * 60 * 1000);
    }
    pause () {
        this.runFlag = false;
    }
}
let people = new People(SITE_CONF.people);
people.run();
module.exports = {People, people};