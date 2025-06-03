import { useState, useEffect } from 'react';
import { fetchConversations, createConversation, fetchMessages } from '../services/api';
import { DEFAULT_SETTINGS } from '../utils/constants';

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);

  const loadConversations = async (settings) => {
    try {
      const data = await fetchConversations(settings.apiEndpoint);
      setConversations(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadConversation = async (conversationId, settings) => {
    try {
      const data = await fetchMessages(settings.apiEndpoint, conversationId);
      setMessages(data);
      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error(error);
    }
  };

  const createNewConversation = async (title, settings) => {
    try {
      const newConv = await createConversation(settings.apiEndpoint, title);
      setConversations(prev => [newConv, ...prev]);
      setCurrentConversationId(newConv.id);
      setMessages([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadConversations(DEFAULT_SETTINGS);
  }, []);

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