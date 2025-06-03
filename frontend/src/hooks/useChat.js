import { useState } from 'react';
import { sendChatMessage } from '../services/api';
import { DEFAULT_SETTINGS } from '../utils/constants';

export const useChat = (conversationId, setMessages, userId) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    const userMsg = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let convId = conversationId;
      let userid = userId;
      // If no conversation exist, creating is handled outside
      // const payload = {
      //   message: inputMessage,
      //   conversationId: convId,
      //   settings: {
      //     model: DEFAULT_SETTINGS.model,
      //     temperature: DEFAULT_SETTINGS.temperature,
      //     maxTokens: DEFAULT_SETTINGS.maxTokens,
      //   },
      // };
      const payload = {
        user_id: userid,
        session_id: convId,
        message: inputMessage,
        settings: {
          model: DEFAULT_SETTINGS.model,
          temperature: DEFAULT_SETTINGS.temperature,
          maxTokens: DEFAULT_SETTINGS.maxTokens,
        },
      };
      const data = await sendChatMessage(DEFAULT_SETTINGS.apiEndpoint, payload);
      const aiMsg = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg = {
        id: Date.now() + 1,
        text: 'Xin lỗi, có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return { inputMessage, setInputMessage, isLoading, sendMessage };
};