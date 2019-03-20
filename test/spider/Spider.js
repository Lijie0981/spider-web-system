const Spider = require('../../src/spider/Spider');
var expect = require('chai').expect;
let site = {
    site: 'http://www.people.com.cn/',
    name: '人民网'
};
let spider = new Spider(site);

describe('Spider', function () {
    it('getPage', async function () {
        let res = await spider.getPageContent(site.site);
            
    });
});