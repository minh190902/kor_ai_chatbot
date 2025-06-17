import { useState } from 'react';
import { sendChatMessage, sendChatMessageStream, fetchMessages } from '../services/api';
import { getLanguageName } from '../utils/getLanguageName';

export const useChat = (conversationId, setMessages, userId, settings) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const language = getLanguageName();

  const sendMessage = async (useStream = true) => {
    if (!inputMessage.trim() || isLoading) return;
    setIsLoading(true);

    // Create user message object
    const userMsg = {
      id: Date.now(),
      content: inputMessage,
      role: 'USER',
      timestamp: new Date().toISOString(),
      isPending: true,
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    try {
      const payload = {
        user_id: userId,
        session_id: conversationId,
        message: inputMessage,
        language: language,
        settings: {
          model: settings.model,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
        },
      };

      if (useStream) {
        // Add stream temparary message
        let aiMsg = {
          id: Date.now() + 1,
          content: '',
          role: 'ASSISTANT',
          timestamp: new Date().toISOString(),
          isPending: true,
        };
        setMessages(prev => [...prev, aiMsg]);
        await sendChatMessageStream(settings.apiEndpoint, payload, (chunk) => {
          aiMsg.content += chunk;
          setMessages(prev =>
            prev.map(m => m.id === aiMsg.id ? { ...aiMsg } : m)
          );
        });
      } else {
        await sendChatMessage(settings.apiEndpoint, payload);
        const msgs = await fetchMessages(settings.apiEndpoint, conversationId);
        setMessages(msgs);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2,
          content: 'Xin lỗi, có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại.',
          role: 'ASSISTANT',
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { inputMessage, setInputMessage, isLoading, sendMessage };
};