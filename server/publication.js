// Choix des éléments envoyés au client

Meteor.publish('polls', function() {
  return Polls.find();
});
