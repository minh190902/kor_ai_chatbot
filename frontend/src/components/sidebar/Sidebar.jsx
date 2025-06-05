import React, { useState } from 'react';
import { MessageCircle, History, Settings, X, Plus, Search, Trash2 } from 'lucide-react';
import ConversationList from './ConversationList';
import SettingsPanel from './SettingsPanel';

const Sidebar = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onCreateConversation,
  settings,
  setSettings,
  onCloseSidebar,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter conversations by search term
  const filteredConversations = conversations.filter(conv =>
    (conv.title || 'Cuộc trò chuyện').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 bg-white shadow-xl border-r border-orange-100 flex flex-col h-full overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-orange-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">AI Chat</h1>
          </div>
          <button
            onClick={onCloseSidebar}
            className="p-1 hover:bg-orange-100 rounded-lg transition-colors lg:hidden"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button
          onClick={onCreateConversation}
          className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white py-3 px-4 rounded-xl font-medium hover:from-orange-500 hover:to-yellow-500 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Cuộc trò chuyện mới</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-orange-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          />
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-orange-100">
          <SettingsPanel settings={settings} setSettings={setSettings} />
        </div>
      )}

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-sm font-semibold text-gray-500 flex items-center">
              <History className="w-4 h-4 mr-2" />
              Lịch sử trò chuyện
            </h3>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-orange-50 transition-colors"
              title="Cài đặt"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          {/* Conversation List */}
          <div className="space-y-2">
            {filteredConversations.length === 0 ? (
              <div className="text-gray-400 text-sm px-2 py-4 text-center">Không có cuộc trò chuyện nào</div>
            ) : (
              filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`p-3 m-1 rounded-xl cursor-pointer transition-all duration-200 group relative ${
                    currentConversationId === conv.id
                      ? 'bg-gradient-to-r from-orange-100 to-yellow-100 border-l-4 border-orange-400'
                      : 'hover:bg-orange-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate">{conv.title || 'Cuộc trò chuyện'}</h4>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {conv.messages && conv.messages.length > 0
                          ? conv.messages[conv.messages.length - 1].content || conv.messages[conv.messages.length - 1].text
                          : ''}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (conv.onDelete) conv.onDelete(conv.id);
                        }}
                        className="p-1 hover:bg-red-100 rounded text-red-400 hover:text-red-600 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;