var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const user = req.user;
  const err = (req.session.err) ? req.session.err : null;
  return res.render('myaccount', {
      err: err,
      user:user
  });
});
router.post('/', (req, res, next) => {
    // TODO: update user account

});
module.exports = router;
