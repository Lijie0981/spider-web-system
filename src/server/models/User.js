const mongoose = require('../../utils/db');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    account: { type: String },
    password: { type: String },
    joinTime: { type: Number },
    subscription: { type: Array },
    avatar: { type: String, default: '/public/img/default-avatar.png' }
});

const User = mongoose.model('User', UserSchema);
let user = new User({
    account: '123',
    password: '123',
    joinTime: +new Date(),
    subscription: [
        { site: '人民网', column: '财经' },
        { site: '网易新闻', column: '排行' },
        { site: '网易新闻', column: '军事' },
        { site: '人民网', column: '时政' },
        { site: '新华网', column: '时政' },
        { site: '人民网', column: '国际' },
        { site: '新华网', column: '高层' },
        { site: '中国新闻网', column: '时政' }
    ]
});
User.findOne({ account: '123' }, function (err, result) {
    if (!result) {
        user.save(function (err) {
            if (err) console.log(err);
        });
    }
})

module.exports = User;