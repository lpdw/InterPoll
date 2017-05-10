/* jshint esversion: 6 */
/* jshint node: true */

var express = require('express');
var router = express.Router();
var userService = require("../services/users");
var pollService = require("../services/polls");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jquery')(window);

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

router.post('/new', function(req, res, next) {
  var allEditorValues = $('.build-wrap').map(function() {
    return $(this).data("formBuilder").actions.getData("json");
  });
  var form_json = JSON.stringify(allEditorValues);
  // console.log("form json : ", allEditorValues);
  // console.log(req.body);
  // PollService.createPoll(req.body.title,form_json,req.body.logo,req.body.font,req.body.font_color,req.body.background_color)
  pollService.createPoll("Un titre",form_json,"path logo","font family","font color","background color")
  .then(poll=>{
    console.log(poll);
    poll.setUser(req.user.id);
    req.flash("success", "Le sondage a bien été créé");

    res.redirect("edit/" + poll.id);
  }).catch(err=>{
    console.log("error : ", err);
  });
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
