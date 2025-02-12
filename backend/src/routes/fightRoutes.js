const express = require('express');
const router = express.Router();
const fightController = require('../controllers/fights-controllers/fightController');

router.post('/', fightController.createFight);

router.get('/:fightId', fightController.getFightDetails);

router.put('/:fightId', fightController.editFight);

router.post('/accept', fightController.acceptFight);

module.exports = router;