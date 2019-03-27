const mongoose = require('../../utils/db');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    account: { type: String },
    password: { type: String },
    joinTime: { type: Number },
    subscription: { type: Object },
    avatar: { type: String, default: 'public/img/default-avatar.png' }
});

const User = mongoose.model('User', UserSchema);
let user = new User({
    account: '123',
    password: '123',
    joinTime: +new Date()
});
User.findOne({ account: '123' }, function (err, result) {
    if (!result) {
        user.save(function (err) {
            if (err) console.log(err);
        });
    }
})

module.exports = User;