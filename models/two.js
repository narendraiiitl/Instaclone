var mongoose = require('mongoose');
var dataschema = new mongoose.Schema({
    name:   {
        type: String,
        required: "Name can not be blank"
    },
    created:{
        type: Date,
        default: Date.now
    },
    image:String

});
var data = mongoose.model("data",dataschema);
module.exports = data;