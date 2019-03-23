const mongoose = require('../../utils/db');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({ 
    url: { type: String },                   
    time: {type: Date},                        
    content: {type: String},                       
    title: { type: String},                 
    info: { type: String},
    site: {type: String},
    column: {type: String}
});
const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;