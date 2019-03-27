const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
// define the home page route
router.get('/', async function (req, res) {
    let articles = await db.getTodayArticles();
    console.log(typeof articles, Object.keys(articles));
    res.render('new.html', { articles });
});

module.exports = router;