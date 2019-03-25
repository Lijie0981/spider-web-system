const { Spider } = require('../Spider');
const SITE_CONF = require('../../config/site.js');
const cheerio = require('cheerio');
const moment = require('moment');
class Netease extends Spider {
    constructor(site) {
        super(site);
    }
    parseLink($, res, column) {
        let $a = $('a');
        let linkReg = new RegExp(/\/?(\d{2})\/(\d{4})\/\d{2}\/.*.html?/);
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
                            let article = await this.parseArticle(href, column);
                            article && this.site.articles.set(href, article);
                        }
                    }
                }
            }
        });
    }
    async parseArticle(pageLink, column) {
        let { $ } = await this.getPageContent(pageLink);
        if ($ && $('body')) {
            let info = '';
            let content = '';
            if ($('.m-article')[0]) {
                let time = $('.article-top span') ? +$('.article-top span').text() * 1000 : +new Date();
                info = moment(time).format('YYYY-MM-DD HH:mm:ss');
                content = $('.article-details p') ? $('.article-details p').text().trim() : '';
                // column = $('meta[name="description"]').attr('content').slice(0, 4);
            } else {
                info = $('.post_time_source') ? $('.post_time_source').text().slice(0, -2).trim().replace(/\n+/g, '') : '';
                content = $('.post_text p') ? $('.post_text p').text().trim() : '';
            }

            // column = $('.post_crumb a').eq(1) ? $('.post_crumb a').eq(1).text().trim().slice(0, 4) : '';
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
let netease = new Netease(SITE_CONF.netease);
module.exports = { Netease, netease };