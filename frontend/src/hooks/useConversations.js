import { useState, useEffect } from 'react';
import { fetchConversations, createConversation, fetchMessages } from '../services/api';
import { DEFAULT_SETTINGS } from '../utils/constants';

// Nhận userId từ props hoặc context (tùy app bạn)
export const useConversations = (userId) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);

  // Lấy danh sách session/conversation từ backend theo userId
  const loadConversations = async (settings = DEFAULT_SETTINGS) => {
    if (!userId) return;
    try {
      const data = await fetchConversations(settings.apiEndpoint, userId);
      setConversations(data);
      if (data.length > 0) {
        setCurrentConversationId(data[0].id);
        // Chỉ load messages nếu session đã tồn tại
        loadConversation(data[0].id, settings);
      } else {
        // Nếu là user mới, tạo session mới
        const newConv = await createConversation(settings.apiEndpoint, "Cuộc trò chuyện mới", userId);
        setConversations([newConv]);
        setCurrentConversationId(newConv.id);
        setMessages([]); // Không cần load messages vì chắc chắn chưa có
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Lấy messages của 1 session từ backend
  const loadConversation = async (conversationId, settings = DEFAULT_SETTINGS) => {
    if (!conversationId) return;
    try {
      const data = await fetchMessages(settings.apiEndpoint, conversationId);
      setMessages(data);
      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error(error);
    }
  };

  // Tạo session mới trên backend
  const createNewConversation = async (title, settings = DEFAULT_SETTINGS) => {
    try {
      const newConv = await createConversation(settings.apiEndpoint, title, userId);
      setConversations(prev => [newConv, ...prev]);
      setCurrentConversationId(newConv.id);
      setMessages([]); // Không cần load messages vì là session mới
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadConversations(DEFAULT_SETTINGS);
    // eslint-disable-next-line
  }, [userId]);

  return {
    conversations,
    currentConversationId,
    messages,
    setMessages,
    loadConversation,
    createNewConversation,
    loadConversations,
  };
};