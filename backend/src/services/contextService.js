const { Message, ChatSession } = require('../db/models');
const aiService = require('./aiService');
const logger = require('../utils/logger');

class ContextService {
  constructor() {
    this.MAX_CONTEXT_MESSAGES = 20; 
    this.CONTEXT_TOKEN_LIMIT = 4000;
    this.SUMMARY_TRIGGER_THRESHOLD = 15;
  }

  /**
   * rough estimation
   */
  estimateTokens(text) {
    return Math.ceil(text.length / 4); // 1 token ≈ 4 characters
  }

  /**
   * Cal Sum of tokens in messages
   */
  calculateTotalTokens(messages) {
    return messages.reduce((total, msg) => {
      return total + this.estimateTokens(msg.content);
    }, 0);
  }

  /**
   * Get context for a specific session
   */
  async getContextForSession(sessionId, options = {}) {
    const {
      maxMessages = this.MAX_CONTEXT_MESSAGES,
      maxTokens = this.CONTEXT_TOKEN_LIMIT,
      includeSystemPrompt = true
    } = options;

    try {
      // 1. Get all messages for session
      const allMessages = await Message.findAll({
        where: { session_id: sessionId },
        order: [['timestamp', 'ASC']]
      });

      if (allMessages.length === 0) {
        return {
          messages: [],
          totalTokens: 0,
          truncated: false,
          summary: null
        };
      }

      // 2. Get session details
      const session = await ChatSession.findByPk(sessionId);
      let contextMessages = [];
      let totalTokens = 0;

      // 3. If have system prompt, add it to context
      if (session?.llm_context?.summary) {
        const summaryMessage = {
          role: 'SYSTEM',
          content: `[Previous conversation summarization: ${session.llm_context.summary}]`,
          timestamp: new Date(0), // lasted Timestamp
          isSummary: true
        };
        contextMessages.push(summaryMessage);
        totalTokens += this.estimateTokens(summaryMessage.content);
      }

      // 4. Add recent messages to context
      const recentMessages = allMessages.slice(-maxMessages);
      
      for (const msg of recentMessages) {
        const msgTokens = this.estimateTokens(msg.content);
        
        // Check token limit
        if (totalTokens + msgTokens > maxTokens && contextMessages.length > 1) {
          logger.info(`Context truncated at ${contextMessages.length} messages due to token limit`);
          break;
        }

        contextMessages.push({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        });
        totalTokens += msgTokens;
      }

      const shouldCreateSummary = allMessages.length > this.SUMMARY_TRIGGER_THRESHOLD && 
                                   !session?.llm_context?.summary;

      return {
        messages: contextMessages.filter(msg => !msg.isSummary), // Loại bỏ summary khỏi context gửi cho AI
        totalTokens,
        truncated: allMessages.length > contextMessages.length,
        shouldCreateSummary,
        summary: session?.llm_context?.summary || null,
        totalMessagesInSession: allMessages.length
      };

    } catch (error) {
      logger.error('Error getting context for session:', error);
      return {
        messages: [],
        totalTokens: 0,
        truncated: false,
        summary: null,
        error: error.message
      };
    }
  }

  /**
   * Create Summary for a session
   */
  async createSummaryForSession(sessionId) {
    try {
      const allMessages = await Message.findAll({
        where: { session_id: sessionId },
        order: [['timestamp', 'ASC']],
        limit: this.SUMMARY_TRIGGER_THRESHOLD
      });

      if (allMessages.length < 5) {
        return null; // Too few messages
      }

      const conversationText = allMessages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const summaryContent = await aiService.callChatAPI({
        user_id: 'system',
        session_id: 'summary_' + sessionId,
        message: `Hãy tóm tắt cuộc trò chuyện sau đây một cách ngắn gọn và bao quát các điểm chính:\n\n${conversationText}\n\nTóm tắt:`,
        history: []
      });

      // Save summary to session context
      await ChatSession.update({
        llm_context: {
          summary: summaryContent,
          summary_created_at: new Date(),
          summarized_messages_count: allMessages.length
        }
      }, {
        where: { id: sessionId }
      });

      logger.info(`Created summary for session ${sessionId}`);
      return summaryContent;

    } catch (error) {
      logger.error('Error creating summary:', error);
      return null;
    }
  }

  /**
   * cleanup old messages but keep summary
   */
  async cleanupOldContext(sessionId, keepRecentCount = 10) {
    try {
      const allMessages = await Message.findAll({
        where: { session_id: sessionId },
        order: [['timestamp', 'DESC']],
        attributes: ['id', 'timestamp']
      });

      if (allMessages.length <= keepRecentCount) {
        return { deleted: 0, kept: allMessages.length };
      }

      // Keep the most recent messages
      const messagesToDelete = allMessages.slice(keepRecentCount);
      const deleteIds = messagesToDelete.map(msg => msg.id);

      await Message.destroy({
        where: { id: deleteIds }
      });

      logger.info(`Cleaned up ${deleteIds.length} old messages from session ${sessionId}`);
      
      return { 
        deleted: deleteIds.length, 
        kept: keepRecentCount 
      };

    } catch (error) {
      logger.error('Error cleaning up context:', error);
      return { deleted: 0, kept: 0, error: error.message };
    }
  }

  /**
   * Configure context for a session
   */
  async configureContextForSession(sessionId, config) {
    try {
      const session = await ChatSession.findByPk(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      const updatedContext = {
        ...session.llm_context,
        ...config,
        updated_at: new Date()
      };

      await ChatSession.update({
        llm_context: updatedContext
      }, {
        where: { id: sessionId }
      });

      return updatedContext;
    } catch (error) {
      logger.error('Error configuring context:', error);
      throw error;
    }
  }

  /**
   * Get stats for a session context
   */
  async getContextStats(sessionId) {
    try {
      const [session, messageCount] = await Promise.all([
        ChatSession.findByPk(sessionId),
        Message.count({ where: { session_id: sessionId } })
      ]);

      const recentMessages = await Message.findAll({
        where: { session_id: sessionId },
        order: [['timestamp', 'DESC']],
        limit: this.MAX_CONTEXT_MESSAGES
      });

      const totalTokens = this.calculateTotalTokens(recentMessages);

      return {
        totalMessages: messageCount,
        recentMessagesCount: recentMessages.length,
        estimatedTokens: totalTokens,
        hasSummary: !!(session?.llm_context?.summary),
        summaryCreatedAt: session?.llm_context?.summary_created_at,
        contextConfig: session?.llm_context || {}
      };
    } catch (error) {
      logger.error('Error getting context stats:', error);
      return null;
    }
  }
}

module.exports = new ContextService();