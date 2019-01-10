//tournamentPlayerModel.js

var mongoose = require('mongoose');

// setup schema
var tournamentPlayerSchema = mongoose.Schema({
    player_id: {
        type: String,
        required: true
    },
    tournament_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    payed: Boolean,
    roundJoined: Number,
    active: Boolean
});

// make sure that there can be only one combination of the same player_id and tournament_id
tournamentPlayerSchema.index({ player_id: 1, tournament_id: 1}, { unique: true });

// export model
var TournamentPlayer = module.exports = mongoose.model('tournamentPlayer', tournamentPlayerSchema);
module.exports.get = function (callback, limit) {
    TournamentPlayer.find(callback).limit(limit);
}