var express = require('express');
var router= express.Router();
var db = require('../models/one');
var helpers = require('../helpers/one');
router.route('/')
.get(helpers.getone)

module.exports = router;