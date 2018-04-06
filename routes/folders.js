var express = require('express');
var router = express.Router();

/* GET Folders pade. */
router.get('/folders', function(req, res, next) {
  res.render('folders');
});

module.exports = router;
