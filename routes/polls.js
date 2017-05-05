var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  return res.render('polls');
});

router.get('/:id', function(req, res, next) {
  console.log(req.isAuthenticated());
  return res.render('poll');
});

router.get('/edit/:id', function(req, res, next) {
  console.log(req.isAuthenticated());
  return res.render('edit');
});

module.exports = router;
