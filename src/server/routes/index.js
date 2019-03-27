const express = require('express');
const router = express.Router();
const User = require('../models/User');
const db = require('../utils/db');
const debug = require('debug')('server:index');

// define the home page route
router.get('/', async function (req, res) {
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
        if (user && user.subscription) {
            let articles = db.getColumnArticle(user.subscription);
            res.render('index.html', { articles });
        } else {
            let articles = await db.getTodayArticles();
            res.render('index.html', { articles });
        }
    } else {
        let articles = await db.getTodayArticles();
        console.log(typeof articles, Object.keys(articles));
        res.render('index.html', { articles });
    }
});



module.exports = router;