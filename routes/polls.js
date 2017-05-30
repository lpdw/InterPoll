/* jshint esversion: 6 */
/* jshint node: true */

var express = require('express');
var router = express.Router();
var cookie = require('cookie');


var userService = require("../services/users");
var pollService = require("../services/polls");
var themeService = require("../services/themes");
var TinyURL = require('tinyurl');

const uuid = require('uuid');

// Gestion de l'upload de fichier
const fs = require('fs');
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    // Renommage des fichiers avec un UUID pour éviter les duplicatas
    cb(null, uuid.v1() + "." + file.mimetype.split("/")[1])
  }
})
const upload = multer({
  storage: storage
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  const user = req.user;
  userService.currentUser(user.id)
    .then(user => {
      return user.getPolls();
    }).then(polls => {
      return res.render('polls/all', {
        polls: polls
      });
    });
});

router.get('/new', function(req, res, next) {
  // Affichages des thèmes disponibles dans le formulaire de création d'un sondage
  themeService.findAll().then(
    themes => {
      return res.render('polls/new', {
        themes: themes
      });
    }
  )
});

router.post('/new', upload.single('logo'), function(req, res, next) {

  var filename = req.file.path;

  pollService.createPoll(req.body.title, req.body.form_json, filename, req.body.font, req.body.font_color, req.body.background_color)
    .then(poll => {
      poll.setUser(req.user.id);
      poll.setTheme(req.body.theme);
      req.flash("success", "Le sondage a bien été créé");
      res.redirect("edit/" + poll.id);
    }).catch(err => {
      // console.log("error : ", err);
    });
});

router.get('/live/:id', function(req, res, next) {
  const io = req.app.get('socketio');
  // On vérifie que le sondage avec cet id existe et est en ligne
  pollService.findLivePollById(req.params.id)
    .then( poll => {
      if(poll !== null){
        themeService.findById(poll.fk_theme)
          .then(theme => {
            console.log(JSON.parse(poll.form_json).length);
            // On affiche le template correspondant au thème et on affiche la première question du formulaire
            return res.render('polls/themes/' + theme.page, {
              poll: poll, first_form : JSON.parse(poll.form_json)[0]
            });


        }).catch(err => {
          console.log(err);
        });
}     else{
  return res.status(404).send("Ce sondage n'est pas disponible.");

}
    }).catch(err => {
      console.log(err);
    });

});

// Mise en ligne du sondage
// TODO :  Génération Tiny URL + QR Code
router.get('/online/:id', function(req, res, next) {
  pollService.onlinePoll(req.params.id)
    .then(poll => {
      TinyURL.shorten(req.headers.referer+"/live/"+req.params.id, function(url) {
        req.flash("success", "Le sondage a bien été mis en ligne à l'url suivante : "+url);
        res.redirect("/polls");
});

    });
});

router.get('/offline/:id', function(req, res, next) {
  pollService.offlinePoll(req.params.id)
    .then(poll => {
      req.flash("success", "Le sondage a bien été mis en hors ligne");
      res.redirect("/polls");
    });
});
router.get('/edit/:id', function(req, res, next) {
  themeService.findAll().then(
    themes => {
      pollService.findById(req.params.id)
        .then(poll => {
          return res.render('polls/edit', {
            themes: themes,
            poll: poll
          });

        });
    }
  )
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
