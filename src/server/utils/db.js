const User = require('../models/User');
const Article = require('../../spider/models/Article');
const moment = require('moment');
const debug = require('debug')('server:DB');
const fs = require('fs');
class DB {
    async getTodayArticles() {
        return await new Promise((res, rej) => {
            Article.find({
                title: /.+/g,
                content: /.+/g,
                info: /.+/g,
                time: {
                    $gte: +moment(moment().format('YYYY-MM-DD 00:00:00')),
                    $lte: +moment(moment().format('YYYY-MM-DD 23:59:59'))
                }
            }).sort({ time: 'desc' }).limit(100).exec(function (err, results) {
                if (err) {
                    debug(err, `查询${this.site.name}数据错误`);
                }
                res(results);
            });
        });
    }
    async getColumnArticle(column) {
        return await new Promise((res, rej) => {
            Article.find({
                title: /.+/g,
                content: /.+/g,
                info: /.+/g,
                $or: column,
                time: {
                    $gte: +moment(moment().format('YYYY-MM-DD 00:00:00')),
                    $lte: +moment(moment().format('YYYY-MM-DD 23:59:59'))
                }
            }).sort({ time: 'desc' }).limit(100).exec(function (err, results) {
                if (err) {
                    debug(err, `查询数据错误`);
                }
                res(results);
            });
        });
    }
}
let db = new DB();
module.exports = db;