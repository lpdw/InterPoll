Polls = new Mongo.Collection('polls');
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

        // éviter les doublons
        var pollSameLink = Polls.findOne({
            url: pollAttributes.url
        });
        if (pollSameLink) {
            return {
                pollExists: true,
                _id: pollSameLink._id
            }
        }
        var user = Meteor.user();
        var poll = _.extend(postAttributes, {
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
