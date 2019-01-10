var mongoose = require('mongoose');

var roundSchema = mongoose.Schema({
    tournament_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    matches: [{
        team_1: { 
            player_1: String, 
            player_2: String, 
            score: Number 
        },
        team_2: { 
            player_1: String, 
            player_2: String, 
            score: Number 
        }
    }],
    sitOuts:[String]
});

roundSchema.index({ roundNum: 1, tournament_id: 1 }, { unique: true });

// export player model
var Round = module.exports = mongoose.model('round', roundSchema);
module.exports.get = function (callback, limit) {
    Round.find(callback).limit(limit);
}