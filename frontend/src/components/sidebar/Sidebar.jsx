import React, { useState } from 'react';
import { MessageSquare, History, Settings } from 'lucide-react';
import ConversationList from './ConversationList';
import SettingsPanel from './SettingsPanel';

const Sidebar = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onCreateConversation,
  settings,
  setSettings,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            AI Chat
          </h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <button
          onClick={onCreateConversation}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Cuộc trò chuyện mới
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && <SettingsPanel settings={settings} setSettings={setSettings} />}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <History className="w-4 h-4" />
            Lịch sử trò chuyện
          </h3>
          <ConversationList
            conversations={conversations}
            currentId={currentConversationId}
            onSelect={onSelectConversation}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;