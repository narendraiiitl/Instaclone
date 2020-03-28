var mongoose=require("mongoose");
var post= require("./one")
var passportlocalmongoose=require("passport-local-mongoose");
var userschema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    posts:[ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"post.data"
        }
    ]
});
userschema.plugin(passportlocalmongoose);
module.exports = mongoose.model("user",userschema);