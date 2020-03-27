var db = require("../models/one");
exports.getone = function(req,res){
    db.data.find()
    .then(function(data){
        console.log(data)
    })
    .catch(function(err){
        console.log(err)
    })
}
module.exports = exports;