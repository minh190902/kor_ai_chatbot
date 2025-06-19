const aiService = require('../services/aiService');

async function handleVocabExpansion(req, res) {
  try {
    const { user_id, user_word, model_provider, model_id, temperature, language } = req.body;
    if (!user_id || !user_word) {
      return res.status(400).json({ success: false, error: 'Missing user_id or user_word' });
    }

    // Gọi FastAPI endpoint vocab_expansion_response
    const payload = { user_id, user_word, model_provider, model_id, temperature, language };
    const result = await aiService.callFastAPI('/vocab/vocab_expansion_response', payload);

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const db = require('../db/models');

async function saveVocabExpansion(req, res) {
  try {
    const { user_id, user_word, xml_response } = req.body;
    if (!user_id || !user_word || !xml_response) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }
    const vocab = await db.VocabExpansion.create({
      user_id,
      user_word,
      xml_response,
      created_at: new Date()
    });
    res.json({ success: true, vocab_id: vocab.vocab_id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function listVocabExpansions(req, res) {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ success: false, error: 'Missing user_id' });
    }
    const vocabs = await db.VocabExpansion.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
      attributes: ['vocab_id', 'user_word', 'xml_response', 'created_at']
    });
    res.json({ success: true, data: vocabs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  handleVocabExpansion,
  saveVocabExpansion,
  listVocabExpansions
};