var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  return res.render('polls');
});

router.get('/:id', function(req, res, next) {
  return res.render('poll');
});

module.exports = router;
