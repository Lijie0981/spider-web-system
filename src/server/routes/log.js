const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const debug = require('debug')('server:log');
router.get('/', function (req, res) {
    if (req.query.tc) {
        let log = new Log({
            time: +new Date(),
            type: 'jump',
            url: req.query.tc,
            account: req.session && req.session.account ? req.session.account : null
        });
        log.save();
        res.redirect(decodeURIComponent(req.query.tc));
    } else {
        res.redirect('/');
    }
});
router.post('/', function (req, res) {
    if (req.body) {
        let log = new Log(req.body);
        log.save();
        res.json({
            saveStatus: 'success'
        });
    }
});

module.exports = router;