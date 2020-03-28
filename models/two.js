var mongoose = require('mongoose');
var postschema = new mongoose.Schema({
    image:String,
    tag:String,
    content:   {
        type: String,
        required: "Name can not be blank"
    },
    created:{
        type: Date,
        default: Date.now
    },
    likes: [ String ],
    comments: [{
        user : String,
        comment : String
    }]
});
var post = mongoose.model("post",postschema);
module.exports = post;