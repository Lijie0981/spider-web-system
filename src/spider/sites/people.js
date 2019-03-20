import { Spider } from './Spider';
import SITE_CONF from '../config/site.json';
import cheerio from 'cheerio';

export class People extends Spider {
    constructor(site) {
        super(site);
    }

    async parseHead() {
        let $ = await this.getPageContent(this.site.site);
        let $headers = $(SITE_CONF.people.htmlClass.header).children();
        let subSites = {};
        for (let $key in $headers) {
            if (+$key >= 0 && $headers[$key].tagName === "span") {
                subSites[cheerio($headers[$key]).children('a').text()] = cheerio($headers[$key]).children('a').attr('href');
            }
        }
        people.log('subSites', subSites);
        people.setSubSites(subSites);
        return this;
    }
    async parseArticle() {
        
    }
}
export let people = new People(SITE_CONF.people);
// people.parseHead();