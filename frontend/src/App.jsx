import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/auth/login';
import PrivateRoute from './components/auth/private';
import AdminDashboard from './components/admin/AdminDashboard';
import Modal from './components/common/Modal';
import ChatLayout from './components/chat/ChatLayout';
import LearningPlan from './components/learning_plan/LearningPlan';
import VocabularyExpansion from './components/vocab/vocabularyExpansion';
import TopikGeneration from './components/topik_gen/TopikGeneration';
import AIHome from './components/AIHome';
import { useConversations } from './hooks/useConversations';
import { useTranslation } from 'react-i18next';
import { useChat } from './hooks/useChat';
import { DEFAULT_SETTINGS } from './utils/constants';
import { searchConversations } from './services/conversationSearch';

const App = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t } = useTranslation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = user?.user_id || user?.id || '';
  const username = user?.username || '';

  const navigate = useNavigate();

  // Callback để hiện popup khi user không hợp lệ
  const handleInvalidUser = useCallback(() => {
    setShowLoginModal(true);
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const handleCloseModal = () => setShowLoginModal(false);

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
    handleResetConversation
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
    setUser(userInfo.data);
    setShowLoginModal(false);
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    setMessages([]);
    localStorage.removeItem('user');
    navigate('/');
  };

  // Filter conversations by search term
  const handleSearchConversations = async ({ q, from, to }) => {
    try {
      const data = await searchConversations({ userId, q, from, to });
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Không thể tìm kiếm cuộc trò chuyện. Vui lòng thử lại!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showLoginModal && (
        <Modal onClose={handleCloseModal}>
          <div>{t('login.error.no_login')}</div>
        </Modal>
      )}
      <Routes>
        <Route
          path="/admin"
          element={
            <PrivateRoute onInvalidUser={handleInvalidUser}>
              {user && user.role === 'admin' ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/ai" />
              )}
            </PrivateRoute>
          }
        />
        <Route
          path="/ai"
          element={
            <PrivateRoute onInvalidUser={handleInvalidUser}>
              <AIHome onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute onInvalidUser={handleInvalidUser}>
              <ChatLayout
                user={user}
                settings={settings}
                setSettings={setSettings}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                conversations={conversations}
                currentConversationId={currentConversationId}
                messages={messages}
                loadConversation={loadConversation}
                createNewConversation={createNewConversation}
                deleteConversationById={deleteConversationById}
                handleResetConversation={handleResetConversation}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                isLoading={isLoading}
                sendMessage={sendMessage}
                handleLogout={handleLogout}
                handleSearchConversations={handleSearchConversations}
                username={username}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/learning-plan"
          element={
            <PrivateRoute onInvalidUser={handleInvalidUser}>
              <LearningPlan user_id={userId} />
            </PrivateRoute>
          }
        />
        <Route
          path="/vocab-expansion"
          element={
            <PrivateRoute onInvalidUser={handleInvalidUser}>
              <VocabularyExpansion user_id={userId} />
            </PrivateRoute>
          }
        />
        <Route
          path="/topik-generation"
          element={
            <PrivateRoute onInvalidUser={handleInvalidUser}>
              <TopikGeneration user_id={userId} />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="*"
          element={
            <Navigate to={user && user.role === 'admin' ? '/admin' : '/ai'} />
          }
        />
      </Routes>
    </>
  );
};

export default App;