const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const funFactsController = require('../../controllers/funfactsController');
const verifyState = require('../../middleware/verifyState');

// mysite.com/states/
router.route('/').get(statesController.getAllStates);
router.route('/?contig=false').get(statesController.getAllStates); //<<<<


// mysite.com/states/:state
router.route('/:state').get(verifyState(), statesController.getState);
router.route('/:state/capital').get(verifyState(), statesController.getCapital);
router.route('/:state/nickname').get(verifyState(), statesController.getNickname);
router.route('/:state/population').get(verifyState(), statesController.getPopulation);
router.route('/:state/admission').get(verifyState(), statesController.getAdmission);

// mysite.com/states/:state/funfact
router.route('/:state/funfact').get(verifyState(), funFactsController.getFunfact);
router.route('/:state/funfact').post(verifyState(), funFactsController.createFunfact);
router.route('/:state/funfact').patch(verifyState(), funFactsController.updateFunfact);
router.route('/:state/funfact').delete(verifyState(), funFactsController.deleteFunfact);

module.exports = router;