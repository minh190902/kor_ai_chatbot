const { Message } = require('../db/models');

async function getMessagesBySession(req, res) {
  const { session_id } = req.params;
  try {
    const messages = await Message.findAll({
      where: { session_id },
      order: [['timestamp', 'ASC']]
    });
    res.json(messages.map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: m.timestamp
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}

module.exports = { getMessagesBySession };