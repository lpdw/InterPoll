Polls = new Mongo.Collection('polls',{idGeneration: 'STRING'});
Polls.allow({
    insert: function(userId, doc) {
        // autoriser la création de sondage seulement si l'utilisateur est authentifié
        return !!userId;
    }
});
Meteor.methods({
    pollInsert: function(pollAttributes) {
        check(Meteor.userId(), String);
        check(pollAttributes, {
            question: String,
            response1: String,
            response2: String,
            response3: String,
        });


        var user = Meteor.user();
        var poll = _.extend(pollAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date()
        });
        var pollID = Polls.insert(poll);
        return {
            _id: pollID
        };
    }
});
