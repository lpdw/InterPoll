Template.pollEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPollId = this._id;

    var pollProperties = {
          question: $(e.target).find('[name=question]').val(),
          response1: $(e.target).find('[name=response1').val(),
          response2: $(e.target).find('[name=response2').val(),
          response3: $(e.target).find('[name=response3').val(),

    };

    Polls.update(currentPollId, {$set: pollProperties}, function(error) {
      if (error) {
        // affiche l'erreur à l'utilisateur
        alert(error.reason);
      } else {
        Router.go('single-poll', {_id: currentPollId});
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Supprimer ce sondage?")) {
      var currentPollId = this._id;
      Polls.remove(currentPollId);
      Router.go('pollsList');
    }
  }
});
