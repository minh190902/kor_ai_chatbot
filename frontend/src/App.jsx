import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import ChatArea from './components/chat/ChatArea';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useConversations } from './hooks/useConversations';
import { useChat } from './hooks/useChat';
import { DEFAULT_SETTINGS } from './utils/constants';

const App = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const {
    conversations,
    currentConversationId,
    messages,
    setMessages,
    loadConversation,
    createNewConversation,
    loadConversations,
  } = useConversations();
  const { inputMessage, setInputMessage, isLoading, sendMessage } = useChat(currentConversationId, setMessages);

  useEffect(() => {
    loadConversations(settings);
  }, [settings]);

  const handleSelectConversation = (id) => {
    loadConversation(id, settings);
  };

  const handleCreateConversation = () => {
    const title = 'Cuộc trò chuyện';
    createNewConversation(title, settings);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ErrorBoundary>
        <Sidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onCreateConversation={handleCreateConversation}
          settings={settings}
          setSettings={setSettings}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSend={sendMessage}
        />
      </ErrorBoundary>
    </div>
  );
};

export default App;