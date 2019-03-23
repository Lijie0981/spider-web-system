const mongoose = require('mongoose');
const DB_URL = require('../config/db.json').url;
const debug = require('debug')('mongo');

/**
 * 连接
 */
mongoose.connect(DB_URL);

/**
  * 连接成功
  */
mongoose.connection.on('connected', function () {    
    debug('Mongoose connection open to ' + DB_URL);  
});    

/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {    
    debug('Mongoose connection error: ' + err);  
});    
 
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {    
    debug('Mongoose connection disconnected');  
});    

module.exports = mongoose;