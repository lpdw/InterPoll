const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const UserService = require('../services/users');
module.exports.interpollLocalStrategy = () => {
  return new LocalStrategy((username, password, done) => {
       return UserService.findOneByQuery({ username: username })
           .then(user => {
               if (!user) {
                  return done(null, false, { message: 'Identifiant incorrect' });
               }
               if (!bcrypt.compareSync(password, user.password)) {
                   return done(null, false, { message: 'Mot de passe incorrect'});
               }
               return done(null, user);
           })
           .catch(err => {
               return done(err);
}); });
};
