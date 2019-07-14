const { Spider } = require('../Spider');
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
            if (href) {
                if (linkReg.exec(href)) {
                    let year = +linkReg.exec(href)[1];
                    let nowYear = +moment().format('YYYY');
                    let nowDate = moment().format('MM-DD');
                    let date = linkReg.exec(href)[2];
                    if (year === nowYear && nowDate === date) {
                        href = href[0] === '/' && !href.match(/^\/\//) ? res.request.url + href.substring(1) : href;
                        href = href.match(/^\/\//) ? res.request.protocol + href : href;
                        if (href.indexOf('shipin') !== -1 || href.indexOf(this.site.key) == -1) { return; }
                        if (!this.site.pageLinks.has(href)) {
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
            if (article.title && article.title.length > 0 && info && info.length > 0 && content && content.length > 0) {
                this.setArticle(article);
                this.articleNum ++;
                this.log(`\n第${this.articleNum}篇文章：${article.title.slice(0,10)} ||  ${article.info.slice(0,10)}  ||  ${article.content.slice(0,10)}\n`);

                return article;
            } else {
                return null;
            }
        }
        return null;
    }
}
module.exports = Chinanews;
