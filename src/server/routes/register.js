const express = require('express');
const router = express.Router();
const User = require('../models/User');
const debug = require('debug')('server:register');
// define the home page route
router.get('/', function (req, res) {
    res.render('login.html');
});
router.post('/', async function (req, res) {
    // let {account, password};
    let {account,password} = req.body;
    if (account && password) {
        let user = await new Promise((res, rej)=>{
            User.findOne({ account }, function (err, results) {
                if (err) {
                    debug(err, `查询${account}数据错误`);
                }
                res(results);
            });
        });
        if (user) {
            res.json({
                registerType: 'error',
                msg: '用户名已存在'
            });
        } else {
            let user = new User({
                account,
                password,
                joinTime: +new Date()
            });
            user.save(function (err) {
                if (err) debug(err);
            });
            res.json({
                registerType: 'success'
            });
        }
    }
});


module.exports = router;