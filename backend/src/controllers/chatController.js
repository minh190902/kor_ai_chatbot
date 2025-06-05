const { ChatSession, Message, User } = require('../db/models');
const aiService = require('../services/aiService');

exports.handleChat = async (req, res) => {
  const { user_id, session_id, message, settings = {}, stream = false } = req.body;
  if (!user_id || !session_id || !message) {
    return res.status(400).json({ error: 'user_id, session_id, and message are required' });
  }

  try {
    // 1. Check existing user and session
    let user = await User.findByPk(user_id);
    if (!user) user = await User.create({ id: user_id, username: `user_${user_id}` });

    let session = await ChatSession.findByPk(session_id);
    if (!session) session = await ChatSession.create({ id: session_id, user_id, title: 'Cuộc trò chuyện mới' });

    // 2. Save user message to DB
    await Message.create({
      session_id,
      role: 'USER',
      content: message,
      timestamp: new Date()
    });

    // 3. Get chat history
    const history = await Message.findAll({
      where: { session_id },
      order: [['timestamp', 'ASC']],
      limit: 20
    });

    // 4. If streaming is not requested, call non-streaming API
    if (!stream) {
      const aiResponse = await aiService.callChatAPI({
        user_id,
        session_id,
        message,
        history: history.map(m => ({ role: m.role, content: m.content }))
      });

      await Message.create({
        session_id,
        role: 'ASSISTANT',
        content: aiResponse,
        timestamp: new Date()
      });

      return res.json({ response: aiResponse, success: true });
    }

    // 5. streaming response process
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    let fullResponse = '';

    // Call streaming API
    await aiService.callChatAPIStream({
      user_id,
      session_id,
      message,
      history: history.map(m => ({
        role: m.role.toLowerCase(), 
        content: m.content
      }))
    }, (chunk) => {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ 
        type: 'chunk', 
        content: chunk,
        accumulated: fullResponse 
      })}\n\n`);
    });

    // Send the final response
    res.write(`data: ${JSON.stringify({ type: 'done', content: fullResponse })}\n\n`);
    res.end();

    // Save the full response to DB
    await Message.create({
      session_id,
      role: 'ASSISTANT',
      content: fullResponse,
      timestamp: new Date()
    });

  } catch (err) {
    console.error(err);
    if (req.body.stream) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to process chat' })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: 'Failed to process chat', detail: err.message });
    }
  }
};