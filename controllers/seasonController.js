// seasonController.js

//import models
Season = require('../models/seasonModel');

//import mongoose
let mongoose = require('mongoose');

// get all seasons
exports.index = function (req, res) {
    Season.get(function (err, seasons) {
        if (err) {
            res.json({
                success: false,
                message: err,
                data: {}
            });
        }
        res.json({
            success: true,
            message: "Seasons retrieved successfully",
            data: seasons
        });
    });
}

// create a new season
exports.new = function (req, res) {

    // check if required fields have been sent
    if (!req.body.title) {
        return res.status(500).send({ success: false, message: 'season could not be created!', data: 'No title specified' });
    }

    // check if a season id has been provided
    var season;
    if (req.body.season_id) {
        objectId = new mongoose.Types.ObjectId(req.body.season_id);
        season = new Season({ _id: objectId });
    }
    else {
        season = new Season();
    }
    season.title = req.body.title;
    // save the season and check for errors
    season.save(function (err) {
        if (err) {
            //check for duplicates
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(500).send({ success: false, message: 'Season could not be created!', data: 'Season already exists!' });
            }
            // Some other error
            return res.status(500).send(err);
        }
        res.json({
            success: true,
            message: 'New season created!',
            data: season
        });
    });
}

// load a season
exports.view = function (req, res) {
    Season.findById(req.params.season_id, function (err, season) {
        if (err)
            res.send(err);
        // check if season exists
        if (!season) {
            return res.status(500).send({ success: false, message: 'Season could not be loaded!', data: 'Season does not exist!' });
        }
        res.json({
            success: true,
            message: 'Season loaded!',
            data: season
        });
    });
};

// update season
exports.update = function (req, res) {
    if (!req.body.title) {
        return res.status(500).send({ success: false, message: 'Season could not be updated!', data: 'No title specified!' });
    }
    Season.findById(req.params.season_id, function (err, season) {
        if (err)
            res.send(err);
        // check if season exists
        if (!season) {
            return res.status(500).send({ success: false, message: 'Season could not be updated!', data: 'Season does not exist!' });
        }
        season.title = req.body.title;
        season.save(function (err) {
            if (err) {
                //check for duplicates
                if (err.name === 'MongoError' && err.code === 11000) {
                    return res.status(500).send({ success: false, message: 'Season could not be updated!', data: 'A season with this title already exist!' });
                }
                // Some other error
                return res.status(500).send(err);
            }
            res.json({
                success: true,
                message: 'Season Updated!',
                data: season
            });
        });
    });
};

// delete season
exports.delete = function (req, res) {
    Season.findById(req.params.season_id, function (err, season) {
        if (err)
            res.send(err);
        // check if season exists
        if (!season) {
            return res.status(500).send({ success: false, message: 'Season could not be deleted!', data: 'Season does not exist!' });
        }
        season.remove(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({
                success: true,
                message: 'Season deleted'
            });
        });
    });
};

