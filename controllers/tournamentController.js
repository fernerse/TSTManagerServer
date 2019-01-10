// tournamentController.js

// import models
Tournament = require('../models/tournamentModel');
Season = require('../models/seasonModel');

// import mongoose
let mongoose = require('mongoose');

// get all tournaments in one season
exports.index = function (req, res) {
    Tournament.find({ season_id: req.params.season_id }, function (err, tournaments) {
        if (err)
            res.send(err);
        res.json({
            success: true,
            message: 'Tournaments loaded!',
            data: tournaments
        });
    });
}

// create new tournament in season
exports.new = function (req, res) {
    Season.findById(req.params.season_id, function (err, season) {
        if (err)
            res.send(err);
        // check if season exists
        if (!season) {
            return res.status(500).send({ success: false, message: 'Tournament could not be created!', data: 'Season does not exist!' });
        }
        // check if tournament id has been provided
        var tournament;
        if (req.body.tournament_id) {
            objectId = new mongoose.Types.ObjectId(req.body.tournament_id);
            tournament = new Tournament({ _id: objectId });
        }
        else {
            tournament = new Tournament();
        }
        // fill tournament fields
        tournament.date = Date.now();
        tournament.season_id = req.params.season_id;
        // save tournament
        tournament.save(function (err) {
            if (err) {
                // check if error is duplicate error
                if (err.name === 'MongoError' && err.code === 11000) {
                    return res.status(500).send({ success: false, message: 'Tournament could not be created!', data: 'Tournament already exists!' });
                }
                return res.status(500).send(err);
            }
            res.json({
                success: true,
                message: 'Tournament created!',
                data: tournament
            });
        });
    });
}

// get one tournament
exports.view = function (req, res) {
    Tournament.findById(req.params.tournament_id, function (err, tournament) {
        if (err)
            res.send(err);
        if (!tournament) {
            return res.status(500).send({ success: false, message: 'Tournament could not be loaded!', data: 'Tournament does not exist!' });
        }
        res.json({
            success: true,
            message: 'Tournament loaded!',
            data: tournament
        });
    });
};

// update tournament
exports.update = function (req, res) {
    if (!req.body.date) {
        return res.status(500).send({ success: false, message: 'Tournament could not be updated!', data: 'No date specified' });
    }
    Tournament.findById(req.params.tournament_id, function (err, tournament) {
        if (err)
            res.send(err);
        // check if tournament exists
        if (!tournament) {
            return res.status(500).send({ success: false, message: 'Tournament could not be updated!', data: 'Tournament does not exist!' });
        }
        tournament.date = req.body.date;
        tournament.save(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({
                success: true,
                message: 'Tournament updated!',
                data: tournament
            });
        });
    });
};

// delete tournament
exports.delete = function (req, res) {
    Tournament.findById(req.params.tournament_id, function (err, tournament) {
        if (err)
            res.send(err);
        if (!tournament) {
            return res.status(500).send({ success: false, message: 'Tournament could not be deleted!', data: 'Tournament does not exist!' });
        }
        tournament.remove(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({
                success: true,
                message: 'Tournament deleted'
            });
        });
    });
};