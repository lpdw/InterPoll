var express = require('express');
var router = express.Router();
var userService = require("../services/users");
var pollService = require("../services/polls");
/* GET users listing. */
router.get('/', function(req, res, next) {
  const user= req.user;

  userService.currentUser(user.id)
  .then(user=>{
    return user.getPolls();
  }).then(polls => {
    return res.render('polls/all',{ polls : polls});
  });
});
router.get('/new', function(req, res, next) {
  console.log(req.user);
  return res.render('polls/new');
});
router.get('/:id', function(req, res, next) {
  return res.render('polls/show');
});

router.get('/online/:id', function(req, res, next) {
  pollService.onlinePoll(req.params.id)
  .then(poll =>{
    req.flash("success", "Le sondage a bien été mis en ligne à l'url suivante :");
      res.redirect("/polls");
  });
});
router.get('/offline/:id', function(req, res, next) {
  pollService.offlinePoll(req.params.id)
  .then(poll =>{
    req.flash("success", "Le sondage a bien été mis en hors ligne");
      res.redirect("/polls");
  });});
router.get('/edit/:id', function(req, res, next) {
  return res.render('polls/edit');
});

router.delete('/delete/:id', function(req, res) {
  return pollService.destroy(req.params.id)
          .then(poll => {
            req.flash("success", "Le sondage a bien été supprimé");
              res.redirect("/polls");
          })
          .catch(err => {
            req.flash("error", "Une erreur est parvenue lors de la suppression du sondage");
              res.redirect("/polls");
                      });
});

module.exports = router;
