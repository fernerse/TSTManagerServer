// tournamentPlayer.js

// import models
TournamentPlayer = require('../models/tournamentPlayerModel');
Tournament = require('../models/tournamentModel');
Player = require('../models/playerModel');

// import mogoose
let mongoose = require('mongoose');

// get all players from one tournament
exports.index = function (req, res) {
    TournamentPlayer.find({ tournament_id: req.params.tournament_id }, function (err, tournamentPlayers) {
        if (err)
            res.send(err);
        res.json({
            success: true,
            message: 'Tournament players loaded!',
            data: tournamentPlayers
        });
    });
}

// create a new player who is a participant in the tournament
exports.new = function (req, res) {

    // check if required fields have been sent
    if (!req.body.player_id) {
        return res.status(500).send({ success: false, message: 'Tournament player could not be created!', data: 'No player id specified' });
    }
    Player.findById(req.body.player_id, function (err, player) {
        if (err)
            res.send(err);
        // check if player exists
        if (!player) {
            return res.status(500).send({ success: false, message: 'Tournament player could not be created!', data: 'Player does not exist!' });
        }
        Tournament.findById(req.params.tournament_id, function (err, tournament) {
            if (err)
                res.send(err);
            // check if tournament exists
            if (!tournament) {
                return res.status(500).send({ success: false, message: 'Tournament player could not be created!', data: 'Tournament does not exist!' });
            }

            // check if tournamentPlayer id has been provided
            var tournamentPlayer;
            if (req.body.tournamentPlayer_id) {
                objectId = new mongoose.Types.ObjectId(req.body.tournamentPlayer_id);
                tournamentPlayer = new TournamentPlayer({ _id: objectId });
            }
            else {
                tournamentPlayer = new TournamentPlayer();
            }

            // fill tournamentPlayer fields
            tournamentPlayer.tournament_id = req.params.tournament_id;
            tournamentPlayer.player_id = req.body.player_id;
            tournamentPlayer.active = true;
            tournamentPlayer.roundJoined = 0;
            tournamentPlayer.payed = false;
    
            tournamentPlayer.save(function (err) {
                if (err) {
                    // check if error is a duplicate error
                    if (err.name === 'MongoError' && err.code === 11000) {
                        return res.status(500).send({ success: false, message: 'Tournament player could not be created!', data: 'Tournament player already exists!' });
                    }
                    return res.status(500).send(err);
                }
                res.json({
                    success: true,
                    message: 'Tournament player created!',
                    data: tournamentPlayer
                });
            });
        });
    });
}

// get tournamentPlayer
exports.view = function (req, res) {
    TournamentPlayer.findById(req.params.tournamentPlayer_id, function (err, tournamentPlayer) {
        if (err)
            res.send(err);
        if (!tournamentPlayer) {
            return res.status(500).send({ success: false, message: 'Tournament player could not be loaded!', data: 'Tournament player does not exist!' });
        }
        res.json({
            success: true,
            message: 'Tournament player loaded!',
            data: tournamentPlayer
        });
    });
};

// update tournamentPlayer
exports.update = function (req, res) {
    TournamentPlayer.findById(req.params.tournamentPlayer_id, function (err, tournamentPlayer) {
        if (err)
            res.send(err);
        if (!tournamentPlayer) {
            return res.status(500).send({ success: false, message: 'Tournament player could not be updated!', data: 'Tournament player does not exist!' });
        }
        if('active' in req.body){
            tournamentPlayer.active = req.body.active;
        }
        if('payed' in req.body){
            tournamentPlayer.payed = req.body.payed;
        }
        tournamentPlayer.save(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({
                success: true,
                message: 'Tournament player updated!',
                data: tournamentPlayer
            });
        });
    });
};

// delete tournamentplayer
exports.delete = function (req, res) {
    TournamentPlayer.findById(req.params.tournamentPlayer_id, function (err, tournamentPlayer) {
        if (err)
            res.send(err);
        if (!tournamentPlayer) {
            return res.status(500).send({ success: false, message: 'Tournament player could not be deleted!', data: 'Tournament player does not exist!' });
        }
        tournamentPlayer.remove(function (err) {
            if (err) {
                // Some other error
                return res.status(500).send(err);
            }
            res.json({
                success: true,
                message: 'Tournament player deleted'
            });
        });
    });
};