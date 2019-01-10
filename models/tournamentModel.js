// tournamentModel.js

var mongoose = require('mongoose');

// setup schema
var tournamentSchema = mongoose.Schema({
    date: Date,
    season_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

// export model
var Tournament = module.exports = mongoose.model('tournament', tournamentSchema);
module.exports.get = function (callback, limit) {
    Tournament.find(callback).limit(limit);
}