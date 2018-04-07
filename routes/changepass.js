var express = require('express');
var router = express.Router();


/* GET ChangePass page. */
router.get('/', function(req, res, next) {
  res.render('changepass');
});


module.exports = router;