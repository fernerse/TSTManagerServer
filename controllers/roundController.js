// roundController.js

// import models
Round = require('../models/roundModel');
Tournament = require('../models/tournamentModel');
TournamentPlayer = require('../models/tournamentPlayerModel');

// import mongoose
let mongoose = require('mongoose');

// get all rounds from one tournament
exports.index = function (req, res) {
    Round.find({ tournament_id: req.params.tournament_id }, function (err, rounds) {
        if (err)
            res.send(err);
        res.json({
            success: true,
            message: 'Rounds loaded!',
            data: rounds
        });
    });
}

// create a round for a tournament
exports.new = function (req, res) {
    let round = new Round();
    Tournament.findById(req.params.tournament_id, function (err, tournament) {
        if (err)
            res.send(err);
        if (!tournament) {
            return res.status(500).send({ success: false, message: 'Round could not be created!', data: 'Tournament does not exist!' });
        }
        TournamentPlayer.find({ tournament_id: tournament.id }, function (err, tournamentPlayers) {
            if (err)
                res.send(err);
            let roundPlayers = tournamentPlayers.filter(player => {
                //TODO add payment validation
                return player.active;
            });
            let sitOutCount = roundPlayers.length % 4;
            for (var i = 0; i < sitOutCount; i++) {
                var player = roundPlayers.splice(0, 1);
                round.sitOuts.push(player[0].id);
            }
            for (var i = 0; i < roundPlayers.length; i = i + 4) {
                round.matches.push({
                    team_1: {
                        player_1: roundPlayers[i].id,
                        player_2: roundPlayers[i + 1].id,
                        score: 0
                    },
                    team_2: {
                        player_1: roundPlayers[i + 2].id,
                        player_2: roundPlayers[i + 3].id,
                        score: 0
                    }
                })
            }
            round.tournament_id = tournament.id;
            round.save(function (err) {
                if (err) {
                    return res.status(500).send(err);
                }
                res.json({
                    success: true,
                    message: 'Round created!',
                    data: round
                });
            });
        });
    });
}

// get round
exports.view = function (req, res) {
    Round.findById(req.params.round_id, function (err, round) {
        if (err)
            res.send(err);
        if (!round) {
            return res.status(500).send({ success: false, message: 'Round could not be loaded!', data: 'Round does not exist!' });
        }
        res.json({
            success:true,
            message: 'Round loaded!',
            data: round
        });
    });
};

// update round
exports.update = function (req, res) {
    res.json({
        success: false,
        message: 'Round not updated!',
        data: {}
    });
};

// delete round
exports.delete = function (req, res) {
    Round.findById(req.params.round_id, function (err, round) {
        if (err)
            res.send(err);
        if (!round) {
            return res.status(500).send({ success: false, message: 'Round could not be deleted!', data: 'Round does not exist!' });
        }
        round.remove(function (err) {
            if (err) {
                // Some other error
                return res.status(500).send(err);
            }
            res.json({
                success: true,
                message: 'Round deleted'
            });
        });
    });
};