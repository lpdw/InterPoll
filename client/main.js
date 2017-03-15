import {
    Template
} from 'meteor/templating';
import {
    ReactiveVar
} from 'meteor/reactive-var';
import { check } from 'meteor/check';
import './main.html';
Meteor.subscribe('polls');
// Exemple pour ne récupérer que les sondages fait par 1 utilisateur 'margaux'
//Meteor.subscribe('polls', 'margaux');
