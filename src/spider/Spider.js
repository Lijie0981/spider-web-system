const cheerio = require('cheerio');
const debug = require('debug');
const request = require('superagent');
require('superagent-charset')(request);

class Spider {
    constructor (site) {
        this.site = site;
        this.log = debug(`spider:${this.site.name}`);
    }
    async getPageContent(url) {
        let res = await request.get(url)
                    .charset('gbk');
        let page = '';
        if (res.text) {
            page = res.text;
        }
        page = '<html></html>';
        return cheerio.load(page);
    }
    createDatabase() {

    }
    setSubSites(subSite) {
        this.site.subSite = subSite;
        // TODO write into database
    }
    setArticle(acticle) {
        // TODO write into database
    }
    run () {}
    pause () {}
}
// let site = {
//     site: 'http://www.people.com.cn/',
//     name: '人民网'
// };
// let spider = new Spider(site);
// spider.getPageContent(site.site);