Template.pollsList.helpers({
    polls: function() {
        return Polls.find();
        //// Exemple pour ne récupérer que les sondages fait par 1 utilisateur 'margaux'
        //  return Polls.find({author: 'margaux'});
    }
});
