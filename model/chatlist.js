var mongoose = require('mongoose');
var ChatlistSchema = new mongoose.Schema({
    msg : {type:String},
    time:{type:Date},
    img:{type:String},
    nickname:{type:String},
    id:{type:String},
});

var ChatlistModel = mongoose.model("chatlist", ChatlistSchema);
module.exports = ChatlistModel;
