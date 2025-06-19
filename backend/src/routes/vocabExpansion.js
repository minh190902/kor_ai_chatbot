const express = require('express');
const router = express.Router();
const vocabExpansionController = require('../controllers/vocabExpansionController');

router.post('/', vocabExpansionController.handleVocabExpansion);
router.post('/save', vocabExpansionController.saveVocabExpansion);
router.get('/list', vocabExpansionController.listVocabExpansions);

module.exports = router;