const mongoose = require('../../utils/db');
const Schema = mongoose.Schema;
const LogSchema = new Schema({ 
    type: {type: String},
    time: {type: Number},
    xpath: {type: String},
    account: {type:String},
    url: {type:String}
});

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;