const mongoose = require('../../utils/db');
const Schema = mongoose.Schema;

const SiteSchema = new Schema({
    index: { type: String },
    key: {type: String},
    name: {type: String},
    htmlClass: { type: Object},
    subLinks: { type: String},
    sourceTimeReg: {type: Object}
});
const Site = mongoose.model('Site', SiteSchema);
module.exports = Site;
