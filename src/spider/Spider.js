const cheerio = require('cheerio');
const debug = require('debug');
const request = require('superagent');
require('superagent-charset')(request);
const siteConfPath = '../config/site.json';
const SITE_CONF = require('../config/site.json');
const fs = require('fs');
const path = require('path');
const Article = require('./models/Article');
class Spider {
    constructor (site) {
        this.site = site;
        this.log = debug(`spider:${this.site.name}`);
    }
    async getPageContent(url) {
        let res = {};
        try {
            res = await request.get(url)
                    .charset('gbk'); 
        } catch (error) {
            return {};
        }
        let page = '';
        if (res.text) {
            page = res.text;
        } else {
            page = '<html></html>';
        }
        let $ = cheerio.load(page);
        return {$, res};
    }
    setSubLinks(subLinks) {
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
    handleError (err) {
        this.log(err)
    }
    handleArticleSave () {
        this.log('article saved');
    }
    run () {}
    pause () {}
    init () {
        Article.remove({}, function(err) {
            if (err) {
                console.log ('error deleting old data.');
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