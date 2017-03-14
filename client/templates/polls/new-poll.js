Template.newPoll.events({
    'submit #new-poll': function(e) {
        console.log('hello');
        e.preventDefault();
        var poll = {
            question: $(e.target).find('[name=question]').val(),
            response1: $(e.target).find('[name=response1').val(),
            response2: $(e.target).find('[name=response2').val(),
            response3: $(e.target).find('[name=response3').val()

        };
        Meteor.call('pollInsert', poll, function(error, result) { // affiche l'erreur à l'utilisateur et s'interrompt
            if (error)
                return alert(error.reason);
               // affiche ce résultat mais route tout de même
            if (result.pollExists)
                alert('Ce lien a déjà été utilisé');
            /*Router.go('single-poll', {
                _id: result._id
            });*/
            Router.go('pollsList');
        });
    }
});
