Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',
    // Pour les nouvelles pages, on attend que les sondages soit chargés pour éviter page blanche
    waitOn: function() {
        return Meteor.subscribe('polls');
    }
});
Router.route('/', {
    name: 'layout'
})
Router.route('/polls', {
    name: 'pollsList'
});
// Nouveau sondage
Router.route('/poll/new', {
    name: 'newPoll'
});
// Affichage d'un sondage
Router.route('/poll/:_id', {
    name: 'single-poll',
    data: function() {
        return Polls.findOne(this.params._id);
    }
});

// Edition d'un sondage
Router.route('/poll/:_id/edit', {
  name: 'pollEdit',  
  data: function() {
    return Polls.findOne(this.params._id);
  }
});
// Authentification requise
var requireLogin = function() {
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
}
Router.onBeforeAction(requireLogin, {
    only: 'newPoll'
});
