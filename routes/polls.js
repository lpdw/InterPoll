/* jshint esversion: 6 */
/* jshint node: true */

var express = require('express');
var router = express.Router();
var userService = require("../services/users");
var PollService = require("../services/polls");
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
  PollService.createPoll("Un titre",form_json,"path logo","font family","font color","background color")
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

router.get('/edit/:id', function(req, res, next) {
  return res.render('polls/edit');
});

module.exports = router;
