const express = require('express');
const router = express.Router();
// const Article = require('../../spider/models/Article');

// define the home page route
router.get('/', function (req, res) {
    if (req.session && req.session.admin) {
        res.render('admin.html');
    } else {
        res.redirect('/login');
    }
});
router.post('/', function (req, res) {
    res.send('Birds home page');
});

module.exports = router;