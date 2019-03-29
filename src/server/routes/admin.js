const express = require('express');
const router = express.Router();
const SITE_CONF = require('../../config/site.json');
const jsonFormat = require('json-format');
const User = require('../models/User');
const debug = require('debug')('server:admin');
// const Article = require('../../spider/models/Article');

// define the home page route
router.get('/', function (req, res) {
    if (req.session && req.session.admin) {
        res.redirect('/admin/task');
    } else {
        res.redirect('/login/admin');
    }
});
router.get('/task', function (req, res) {
    if (req.session && req.session.admin) {
        res.render('adminSpiderTask.html');
    } else {
        res.redirect('/login/admin');
    }
});
router.get('/status', function (req, res) {
    if (req.session && req.session.admin) {
        res.render('adminStatus.html');
    } else {
        res.redirect('/login/admin');
    }
});
router.get('/user', async function (req, res) {
    if (req.session && req.session.admin) {
        let users = await new Promise((res, rej)=>{
            User.find({}, function (err, results) {
                if (err) {
                    debug(err, `查询User数据错误`);
                }
                res(results);
            });
        });
        res.render('adminUser.html', {users});
    } else {
        res.redirect('/login/admin');
    }
});
router.get('/config', function (req, res) {
    if (req.session && req.session.admin) {
        res.render('adminSpiderConfig.html', {
            config: jsonFormat(SITE_CONF)
        });
    } else {
        res.redirect('/login/admin');
    }
});
router.post('/', function (req, res) {
    res.send('Birds home page');
});

module.exports = router;