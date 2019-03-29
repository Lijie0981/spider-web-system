const express = require('express');
const router = express.Router();
const User = require('../models/User');
const debug = require('debug')('server:home');
const Site = require('../models/Site');
// const Article = require('../../spider/models/Article');

// define the home page route
router.get('/', async function (req, res) {
    if (req.session && req.session.account) {
        let account = req.session.account;
        let site = await new Promise((res, rej)=>{
            Site.find().select('name subLinks').exists('subLinks', true).exec(function (err, results) {
                if (err) {
                    debug(err, `查询${account}数据错误`);
                }
                res(results);
            });
        });
        let user =  await new Promise((res, rej)=>{
            User.findOne({ account }, function (err, results) {
                if (err) {
                    debug(err, `查询${account}数据错误`);
                }
                res(results);
            });
        });
        let subscription = [];
        Object.values(site).forEach((item)=>{
            subscription.push({
                site: item.name,
                subLinks: Object.values(item.subLinks)
            });
        });
        res.render('home.html', {subscription, site, user});
    } else {
        res.redirect('/login');
    }
});
router.get('/getSubscription', async function(req, res){
    if (req.session && req.session.account) {
        let account = req.session.account;
        let user =  await new Promise((res, rej)=>{
            User.findOne({ account }, function (err, results) {
                if (err) {
                    debug(err, `查询${account}数据错误`);
                }
                res(results);
            });
        });
        res.json(user.subscription);
    } else {
        res.redirect('/login');
    }
});
router.post('/setSubscription', async function(req, res){
    if (req.session && req.session.account) {
        let account = req.session.account;
        await new Promise((res, rej)=>{
            User.findOneAndUpdate({ account }, {subscription: JSON.parse(req.body.subscription)}, function (err, results) {
                if (err) {
                    debug(err, `查询${account}数据错误`);
                }
                res(results);
            });
        });
        res.json({
            updateStatus: 'success'
        });
    } else {
        res.redirect('/login');
    }
});
router.post('/changePassword', async function(req, res){
    if (req.session && req.session.account) {
        let account = req.session.account;
        await new Promise((res, rej)=>{
            User.findOneAndUpdate({ account }, {password: req.body.password}, function (err, results) {
                if (err) {
                    debug(err, `查询${account}数据错误`);
                }
                res(results);
            });
        });
        res.json({
            updateStatus: 'success'
        });
    } else {
        res.redirect('/login');
    }
});
module.exports = router;