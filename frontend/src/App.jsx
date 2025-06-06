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
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage for persistent login
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const userId = user?.user_id || '';
  const username = user?.username || '';

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

  // Save user info to localStorage for persistent login
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  if (!userId) {
    // onLogin expects { user_id, username }
    return <Login onLogin={setUser} />;
  }

  const handleSelectConversation = (id) => {
    loadConversation(id, settings);
  };

  const handleCreateConversation = () => {
    const title = 'Cuộc trò chuyện';
    createNewConversation(title, settings);
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
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
            username={username}
            onLogout={handleLogout}
          />
        </ErrorBoundary>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white border-b border-orange-100 p-4 shadow-sm flex-shrink-0 flex items-center justify-between">
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
            {username && (
              <span className="ml-4 text-gray-500 text-sm">Hi, <b>{username}</b></span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-orange-500 underline text-sm ml-4"
          >
            Đăng xuất
          </button>
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