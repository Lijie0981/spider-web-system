const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const staticPath = './public/';
const viewPath = './views/';
const moment = require('moment');
const session = require('express-session');
const debug = require('debug')('server');

const home = require('./routes/home');
const index = require('./routes/index');
const login = require('./routes/login');
const register = require('./routes/register');
const news = require('./routes/new');
const log = require('./routes/log');
const admin = require('./routes/admin');
const logout = require('./routes/logout');

// Setup nunjucks templating engine
nunjucks.configure(path.join(__dirname, viewPath), {
    autoescape: true,
    express: app,
    watch: true,
    tags: {
        blockStart: '<%',
        blockEnd: '%>',
        variableStart: '{$',
        variableEnd: '$}',
        commentStart: '<#',
        commentEnd: '#>'
    }
});
// setup static resource path
app.use('/public', express.static(path.join(__dirname, staticPath), {
    etag: true,
    maxAge: 2 * 24 * 60 * 60
}));
app.use(session({
    secret: 'secret', // 对session id 相关的cookie 进行签名
    resave: true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie: {
        maxAge: 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
    },
}));
// set service port
app.set('port', process.env.PORT || 3000);
// use pody-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// route
app.use('/', index);
app.use('/home', home);
app.use('/login', login);
app.use('/register', register);
app.use('/new', news);
app.use('/log', log);
app.use('/admin', admin);
app.use('/logout', logout);

// Kick start our server
app.listen(app.get('port'), function () {
    debug('Server started on port', app.get('port'));
});