import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import ChatArea from './components/chat/ChatArea';
import ChatHeader from './components/chat/ChatHeader';
import ErrorBoundary from './components/common/ErrorBoundary';
import Login from './components/auth/login';
import { useConversations } from './hooks/useConversations';
import { useChat } from './hooks/useChat';
import { DEFAULT_SETTINGS } from './utils/constants';
import { searchConversations } from './services/conversationSearch';


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
    setConversations,
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

  const handleSearchConversations = async ({ q, from, to }) => {
    try {
      const data = await searchConversations({ userId, q, from, to });
      setConversations(data);
    } catch (err) {
      setError('Không thể tìm kiếm cuộc trò chuyện. Vui lòng thử lại!');
    }
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
            onSearchConversations={handleSearchConversations}
          />
        </ErrorBoundary>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Chat Header */}
        <ChatHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          username={username}
          onLogout={handleLogout}
        />
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