const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const User = require('../models/User');
const debug = require('debug')('server:new');

// define the home page route
router.get('/', async function (req, res) {
    let articles = await db.getTodayArticles();
    let user = null;
    if(req.session && req.session.account){
        let account = req.session.account;
        user =  await new Promise((res, rej)=>{
            User.findOne({ account }, function (err, results) {
                if (err) {
                    debug(err, `查询${account}数据错误`);
                }
                res(results);
            });
        });
    }
    res.render('new.html', { articles, user });
});

module.exports = router;