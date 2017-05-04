const router = require('express').Router();
const UserService = require('../services/users');
const _ = require("lodash");
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

router.get('/', (req, res, next) => {
    const err = (req.session.err) ? req.session.err : null;
    if (req.accepts('text/html')) {
        return res.render('signup', {
           err: err
        });
    }
    next(new APIError(406, 'Not valid type for asked ressource'));
});

const bodyVerificator = (req, res, next) => {
    if (req.body.username && req.body.password && req.body.confirm_password && req.body.email) {
        return next();
    }
    const attributes = _.keys(req.body);
    const mandatoryAttributes = ['username', 'password', 'email'];
    const missingAttributes = _.difference(mandatoryAttributes, attributes);
    const emptyAttributes = _.filter(mandatoryAttributes, key => _.isEmpty(req.body[key]));
    let error = null;
    if (missingAttributes.length) {
        error = new APIError(400, 'Champs manquant:' + missingAttributes.toString());
    }
    if (!error && emptyAttributes.length) {
        error = new APIError(400, emptyAttributes.toString() + ' ne doit pas être vide');
    }
    console.log(req.body.password);
    console.log(req.body.confirm_password);
    console.log(req.body.password.localeCompare(req.body.confirm_password));
    if(req.body.password.localeCompare(req.body.confirm_password)!=0){
      error = new APIError(400, "Les mots de passe ne correspondent pas");
    }
    if (req.accepts('text/html')) {
        req.session.err = error.message;
        return res.redirect('/signup');
    }

    return next(error);
};

router.post('/', bodyVerificator, (req, res, next) => {
    if (!req.accepts('application/json') && !req.accepts('text/html')) {
        return next(new APIError(406, 'Not valid type for asked ressource'));
    }
    UserService.findOneByQuery({
            username: req.body.username
        })
        .then(user => {
            if (user) {
                return Promise.reject(new APIError(409, "L'identifiant existe déjà"));
            }
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            req.body.password = hash;
            return UserService.createUser(req.body.username,req.body.email,req.body.password);
        })
        .then(user => {
            if (req.accepts('text/html')) {
                return res.render('registered', {
                    user: _.omit(user.dataValues, 'password')
                });
            }
            return res.status(200).send(_.omit(user.dataValues, 'password'));
        })
        .catch(error => {
            if (req.accepts('text/html')) {
                req.session.err = error.message;
                return res.redirect('/signup');
            } else {
                return next(error);
            }
        });
});
module.exports = router;
