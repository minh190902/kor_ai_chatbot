import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import ChatArea from './components/chat/ChatArea';
import ErrorBoundary from './components/common/ErrorBoundary';
import Login from './components/auth/login';
import { useConversations } from './hooks/useConversations';
import { useChat } from './hooks/useChat';
import { DEFAULT_SETTINGS } from './utils/constants';
import { Menu } from 'lucide-react';

const App = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [userId, setUserId] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    conversations,
    currentConversationId,
    messages,
    setMessages,
    loadConversation,
    createNewConversation,
    loadConversations,
  } = useConversations(userId);
  const { inputMessage, setInputMessage, isLoading, sendMessage } = useChat(currentConversationId, setMessages, userId);

  useEffect(() => {
    if (userId) {
      loadConversations(settings);
    }
  }, [settings, userId]);

  if (!userId) {
    return <Login onLogin={setUserId} />;
  }

  const handleSelectConversation = (id) => {
    loadConversation(id, settings);
  };

  const handleCreateConversation = () => {
    const title = 'Cuộc trò chuyện';
    createNewConversation(title, settings);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white shadow-xl border-r border-orange-100 flex flex-col overflow-hidden flex-shrink-0`}>
        <ErrorBoundary>
          <Sidebar
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={handleSelectConversation}
            onCreateConversation={handleCreateConversation}
            settings={settings}
            setSettings={setSettings}
            onCloseSidebar={() => setSidebarOpen(false)}
          />
        </ErrorBoundary>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white border-b border-orange-100 p-4 shadow-sm flex-shrink-0">
          <div className="flex items-center">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-orange-100 rounded-lg transition-colors mr-3"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <span className="font-bold text-orange-500 text-xl">AI CHAT</span>
          </div>
        </div>
        {/* Chat Area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ErrorBoundary>
            <ChatArea
              messages={messages}
              isLoading={isLoading}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              onSend={sendMessage}
              currentConversationId={currentConversationId}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default App;