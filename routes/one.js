var express = require('express');
var router= express.Router();
var db = require('../models/one');
var helpers = require('../helpers/one');
router.route('/')
.get(helpers.getusers)
router.route('/posts')
.get(helpers.getposts)
router.route('/posts/:postid')
.get(helpers.getpost)


module.exports = router;    