// playerModel.js
var mongoose = require('mongoose');

// setup schema
var playerSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    }
});

// make sure that there can be only one combination of the same username and season_id
playerSchema.index({ username: 1, season_id: 1}, { unique: true });

// export player model
var Player = module.exports = mongoose.model('player', playerSchema);
module.exports.get = function (callback, limit) {
    Player.find(callback).limit(limit);
}