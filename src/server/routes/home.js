const express = require('express');
const router = express.Router();
// const Article = require('../../spider/models/Article');

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
        let subscription = {};
        res.render('home.html', {user, subscription});
    } else {
        res.redirect('/login');
    }
});

module.exports = router;