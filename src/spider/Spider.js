const cheerio = require('cheerio');
const debug = require('debug');
const request = require('request');
const iconv = require('iconv-lite');
const siteConfPath = '../config/site.json';
const SITE_CONF = require('../config/site.js');
const fs = require('fs');
const path = require('path');
const Article = require('./models/Article');
const moment = require('moment');
const Url = require('url-parse');
class Spider {
    constructor(site) {
        this.site = site;
        this.log = debug(`spider:${this.site.name}`);
        this.site.pageLinks = new Set();
        this.site.articles = new Map();
        this.fetchTimes = 0;
        this.errorNum = 0;
        this.parseTimes = 0;
        this.runFlag = true;
    }
    async parseHead() {
        if (SITE_CONF[this.site.key].subLinks && Object.values(SITE_CONF[this.site.key].subLinks).length !== 0) { this.log(SITE_CONF[this.site.key].subLinks); return; }
        let { $, res } = await this.getPageContent(this.site.index);
        let $headers = $(SITE_CONF[this.site.key].htmlClass.header);
        let subLinks = {};
        $headers.each((i, e) => {
            let href = cheerio(e).attr('href').indexOf('//') == 1 && cheerio(e).attr('href').indexOf('http') == -1 ? res.request.protocol + cheerio(e).attr('href') : cheerio(e).attr('href');
            href = href.match(/\.(com|cn)/) ? href : this.site.index + href.substring(1);
            subLinks[cheerio(e).text().trim()] = href;
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
                        this.handleError(err, `请求${url}失败`);
                    }
                    else {
                        let charset = "utf-8";
                        let arr = body.toString().match(/<meta([^>]*?)>/g);
                        if (response.headers['content-type'].match(/GB/i)) {
                            charset = 'gbk';
                        }
                        if (arr && charset !== 'gbk') {
                            arr.forEach(function (val) {
                                let match = val.match(/charset\s*=\s*(.+)\"/);
                                if (match && match[1]) {
                                    if (match[1].substr(0, 1) == '"') match[1] = match[1].substr(1);
                                    charset = match[1].trim();
                                    return false;
                                }
                            })
                        }
                        this.log('page charset',charset);
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
    async getArticle(query) {
        return await new Promise((res, rej)=>{
            Article.find({ site: this.site.name }, function (err, results) {
                if (err) {
                    this.handleError(err, `查询${this.site.name}数据错误`);
                }
                res(results);
            });
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
    handleError(err, msg) {
        this.errorNum++;
        this.log(err, msg);
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
        this.log(`${this.startTime}：${this.site.name}新闻爬虫已开始任务。`);
        this.startTime = moment().format('YYYY-MM-DD HH:mm:ss');
        this.init();
        await this.parseHead();
        setInterval(async () => {
            if (this.runFlag) {
                await this.handleAllLinks();
                this.fetchTimes++;
                this.log(`第${this.fetchTimes}抓取\t${moment().format('YYYY-MM-DD HH:mm:ss')}`);
            }
        }, 60 * 1000);
    }
    pause() {
        this.runFlag = false;
        this.parseTimes++;
        this.pauseTime = moment().format('YYYY-MM-DD HH:mm:ss');
        this.log(`${this.site.name}新闻爬虫已暂停。${this.startTime}开始${this.parseTime}停止。\n请求次数${this.fetchTimes}`);
    }
    restart() {
        this.startTime = moment().format('YYYY-MM-DD HH:mm:ss');
        this.runFlag = true;
        this.log(`${this.startTime}：${this.site.name}新闻爬虫已重新开始任务。`);
    }
    init() {
        Article.remove({ site: this.site.name }, function (err) {
            if (err) {
                this.handleError(err, `初始化${this.site.name}数据错误`);
            }
        });
    }
    async info() {
        let toDayArticles = await this.getArticle({ site: this.site.key, time: { $gte: +moment(moment().format('YYYY-MM-DD 00:00:00')), $lte: +moment(moment().format('YYYY-MM-DD 23:59:59')) } });
        return {
            fetchTimes: this.fetchTimes,
            errorNum: this.errorNum,
            allArticlesNum: Object.keys(this.site.articles).length,
            toDayArticlesNum: toDayArticles.length,
            subLinks: this.site.subLinks,
            startTime: this.startTime,
            pauseTimes: this.parseTimes
        }
    }
}

module.exports = { Spider };
// TODO
// 1. 获取所有链接要做去重处理。