import { useState, useEffect } from 'react';
import { fetchConversations, createConversation, fetchMessages, deleteConversation } from '../services/api';
import { DEFAULT_SETTINGS } from '../utils/constants';

/**
 * Custom hook for managing user conversations and messages.
 * @param {string} userId - The user's unique identifier.
 */
export const useConversations = (userId) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);

  // Fetch the list of sessions/conversations from the backend by userId
  const loadConversations = async (settings = DEFAULT_SETTINGS) => {
    if (!userId) return;
    try {
      const data = await fetchConversations(settings.apiEndpoint, userId);
      setConversations(data);
      if (data.length > 0) {
        setCurrentConversationId(data[0].id);
        // Only load messages if a session already exists
        loadConversation(data[0].id, settings);
      } else {
        // If this is a new user, create a new session
        const newConv = await createConversation(settings.apiEndpoint, "New Conversation", userId);
        setConversations([newConv]);
        setCurrentConversationId(newConv.id);
        setMessages([]); // No need to load messages since there are none yet
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch messages for a session from the backend
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

  // Create a new session on the backend
  const createNewConversation = async (title, settings = DEFAULT_SETTINGS) => {
    try {
      const newConv = await createConversation(settings.apiEndpoint, title, userId);
      setConversations(prev => [newConv, ...prev]);
      setCurrentConversationId(newConv.id);
      setMessages([]); 
    } catch (error) {
      console.error(error);
    }
  };

  const deleteConversationById = async (sessionId, settings = DEFAULT_SETTINGS) => {
    try {
      await deleteConversation(settings.apiEndpoint, sessionId);
      console.log('API called, updating state'); 
      setConversations(prev => prev.filter(conv => conv.id !== sessionId));
      if (currentConversationId === sessionId) {
        setCurrentConversationId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Delete error:', err); 
      alert('Không thể xóa cuộc trò chuyện!');
    }
  };

  useEffect(() => {
    loadConversations(DEFAULT_SETTINGS);
    // eslint-disable-next-line
  }, [userId]);

  return {
    conversations,
    setConversations,
    currentConversationId,
    messages,
    setMessages,
    loadConversation,
    createNewConversation,
    loadConversations,
    deleteConversationById
  };
};