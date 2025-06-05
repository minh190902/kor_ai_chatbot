import { useState } from 'react';
import { sendChatMessage, sendChatMessageStream, fetchMessages } from '../services/api';
import { DEFAULT_SETTINGS } from '../utils/constants';

// Nhận thêm userId để gửi lên backend
export const useChat = (conversationId, setMessages, userId) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (useStream = true) => {
    if (!inputMessage.trim() || isLoading) return;
    setIsLoading(true);

    // Tạo message user tạm thời
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
        settings: {
          model: DEFAULT_SETTINGS.model,
          temperature: DEFAULT_SETTINGS.temperature,
          maxTokens: DEFAULT_SETTINGS.maxTokens,
        },
      };

      if (useStream) {
        // Thêm message AI tạm thời để stream nội dung vào
        let aiMsg = {
          id: Date.now() + 1,
          content: '',
          role: 'ASSISTANT',
          timestamp: new Date().toISOString(),
          isPending: true,
        };
        setMessages(prev => [...prev, aiMsg]);
        await sendChatMessageStream(DEFAULT_SETTINGS.apiEndpoint, payload, (chunk) => {
          aiMsg.content += chunk;
          setMessages(prev =>
            prev.map(m => m.id === aiMsg.id ? { ...aiMsg } : m)
          );
        });
        // Sau khi stream xong, lấy lại messages từ backend để đồng bộ
        // const msgs = await fetchMessages(DEFAULT_SETTINGS.apiEndpoint, conversationId);
        // setMessages(msgs);
      } else {
        await sendChatMessage(DEFAULT_SETTINGS.apiEndpoint, payload);
        const msgs = await fetchMessages(DEFAULT_SETTINGS.apiEndpoint, conversationId);
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