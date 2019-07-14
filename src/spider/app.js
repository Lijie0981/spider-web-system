
const Chinanews = require('./sites/chinanews');
const Netease = require('./sites/netease');
const People = require('./sites/people');
const Sina = require('./sites/sina');
const Xinhuanet = require('./sites/xinhuanet');
const task = require('./Task');
const SITE_CONF = require('../config/site');
let chinanews = new Chinanews(SITE_CONF.chinanews);
// let netease = new Netease(SITE_CONF.netease);
// let people = new People(SITE_CONF.people);
// let sina = new Sina(SITE_CONF.sina);
// let xinhuanet = new Xinhuanet(SITE_CONF.xinhuanet);

task.run();
// setTimeout(()=>{
//     task.pause(chinanews);
// }, 10000);
// setTimeout(()=>{
//     task.restart(chinanews);
// }, 13000);
