var express = require('express');
var router = express.Router();
var userService = require("../services/users");
/* GET users listing. */
router.get('/', function(req, res, next) {
  const user= req.user;
  userService.currentUser(user.id)
  .then(user=>{
    console.log(user);
    return user.getPolls();
  }).then(polls => {
    console.log(polls);
    return res.render('polls/all',{ polls : polls });
  });
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
