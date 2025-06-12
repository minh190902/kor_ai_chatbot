import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import ChatArea from './components/chat/ChatArea';
import ChatHeader from './components/chat/ChatHeader';
import ErrorBoundary from './components/common/ErrorBoundary';
import Login from './components/auth/login';
import AdminDashboard from './components/admin/AdminDashboard';
import LearningPlan from './components/learning_plan/LearningPlan';
import AIHome from './components/AIHome';
import { useConversations } from './hooks/useConversations';
import { useChat } from './hooks/useChat';
import { DEFAULT_SETTINGS } from './utils/constants';
import { searchConversations } from './services/conversationSearch';

const ChatLayout = ({
  user,
  settings,
  setSettings,
  sidebarOpen,
  setSidebarOpen,
  conversations,
  setConversations,
  currentConversationId,
  messages,
  setMessages,
  loadConversation,
  createNewConversation,
  deleteConversationById,
  loadConversations,
  inputMessage,
  setInputMessage,
  isLoading,
  sendMessage,
  handleLogout,
  handleSearchConversations,
  username,
}) => (
  <div className="flex h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
    {/* Sidebar */}
    <div
      className={`${
        sidebarOpen ? 'w-80' : 'w-0'
      } transition-all duration-300 bg-white shadow-xl border-r border-orange-100 flex flex-col overflow-hidden flex-shrink-0`}
    >
      <ErrorBoundary>
        <Sidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={loadConversation}
          onCreateConversation={createNewConversation}
          settings={settings}
          setSettings={setSettings}
          onCloseSidebar={() => setSidebarOpen(false)}
          onSearchConversations={handleSearchConversations}
          onDeleteConversation={deleteConversationById}
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

const App = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    deleteConversationById, 
  } = useConversations(userId);

  const { inputMessage, setInputMessage, isLoading, sendMessage } = useChat(
    currentConversationId,
    setMessages,
    userId,
    settings
  );

  useEffect(() => {
    if (userId) {
      loadConversations(settings);
    }
    // eslint-disable-next-line
  }, [settings, userId]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Login handler
  const handleLogin = (userInfo) => {
    setUser(userInfo);
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    setMessages([]);
    localStorage.removeItem('user');
  };

  // Filter conversations by search term
  const handleSearchConversations = async ({ q, from, to }) => {
    try {
      const data = await searchConversations({ userId, q, from, to });
      setConversations(data);
    } catch (err) {
      setError('Không thể tìm kiếm cuộc trò chuyện. Vui lòng thử lại!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route
        path="/admin"
        element={
          user.role === 'admin' ? (
            <AdminDashboard user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/ai" />
          )
        }
      />
      <Route
        path="/ai"
        element={<AIHome onLogout={handleLogout} />}
      />
      <Route
        path="/chat"
        element={
          <ChatLayout
            user={user}
            settings={settings}
            setSettings={setSettings}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            conversations={conversations}
            setConversations={setConversations}
            currentConversationId={currentConversationId}
            messages={messages}
            setMessages={setMessages}
            loadConversation={loadConversation}
            createNewConversation={createNewConversation}
            deleteConversationById={deleteConversationById}
            loadConversations={loadConversations}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            isLoading={isLoading}
            sendMessage={sendMessage}
            handleLogout={handleLogout}
            handleSearchConversations={handleSearchConversations}
            username={username}
          />
        }
      />
      <Route path="/learning-plan" element={<LearningPlan user_id={userId} />} />
      <Route path="/problem-generation" element={<div>Problem Generation Feature Coming Soon</div>} />
      <Route path="/vocab-expansion" element={<div>Vocabulary Expansion Feature Coming Soon</div>} />
      {/* Redirect root to correct page */}
      <Route
        path="*"
        element={
          <Navigate to={user.role === 'admin' ? '/admin' : '/ai'} />
        }
      />
    </Routes>
  );
};

export default App;