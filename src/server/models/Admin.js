const mongoose = require('../../utils/db');
const Schema = mongoose.Schema;
const AdminSchema = new Schema({ 
    account: {type: String},
    password: {type: String},
    createTime: {type: Number},
    avatar: {type: String, default: 'public/img/default-avatar.png'}
});

const Admin = mongoose.model('Admin', AdminSchema);
let admin = new Admin({
    account: '123',
    password: '123',
    createTime: +new Date()
});
Admin.findOne({ account: '123' }, function (err, result) {
    if (!result) {
        admin.save(function (err) {
            if (err) console.log(err);
        });
    }
});
module.exports = Admin;
