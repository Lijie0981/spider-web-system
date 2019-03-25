const { Spider } = require('../Spider');
const SITE_CONF = require('../../config/site.js');
const cheerio = require('cheerio');
const moment = require('moment');
class Chinanews extends Spider {
    constructor(site) {
        super(site);
    }
    parseLink($, res, column) {
        let $a = $('a');
        let linkReg = new RegExp(/\/?(\d{4})\/(\d{2}-\d{2})\/.*.s?html?/);
        $a.each(async (index, element) => {
            let href = cheerio(element).attr('href');
            if (href && !this.site.pageLinks.has(href)) {
                if (linkReg.exec(href)) {
                    this.log(href);
                    let year = +linkReg.exec(href)[1];
                    let nowYear = +moment().format('YYYY');
                    let nowDate = moment().format('MM-DD');
                    let date = linkReg.exec(href)[2];
                    this.log(year, nowYear, date, nowDate);
                    if (year === nowYear && nowDate === date) {
                        href = href[0] === '/' ? res.request.url + href.substring(1) : href;
                        if (href.indexOf('shipin') !== -1 || href.indexOf(this.site.key) == -1) { return; }
                        this.site.pageLinks.add(href);
                        let article = await this.parseArticle(href, column);
                        article && this.site.articles.set(href, article);
                    }
                }
            }
        });
    }
    async parseArticle(pageLink, column) {
        let { $ } = await this.getPageContent(pageLink);
        if ($ && $('body')) {
            let info = $('.left-time .left-t') ? $('.left-time .left-t').text().trim().slice(0, -4).trim().replace(/\n+/g, '') : '';
            let content = $('.left_zw p') ? $('.left_zw p').text().trim() : '';
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
}
let chinanews = new Chinanews(SITE_CONF.chinanews);
module.exports = { Chinanews, chinanews };