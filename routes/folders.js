var express = require('express');
var router = express.Router();

/* GET Folders page. */
router.get('/', function(req, res, next) {
  res.render('folders');
});

module.exports = router;
