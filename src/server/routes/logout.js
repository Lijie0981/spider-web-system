const express = require('express');
const router = express.Router();
const debug = require('debug')('server:logout');
const User = require('../models/User');
const Admin = require('../models/Admin');

// define the home page route
router.get('/', function (req, res) {
    if(req.session && req.session.account){
        delete req.session.account;
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

module.exports = router;