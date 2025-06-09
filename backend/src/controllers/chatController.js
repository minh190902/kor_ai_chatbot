const { ChatSession, Message, User } = require('../db/models');
const aiService = require('../services/aiService');
const contextService = require('../services/contextService');

async function handleChat(req, res) {
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

    // 3. Get intelligent context using contextService
    const contextResult = await contextService.getContextForSession(session_id, {
      maxMessages: settings.maxContextMessages || 20,
      maxTokens: settings.maxContextTokens || 4000
    });

    // 4. Create summary if needed
    if (contextResult.shouldCreateSummary) {
      await contextService.createSummaryForSession(session_id);
      // Re-fetch context after summary creation
      const updatedContext = await contextService.getContextForSession(session_id);
      contextResult.messages = updatedContext.messages;
      contextResult.summary = updatedContext.summary;
    }

    // 5. Prepare context for AI
    const contextMessages = contextResult.messages.map(m => ({
      role: m.role.toLowerCase(),
      content: m.content
    }));

    // Add context info to AI prompt if summary exists
    let enhancedMessage = message;
    if (contextResult.summary) {
      enhancedMessage = `[Context: Cuộc trò chuyện này đã có ${contextResult.totalMessagesInSession} tin nhắn. Tóm tắt: ${contextResult.summary}]\n\n${message}`;
    }

    // 6. If streaming is not requested, call non-streaming API
    if (!stream) {
      const aiResponse = await aiService.callChatAPI({
        user_id,
        session_id,
        message: enhancedMessage,
        history: contextMessages
      });

      await Message.create({
        session_id,
        role: 'ASSISTANT',
        content: aiResponse,
        timestamp: new Date()
      });

      // Update session metrics
      await ChatSession.update({
        session_metrics: {
          ...session.session_metrics,
          total_messages: contextResult.totalMessagesInSession + 2, // +2 for user and assistant messages
          last_context_tokens: contextResult.totalTokens,
          context_truncated: contextResult.truncated,
          has_summary: !!contextResult.summary
        }
      }, {
        where: { id: session_id }
      });

      return res.json({ 
        response: aiResponse, 
        success: true,
        contextInfo: {
          totalTokens: contextResult.totalTokens,
          messagesInContext: contextResult.messages.length,
          truncated: contextResult.truncated,
          hasSummary: !!contextResult.summary
        }
      });
    }

    // 7. Streaming response process
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
      message: enhancedMessage,
      history: contextMessages
    }, (chunk) => {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ 
        type: 'chunk', 
        content: chunk,
        accumulated: fullResponse 
      })}\n\n`);
    });

    // Send context info with final response
    res.write(`data: ${JSON.stringify({ 
      type: 'done', 
      content: fullResponse,
      contextInfo: {
        totalTokens: contextResult.totalTokens,
        messagesInContext: contextResult.messages.length,
        truncated: contextResult.truncated,
        hasSummary: !!contextResult.summary
      }
    })}\n\n`);
    res.end();

    // Save the full response to DB
    await Message.create({
      session_id,
      role: 'ASSISTANT',
      content: fullResponse,
      timestamp: new Date()
    });

    // Update session metrics
    await ChatSession.update({
      session_metrics: {
        ...session.session_metrics,
        total_messages: contextResult.totalMessagesInContext + 2,
        last_context_tokens: contextResult.totalTokens,
        context_truncated: contextResult.truncated,
        has_summary: !!contextResult.summary
      }
    }, {
      where: { id: session_id }
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
}

// New endpoint to get context stats
async function getContextStats(req, res) {
  const { session_id } = req.params;
  
  try {
    const stats = await contextService.getContextStats(session_id);
    if (!stats) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get context stats' });
  }
}

// New endpoint to manually create summary
async function createSummary(req, res) {
  const { session_id } = req.body;
  
  try {
    const summary = await contextService.createSummaryForSession(session_id);
    if (!summary) {
      return res.status(400).json({ error: 'Not enough messages to create summary' });
    }
    res.json({ summary, success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create summary' });
  }
}

// New endpoint to cleanup old context
async function cleanupContext(req, res) {
  const { session_id, keep_recent = 10 } = req.body;
  
  try {
    const result = await contextService.cleanupOldContext(session_id, keep_recent);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to cleanup context' });
  }
}

module.exports = {
  handleChat,
  getContextStats,
  createSummary,
  cleanupContext
};