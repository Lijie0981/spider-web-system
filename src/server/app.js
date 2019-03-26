const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
// const session = require('express-session');
const app = express();
const path = require('path');
const debug = require('debug')('server:server');
const staticPath = './public/';
const viewPath = './views/';
// Setup nunjucks templating engine
nunjucks.configure(path.join(__dirname, viewPath), {
    autoescape: true,
    express: app,
    watch: true,
    tags: {
        blockStart: '<%',
        blockEnd: '%>',
        variableStart: '<$',
        variableEnd: '$>',
        commentStart: '<#',
        commentEnd: '#>'
      }
});
app.use('/public', express.static(path.join(__dirname, staticPath), {
    etag: true,
    maxAge: 2 * 24 * 60 * 60
}));
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Home page
app.get('/', function(req, res) {
    res.render('index.html', {
        page: 'home',
        port: app.get('port')
    });
});
app.get('/login', function(req, res) {
    res.render('login.html');
});
// Other example
app.get('/example', function(req, res) {
    res.render('example.html', {
        page: 'example',
        port: app.get('port')
    });
});

// Kick start our server
app.listen(app.get('port'), function() {
    console.log('Server started on port', app.get('port'));
});