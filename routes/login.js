const router = require('express').Router();
const _ = require("lodash");
const passport = require('passport');

router.get('/', (req, res) => {
   const err = (req.session.err) ? req.session.err : null;
   const user ="";
   if (req.accepts('text/html')) {
       return res.render('login', { err: req.flash('error'), user:user});
   }
   next(new APIError(406, 'Not valid type for asked ressource'));
});


router.post('/',
   passport.authenticate('local', {
       successRedirect: '/polls',
       failureRedirect: '/login',
       failureFlash: true
      })
);

module.exports = router;
