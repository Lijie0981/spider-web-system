const { Spider } = require('../Spider');
const SITE_CONF = require('../../config/site.json');
const cheerio = require('cheerio');
const moment = require('moment');
class Sina extends Spider {
    constructor(site) {
        super(site);
        this.site.pageLinks = new Set();
        this.site.articles = new Map();
        this.runFlag = true;
    }
    async parseHead() {
        let { $ } = await this.getPageContent(this.site.index, 'UTF-8');
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
        let linkReg = new RegExp(/\/?(\d{4})-(\d{2})-(\d{2})\/.*.s?html?/);
        let stack = [];
        Object.values(this.site.subLinks).map(async (subLink) => {
            stack.push(Promise.resolve(this.getPageContent(subLink, 'UTF-8')).then(({ $, res }) => {
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
                    let nowYear = +moment().format('YYYY');
                    let nowDate = +moment().format('MMD');
                    this.log(year, nowYear, date, nowDate);
                    if (year === nowYear && nowDate === date) {
                        href = href[0] === '/' ? res.request.url + href.substring(1) : href;
                        this.site.pageLinks.add(href);
                        let article = await this.parseArticle(href);
                        article && this.site.articles.set(href, article);
                    }
                }
            }
        });
    }
    async parseArticle(pageLink) {
        let { $ } = await this.getPageContent(pageLink, 'UTF-8');
        if ($ && $('body')) {
            let info = '';
            let content = '';
            let column = '';
            if ($('.blkContainer')[0]) {
                let time = $('.pub_date') ? $('.pub_date').text() + ' ' : '';
                info = time + $('.media_name').text().slice(0, 4).trim();
                content = $('.blkContainerSblkCon p') ? $('.blkContainerSblkCon p').text().trim() : '';
                column = $('.media_name').text().slice(0, 4).trim();
            } else {
                info = $('.date-source') ? $('.date-source').text().slice(0,-2).trim() : '';
                content = $('.article p') ? $('.article p').text().trim() : '';
            }
           
            column = $('.channel-path a').eq(0) ? $('.channel-path a').eq(0).text().trim().slice(0, 4) : '';
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
        let reg = new RegExp(/(\d{4})年(\d{2})月(\d{0,2})日 (\d{2}):(\d{2})/);
        this.log('parseTime:', info);
        let [, year, month, day, hour, minute] = reg.exec(info);
        return +moment(`${year}-${month}-${day} ${hour}:${minute}`);
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
let sina = new Sina(SITE_CONF.sina);
sina.init();
sina.parseHead();
sina.handleAllLinks();
module.exports = { Sina, sina };