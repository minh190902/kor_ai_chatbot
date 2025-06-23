const aiService = require('../services/aiService');

/**
 * Handle TOPIK Question Generation request
 */
async function handleTopikQuestionGen(req, res) {
  try {
    const {
      user_id,
      model_provider,
      model_id,
      temperature,
      level,
      type,
      subtype,
      topic,
      language,
    } = req.body;

    // Validate required fields
    if (!user_id || !level || !type || !subtype || !topic) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const payload = {
      user_id,
      model_provider,
      model_id,
      temperature,
      level,
      type,
      subtype,
      topic,
      language,
    };

    // Gọi FastAPI endpoint /topik/response
    const result = await aiService.callFastAPI('/topik/response', payload);

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { handleTopikQuestionGen };