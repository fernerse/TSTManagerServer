// seasonModel.js
var mongoose = require('mongoose');

// import models
var playerSchema = require('mongoose').model('player').schema

// setup schema
var seasonSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    players:[playerSchema]
});

// export player model
var Season = module.exports = mongoose.model('season', seasonSchema);
module.exports.get = function (callback, limit) {
    Season.find(callback).limit(limit);
}

module.exports.getPlayers = Season.players;