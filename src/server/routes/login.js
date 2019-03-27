const express = require('express');
const router = express.Router();
const debug = require('debug')('server:login');
const User = require('../models/User');
const Admin = require('../models/Admin');

// define the home page route
router.get('/', function (req, res) {
    if(req.session && req.session.account){
        res.redirect('/');
    } else {
        res.render('login.html');
    }
});
router.get('/admin', function (req, res) {
    if(req.session && req.session.admin){
        res.redirect('admin');
    } else {
        res.render('adminLogin.html');
    }
});
router.post('/', async function (req, res) {
    debug('post', req.body);
    let {account,password} = req.body;
    if (account && password) {
        let user = await new Promise((res, rej)=>{
            User.findOne({ account, password }, function (err, results) {
                if (err) {
                    debug(err, `查询${account}数据错误`);
                }
                res(results);
            });
        });
        if (user) {
            req.session.account = account;
            res.json({
                loginType: 'success'
            });
        } else {
            res.json({
                loginType: 'error',
                msg: '用户名或密码错误'
            });
        }
    }
});
router.post('/admin', async function (req, res) {
    debug('post', req.body);
    let {account,password} = req.body;
    if (account && password) {
        let admin = await new Promise((res, rej)=>{
            Admin.findOne({ account, password }, function (err, results) {
                if (err) {
                    debug(err, `查询${account}数据错误`);
                }
                res(results);
            });
        });
        if (admin) {
            req.session.admin = account;
            res.json({
                loginType: 'success'
            });
        } else {
            res.json({
                loginType: 'error',
                msg: '用户名或密码错误'
            });
        }
    }
});

module.exports = router;