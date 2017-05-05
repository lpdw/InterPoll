const router = require('express').Router();
const UserService = require('../services/users');
const _ = require("lodash");
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const APIError = require('../lib/error');

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
    let error = null;

    if (req.body.username && req.body.password && req.body.confirm_password && req.body.email && (req.body.confirm_password.localeCompare(req.body.password) == 0)) {
        return next();
    } else if (req.body.confirm_password.localeCompare(req.body.password) != 0) {
        error = new APIError(400, "Les mots de passe ne correspondent pas!  ");
    }
    const attributes = _.keys(req.body);
    const mandatoryAttributes = ['username', 'password', 'email'];
    const missingAttributes = _.difference(mandatoryAttributes, attributes);
    const emptyAttributes = _.filter(mandatoryAttributes, key => _.isEmpty(req.body[key]));
    if (missingAttributes.length) {
        error = new APIError(400, 'Champs manquants :' + missingAttributes.toString());
    }
    if (!error && emptyAttributes.length) {
        error = new APIError(400, emptyAttributes.toString() + ' doit être saisi');
    }
    if (req.accepts('text/html')) {
        req.session.err = error.message;
        return res.render('signup', {
            err: req.session.err
        });
    }
    return next(error);
};

router.post('/', bodyVerificator, (req, res, next) => {
    if (!req.accepts('application/json') && !req.accepts('text/html')) {
        return next(new APIError(406, 'Not valid type for asked ressource'));
    }
    UserService.UserExists(req.body.username,req.body.email)
        .then((users) => {
            if (users.count>0) {
                return Promise.reject(new APIError(409, "Cet identifiant ou cette adresse e-mail sont déjà utilisés"));
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
                return res.render('signup', {
                    err: req.session.err
                });
            } else {
                return next(error);
            }
        });
});
module.exports = router;
