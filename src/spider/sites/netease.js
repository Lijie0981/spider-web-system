const { Spider } = require('../Spider');
const SITE_CONF = require('../../config/site.json');
const cheerio = require('cheerio');
const moment = require('moment');
class Netease extends Spider {
    constructor(site) {
        super(site);
        this.site.pageLinks = new Set();
        this.site.articles = new Map();
        this.runFlag = true;
    }
    async parseHead() {
        let { $ } = await this.getPageContent(this.site.index);
        let $headers = $(SITE_CONF[this.site.key].htmlClass.header);
        let subLinks = {};
        $headers.each((i, e)=>{
            subLinks[cheerio(e).text()] = cheerio(e).attr('href');
        });
        this.setSubLinks(subLinks);
        return this;
    }
    async handleAllLinks() {
        if (!this.site.subLinks) {
            return;
        }
        let linkReg = new RegExp(/\/?(\d{2})\/(\d{4})\/\d{2}\/.*.html?/);
        let stack = [];
        Object.values(this.site.subLinks).map(async (subLink) => {
            stack.push(Promise.resolve(this.getPageContent(subLink)).then(({ $, res }) => {
                this.log(+new Date(), subLink);
                this.parseLink($, res, linkReg);
            }));
        });
        this.log(+new Date(), 'start');
        Promise.all([...stack]).then(()=>{
            this.log('dispatch all sub sites success');
        })
    }
    parseLink ($, res, linkReg) {
        let $a = $('a');
        $a.each(async (index, element) => {
            let href = cheerio(element).attr('href');
            if (href && !this.site.pageLinks.has(href)) {
                if (linkReg.exec(href)) {
                    this.log(href);
                    let year = +linkReg.exec(href)[1];
                    let nowYear = +moment().format('YY');
                    let nowDate = +moment().format('MMD');
                    let date = +linkReg.exec(href)[2];
                    if (year === nowYear && nowDate === date) {
                        href = href[0] === '/' ? res.request.url + href.substring(1) : href;
                        if (!!!href.match(/tv|v./)) {
                            this.site.pageLinks.add(href);
                            let article = await this.parseArticle(href);
                            article && this.site.articles.set(href, article);
                        }
                    }
                }
            }
        });
    }
    async parseArticle(pageLink) {
        let { $ } = await this.getPageContent(pageLink);
        if ($ && $('body')) {
            let info = '';
            let content = '';
            let column = '';
            if ($('.m-article')[0]) {
                let time = $('.article-top span') ? +$('.article-top span').text() * 1000 : +new Date();
                info = moment(time).format('YYYY-MM-DD HH:mm:ss');
                content = $('.article-details p') ? $('.article-details p').text().trim() : '';
                column = $('meta[name="description"]').attr('content').slice(0,4);
            } else {
                info = $('.post_time_source') ? $('.post_time_source').text().slice(0,-2).trim() : '';
                content = $('.post_text p') ? $('.post_text p').text().trim() : '';
            }
           
            column = $('.post_crumb a').eq(1) ? $('.post_crumb a').eq(1).text().trim().slice(0, 4) : '';
            let article = {
                title: $('h1') ? $('h1').text().trim() : '',
                info,
                content,
                url: pageLink,
                time: this.parseTime(info),
                site: this.site.name,
                column
            };
            this.log(article);
            this.setArticle(article);
            return article;
        }
        return null;
    }
    parseTime(info) {
        if (!info) { return 0; }
        let reg = new RegExp(/(\d{4})-(\d{2})-(\d{0,2}) (\d{2}):(\d{2}):(\d{2})/);
        let [, year, month, day, hour, minute, second] = reg.exec(info);
        return +moment(`${year}-${month}-${day} ${hour}:${minute}:${second}`);
    }
    async run() {
        this;
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
    pause() {
        this.runFlag = false;
    }
}
let netease = new Netease(SITE_CONF.netease);
// netease.init();
// netease.parseHead();
// netease.handleAllLinks();
module.exports = { Netease, netease };