import Sidebar from '../sidebar/Sidebar';
import ChatArea from './ChatArea';
import ChatHeader from './ChatHeader';
import ErrorBoundary from '../common/ErrorBoundary';

const ChatLayout = ({
  user,
  settings,
  setSettings,
  sidebarOpen,
  setSidebarOpen,
  conversations,
  currentConversationId,
  messages,
  loadConversation,
  createNewConversation,
  deleteConversationById,
  handleResetConversation,
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
            onResetConversation={handleResetConversation}
          />
        </ErrorBoundary>
      </div>
    </div>
  </div>
);

export default ChatLayout;