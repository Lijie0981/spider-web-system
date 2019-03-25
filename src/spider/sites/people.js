const { Spider } = require('../Spider');
const SITE_CONF = require('../../config/site.js');
const cheerio = require('cheerio');
const moment = require('moment');
class People extends Spider {
    constructor(site) {
        super(site);
    }
    parseLink($, res, column) {
        let $a = $('a');
        let linkReg = new RegExp(/\/?n1\/(\d{4})\/(\d{4})\/\S\d+-\d+.html?(#\S+)*/);
        $a.each(async (index, element) => {
            let href = cheerio(element).attr('href');
            if (href && !this.site.pageLinks.has(href)) {
                href = href.replace(/#\S+/, '');
                if (linkReg.exec(href)) {
                    let year = +linkReg.exec(href)[1];
                    let nowYear = +moment().format('YYYY');
                    let nowDate = +moment().format('MMD');
                    let date = +linkReg.exec(href)[2];
                    if (year === nowYear && nowDate === date) {
                        href = href[0] === '/' ? res.request.url + href.substring(1) : href;
                        if (!!!href.match(/tv|v./)) {
                            this.log(href);
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
            if ($('.text_con')[0]) {
                info = $('.text_title .box01 div.fl') ? $('.text_title .box01 div.fl').text().trim().replace(/\n+/g, '') : '';
                info = !info && $('.sou') ? $('.sou').text().trim().replace(/\n+/g, '') : info;
                content = $('.text_con .text_con_left p') ? $('.text_con .text_con_left p').text().trim() : '';
                content = !content && $('.show_text') ? $('.show_text').text().trim() : content;
            }
            else if ($('.pic_c')[0]) {
                info = $('.pic_c .page_c .fr') ? $('.pic_c .page_c .fr').text().trim().replace(/\n+/g, '') : '';
                content = $('.content') ? $('.content p').text().trim() : '';
                // column = $('.pos_re_search a').eq(2) ? $('.pos_re_search a').eq(2).text().trim().slice(0, 4) : '';
            } else if ($('.zdfy div')[0]) {
                info = $('.page_c:last') ? $('.page_c:last').text().trim().replace(/\n+/g, '') : '';
                content = $('.content') ? $('.content p').text().trim() : '';
            } else if ($('video')[0]) {
                info = $('.publishtime') ? $('.publishtime').text().trim().replace(/\n+/g, '') : '';
                content = $('.v-intro') ? $('.v-intro p').text().trim() : '';
            } else if ($('.d2_content')[0]) {
                info = $('.ptime') ? $('.ptime').text().trim().replace(/\n+/g, '') : '';
            } else if ($('.wb-p1')[0]) {
                info = $('.tit-ld p:last') ? $('.tit-ld p:last').text().trim().replace(/\n+/g, '') : '';
            }
            // column = !column && $('#rwb_navpath a').eq(1) ? $('#rwb_navpath a').eq(1).text().trim().slice(0, 4) : column;
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
let people = new People(SITE_CONF.people);
module.exports = { People, people };