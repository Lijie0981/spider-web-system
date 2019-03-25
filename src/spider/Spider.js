const cheerio = require('cheerio');
const debug = require('debug');
const request = require('request');
const iconv = require('iconv-lite');
// require('superagent-charset')(request);
const siteConfPath = '../config/site.json';
const SITE_CONF = require('../config/site.js');
const fs = require('fs');
const path = require('path');
const Article = require('./models/Article');
const Url = require('url-parse');
class Spider {
    constructor(site) {
        this.site = site;
        this.log = debug(`spider:${this.site.name}`);
        this.site.pageLinks = new Set();
        this.site.articles = new Map();
        this.runFlag = true;
    }
    async parseHead() {
        if (Object.values(SITE_CONF[this.site.key].subLinks).length !== 0) { this.log(SITE_CONF[this.site.key].subLinks); return; }
        let { $, res } = await this.getPageContent(this.site.index);
        let $headers = $(SITE_CONF[this.site.key].htmlClass.header);
        let subLinks = {};
        $headers.each((i, e) => {
            let herf = cheerio(e).attr('href').indexOf('http') == -1 ? res.request.protocol + cheerio(e).attr('href') : cheerio(e).attr('href');
            subLinks[cheerio(e).text().trim()] = herf;
        });
        this.setSubLinks(subLinks);
        return this;
    }
    async getPageContent(url) {
        this.log(url);
        let res = { response: {}, body: '' };
        try {
            res = await new Promise((res, rej) => {
                request({ uri: url, encoding: null }, (err, response, body) => {
                    if (err) {
                        rej(err);
                    }
                    else {
                        let charset = "utf-8";
                        let arr = body.toString().match(/<meta([^>]*?)>/g);
                        if (arr) {
                            arr.forEach(function (val) {
                                let match = val.match(/charset\s*=\s*(.+)\"/);
                                if (match && match[1]) {
                                    if (match[1].substr(0, 1) == '"') match[1] = match[1].substr(1);
                                    charset = match[1].trim();
                                    return false;
                                }
                            })
                        }
                        this.log('page charset', charset);
                        let resData = {
                            body: iconv.decode(body, charset),
                            response
                        };
                        res(resData);
                    }
                });
            });
        } catch (e) {
            this.handleError(e);
        }
        let page = '';
        if (res.body) {
            page = res.body;
        } else {
            page = '<html></html>';
        }
        let $ = cheerio.load(page);
        if (res.response.request) {
            res.response.request.url = res.response.request.href;
            res.response.request.protocol = new Url(res.response.request.href).protocol;
        }
        return { $, res: res.response };
    }
    setSubLinks(subLinks) {
        for (let key of Object.keys(subLinks)) {
            subLinks[key] = {
                column: key,
                subLink: subLinks[key]
            };
        }
        this.site.subLinks = subLinks;
        SITE_CONF[this.site.key].subLinks = subLinks;
        fs.writeFileSync(path.resolve(__dirname, siteConfPath), JSON.stringify(SITE_CONF));
        this.log(SITE_CONF[this.site.key].subLinks);
        // TODO write into database
    }
    setArticle(article) {
        // TODO write into database
        article = new Article(article);
        let that = this;
        article.save(function (err) {
            if (err) return that.handleError(err);
            that.handleArticleSave()
        });
    }
    async handleAllLinks() {
        if (!this.site.subLinks) {
            return;
        }
        let stack = [];
        Object.values(this.site.subLinks).map(async ({ column, subLink }) => {
            stack.push(Promise.resolve(this.getPageContent(subLink)).then(({ $, res }) => {
                this.log(+new Date(), subLink);
                this.parseLink($, res, column);
            }));
        });
        this.log(+new Date(), 'start');
        Promise.all([...stack]).then(() => {
            this.log('dispatch all sub sites success');
        })
    }
    handleError(err) {
        this.log(err)
    }
    handleArticleSave() {
        this.log('article saved');
    }
    parseTime(info) {
        if (!info) { return 0; }
        let reg = SITE_CONF[this.site.key].sourceTimeReg;
        let [, year, month, day, hour, minute] = reg.exec(info);
        this.log(year, month, day, hour, minute);
        return +moment(`${year}-${month}-${day} ${hour}:${minute}`);
    }
    async run() {
        this.init();
        await this.parseHead();
        let times = 0;
        setInterval(async () => {
            if (this.runFlag) {
                await this.handleAllLinks();
                times++;
                this.log(`第${times}抓取`);
            }
        }, 60 * 1000);
    }
    pause() {
        this.runFlag = false;
    }
    restart() {
        this.runFlag = true;
    }
    init() {
        Article.remove({ site: this.site.name }, function (err) {
            if (err) {
                console.log('error deleting old data.');
            }
        });
    }
}
module.exports = { Spider };
// let site = {
//     site: 'http://www.people.com.cn/',
//     name: '人民网'
// };
// let spider = new Spider(site);
// spider.setArticle();
// Article.find({}).exec(function (err, result) {
//     debug(err);
// });