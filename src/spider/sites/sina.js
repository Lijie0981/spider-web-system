const { Spider } = require('../Spider');
const cheerio = require('cheerio');
const moment = require('moment');
class Sina extends Spider {
    constructor(site) {
        super(site);
    }
    parseLink($, res, column) {
        let linkReg = new RegExp(/\/?(\d{4})-(\d{2})-(\d{2})\/.*.s?html?/);
        let $a = $('a');
        $a.each(async (index, element) => {
            let href = cheerio(element).attr('href');
            if (href) {
                if (linkReg.exec(href)) {
                    this.log(href);
                    let year = +linkReg.exec(href)[1];
                    let nowYear = +moment().format('YYYY');
                    let nowDate = +moment().format('MMD');
                    let date = +linkReg.exec(href)[2];
                    this.log(year, nowYear, date, nowDate);
                    if (year === nowYear && nowDate === date) {
                        href = href[0] === '/' ? res.request.url + href.substring(1) : href;
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
            let info = '';
            let content = '';
            if ($('.blkContainer')[0]) {
                let time = $('.pub_date') ? $('.pub_date').text() + ' ' : '';
                info = time + $('.media_name').text().slice(0, 4).trim().replace(/\n+/g, '');
                content = $('.blkContainerSblkCon p') ? $('.blkContainerSblkCon p').text().trim() : '';
                // column =  $('.media_name').text().slice(0, 4).trim();
            } else {
                info = $('.date-source') ? $('.date-source').text().slice(0, -2).trim().replace(/\n+/g, '') : '';
                content = $('.article p') ? $('.article p').text().trim() : '';
            }

            // column = $('.channel-path a').eq(0) ? $('.channel-path a').eq(0).text().trim().slice(0, 4) : '';
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
// sina.init();
// sina.parseHead();
// sina.handleAllLinks();
module.exports = Sina;
