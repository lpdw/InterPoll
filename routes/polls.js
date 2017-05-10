/* jshint esversion: 6 */
/* jshint node: true */

var express = require('express');
var router = express.Router();
var userService = require("../services/users");
var pollService = require("../services/polls");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jQuery')(window);
const  uuid = require('uuid');
const fs = require('fs');
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v1()+"."+file.mimetype.split("/")[1])
  }
})
const upload = multer({ storage: storage});

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

router.post('/new',upload.single('logo'), function(req, res, next) {
  var allEditorValues = $('.build-wrap').map(function() {
    return $(this).data("formBuilder").actions.getData("json");
  });
  var form_json = JSON.stringify(allEditorValues);
  console.log("console log : ", $);
  var filename = req.file.path;

  // PollService.createPoll(req.body.title,form_json,req.body.logo,req.body.font,req.body.font_color,req.body.background_color)
  pollService.createPoll(req.body.title,form_json,filename,req.body.font,req.body.font_color,req.body.background_color)
  .then(poll=>{
    // console.log(poll);
    poll.setUser(req.user.id);
    req.flash("success", "Le sondage a bien été créé");

    res.redirect("edit/" + poll.id);
  }).catch(err=>{
    // console.log("error : ", err);
  });
});

router.get('/:id', function(req, res, next) {
  res.locals.userLogged=false;
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
