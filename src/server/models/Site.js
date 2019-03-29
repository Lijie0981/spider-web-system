const mongoose = require('../../utils/db');
const SITE_CONF = require('../../config/site.js');
const Schema = mongoose.Schema;
const SiteSchema = new Schema({ 
    key: {type: String},
    name: {type: String},
    index: {type: String},
    htmlClass: {type:Object},
    subLinks: {type:Object},
    sourceTimeReg: {type: Object}
});

const Site = mongoose.model('Site', SiteSchema);
Site.remove({}).exec();
Object.values(SITE_CONF).forEach((item)=>{
    let siteEle = new Site(item);
    siteEle.save();
});
module.exports = Site;