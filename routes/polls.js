var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  return res.render('polls/all');
});
router.get('/new', function(req, res, next) {
  return res.render('polls/new');
});
router.get('/:id', function(req, res, next) {
  return res.render('polls/show');
});


router.get('/edit/:id', function(req, res, next) {
  return res.render('polls/edit');
});

module.exports = router;
