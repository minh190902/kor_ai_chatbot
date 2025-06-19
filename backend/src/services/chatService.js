const { ChatSession, Message, User } = require('../db/models');
const aiService = require('./aiService');
const contextService = require('./contextService');

async function handleChat({ user_id, conversation_id, message, language = 'vi', settings = {}, stream = false, res }) {
  // 1. Check existing user and session
  let user = await User.findByPk(user_id);
  if (!user) user = await User.create({ id: user_id, username: `user_${user_id}` });

  let session = await ChatSession.findByPk(conversation_id);
  if (!session) session = await ChatSession.create({ id: conversation_id, user_id, title: 'Cuộc trò chuyện mới' });

  // 2. Save user message to DB
  await Message.create({
    conversation_id: conversation_id,
    role: 'USER',
    content: message,
    timestamp: new Date()
  });

  // 3. Get context
  const contextResult = await contextService.getContextForSession(conversation_id, {
    maxMessages: settings.maxContextMessages || 20,
    maxTokens: settings.maxContextTokens || 4000
  });

  // 4. Create summary if needed
  if (contextResult.shouldCreateSummary) {
    await contextService.createSummaryForSession(conversation_id);
    // Re-fetch context after summary creation
    const updatedContext = await contextService.getContextForSession(conversation_id);
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

  // 6. Non-streaming
  if (!stream) {
    const aiResponse = await aiService.callChatAPI({
      user_id,
      conversation_id,
      message: enhancedMessage,
      language,
      history: contextMessages,
    });

    await Message.create({
      conversation_id: conversation_id,
      role: 'ASSISTANT',
      content: aiResponse,
      timestamp: new Date()
    });

    // Update session metrics
    await ChatSession.update({
      session_metrics: {
        ...session.session_metrics,
        total_messages: contextResult.totalMessagesInSession + 2,
        last_context_tokens: contextResult.totalTokens,
        context_truncated: contextResult.truncated,
        has_summary: !!contextResult.summary
      }
    }, {
      where: { id: conversation_id }
    });

    return {
      response: aiResponse,
      success: true,
      contextInfo: {
        totalTokens: contextResult.totalTokens,
        messagesInContext: contextResult.messages.length,
        truncated: contextResult.truncated,
        hasSummary: !!contextResult.summary
      }
    };
  }

  // 7. Streaming
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  let fullResponse = '';

  await aiService.callChatAPIStream({
    user_id,
    conversation_id,
    message: enhancedMessage,
    language,
    history: contextMessages
  }, (chunk) => {
    fullResponse += chunk;
    res.write(`data: ${JSON.stringify({
      type: 'chunk',
      content: chunk,
      accumulated: fullResponse
    })}\n\n`);
  });

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
    conversation_id: conversation_id,
    role: 'ASSISTANT',
    content: fullResponse,
    timestamp: new Date()
  });

  // Update session metrics
  await ChatSession.update({
    session_metrics: {
      ...session.session_metrics,
      total_messages: contextResult.totalMessagesInSession + 2,
      last_context_tokens: contextResult.totalTokens,
      context_truncated: contextResult.truncated,
      has_summary: !!contextResult.summary
    }
  }, {
    where: { id: conversation_id }
  });

  return null; // nothing to return for streaming
}

module.exports = { handleChat };