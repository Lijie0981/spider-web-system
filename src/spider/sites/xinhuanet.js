const { Spider } = require('../Spider');
const SITE_CONF = require('../../config/site.js');
const cheerio = require('cheerio');
const moment = require('moment');
class Xinhuanet extends Spider {
    constructor(site) {
        super(site);
    }
    parseLink($, res, column) {
        let linkReg = new RegExp(/\/?(\d{4})-(\d{2})\/(\d{2})\/.*.s?html?/);
        let $a = $('a');
        $a.each(async (index, element) => {
            let href = cheerio(element).attr('href');
            if (href && !this.site.pageLinks.has(href)) {
                if (linkReg.exec(href)) {
                    this.log(href);
                    let year = +linkReg.exec(href)[1];
                    let nowYear = +moment().format('YYYY');
                    let nowDate = +moment().format('MMD');
                    let date = +(linkReg.exec(href)[2] + '' + linkReg.exec(href)[3]);
                    this.log(year, nowYear, date, nowDate);
                    if (year === nowYear && nowDate === date) {
                        href = href[0] === '/' ? res.request.url + href.substring(1) : href;
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
            let info = $('.h-info') ? $('.h-info span').text().slice(0, -2).trim().replace(/\n+/g, '') : '';
            let content = $('#p-detail p') ? $('#p-detail p').text().trim() : '';
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
let xinhuanet = new Xinhuanet(SITE_CONF.xinhuanet);
module.exports = { Xinhuanet, xinhuanet };