var db = require("../models/user");
var post = require("../models/one")
exports.getusers = function(req,res){
    db.find()
    .then(function(data){
        res.json(data)
    })
    .catch(function(err){
       res.send(err)
    })
}
exports.getposts = function(req,res){
    post.data.find()
    .then(function(data){
        res.json(data)
    })
    .catch(function(err){
       res.send(err)
    })
}    

exports.getpost = function(req,res){
    post.data.findOne({image: req.body.image})
    .then(function(data){
        res.json(data)
    })
    .catch(function(err){
       res.send(err)
    })
}

module.exports = exports;