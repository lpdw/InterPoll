import {
    Template
} from 'meteor/templating';
import {
    ReactiveVar
} from 'meteor/reactive-var';

import './main.html';
Meteor.subscribe('polls');
// Exemple pour ne récupérer que les sondages fait par 1 utilisateur 'margaux'
//Meteor.subscribe('polls', 'margaux');
Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.registerEmail.value;
        var passwordVar = event.target.registerPassword.value;
        Accounts.createUser({
            email: emailVar,
            password: passwordVar
        });
    }
});
Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
        Meteor.loginWithPassword(emailVar, passwordVar);
    }
});

Template.logged.events({
    'click .logout': function(event) {
        event.preventDefault();
        Meteor.logout();
    }
});
