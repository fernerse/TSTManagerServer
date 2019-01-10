// api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.send(router.stack);
});

// import controllers
var playerController = require('../controllers/playerController');
var seasonController = require('../controllers/seasonController');
var tournamentController = require('../controllers/tournamentController');
var tournamentPlayerController = require('../controllers/tournamentPlayerController');
var roundController = require('../controllers/roundController');

//Season Routes
router.route('/seasons')
    .get(seasonController.index)
    .post(seasonController.new);

router.route('/seasons/:season_id')
    .get(seasonController.view)
    .put(seasonController.update)
    .delete(seasonController.delete);

//Player Routes
router.route('/seasons/:season_id/players')
    .get(playerController.index)
    .post(playerController.new);

router.route('/players/:player_id')
    .get(playerController.view)
    .put(playerController.update)
    .delete(playerController.delete);

//Tournament Routes
router.route('/seasons/:season_id/tournaments')
    .get(tournamentController.index)
    .post(tournamentController.new);

router.route('/tournaments/:tournament_id')
    .get(tournamentController.view)
    .put(tournamentController.update)
    .delete(tournamentController.delete);

//Tournament Player Routes
router.route('/tournaments/:tournament_id/tournamentPlayers')
    .get(tournamentPlayerController.index)
    .post(tournamentPlayerController.new);

router.route('/tournamentPlayers/:tournamentPlayer_id')
    .get(tournamentPlayerController.view)
    .put(tournamentPlayerController.update)
    .delete(tournamentPlayerController.delete);

//Round Routes
router.route('/tournaments/:tournament_id/rounds')
    .get(roundController.index)
    .post(roundController.new);

router.route('/rounds/:round_id')
    .get(roundController.view)
    .put(roundController.update)
    .delete(roundController.delete);


// Export API routes
module.exports = router;