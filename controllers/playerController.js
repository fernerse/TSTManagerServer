//playerController.js

//import models
Player = require('../models/playerModel');
Season = require('../models/seasonModel');

//import mongoose
let mongoose = require('mongoose');

//Get all players from specific season
exports.index = function (req, res) {
    Player.find({ season_id: req.params.season_id }, function (err, players) {
        if (err)
            res.send(err);
        res.json({
            success: true,
            message: 'Players loaded!',
            data: players
        });
    });
}

// Create a player in a season
exports.new = function (req, res) {

    // check if required fields have been sent
    if (!req.body.username) {
        return res.status(500).send({ success: false, message: 'Player could not be created!', data: 'No username specified' });
    }

    // load the season in which the player will be created
    Season.findById(req.params.season_id, function (err, season) {
        if (err)
            res.send(err);
        if (!season) {
            return res.status(500).send({ success: false, message: 'Player could not be created!', data: 'Season does not exist!' });
        }

        // check if an Id has been sent
        var player;
        if (req.body.player_id) {
            objectId = new mongoose.Types.ObjectId(req.body.player_id);
            player = new Player({ _id: objectId });
        }
        else {
            player = new Player();
        }

        // fill player fields
        player.username = req.body.username;
        player.season_id = req.params.season_id;

        // save player
        player.save(function (err) {
            if (err) {
                // check if duplicate is present
                if (err.name === 'MongoError' && err.code === 11000) {
                    return res.status(500).send({ success: false, message: 'Player could not be created!', data: 'Player already exists!' });
                }
                // Some other error
                return res.status(500).send(err);
            }
            res.json({
                success: true,
                message: 'Player created!',
                data: player
            });
        });
    });
}

// Get one Player by Id
exports.view = function (req, res) {

    // load player
    Player.findById(req.params.player_id, function (err, player) {
        if (err)
            res.send(err);
        if (!player) {
            return res.status(500).send({ success: false, message: 'Player could not be loaded!', data: 'Player does not exist!' });
        }
        res.json({
            success: true,
            message: 'Player loaded!',
            data: player
        });
    });
};

// Update a player
exports.update = function (req, res) {

    if (!req.body.username) {
        return res.status(500).send({ success: false, message: 'Player could not be updated!', data: 'No username specified' });
    }
    Player.findById(req.params.player_id, function (err, player) {
        if (err)
            res.send(err);
        if (!player) {
            return res.status(500).send({ success: false, message: 'Player could not be updated!', data: 'Player does not exist!' });
        }
        player.username = req.body.username;

        // save the player and check for errors
        player.save(function (err) {
            if (err) {
                // check if duplicate is present
                if (err.name === 'MongoError' && err.code === 11000) {
                    return res.status(500).send({ success: false, message: 'Player could not be updated!', data: 'Player already exists!' });
                }
                return res.status(500).send(err);
            }
            res.json({
                success: true,
                message: 'Player updated!',
                data: player
            });
        });
    });
};

// Delete a player
exports.delete = function (req, res) {
    Player.findById(req.params.player_id, function (err, player) {
        if (err)
            res.send(err);
        // check if player exists
        if (!player) {
            return res.status(500).send({ success: false, message: 'Player could not be deleted!', data: 'Player does not exist!' });
        }
        // remove player
        player.remove(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({
                status: "success",
                message: 'Player deleted'
            });
        });
    });
};