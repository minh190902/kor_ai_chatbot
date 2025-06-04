import React from 'react';
import { formatTime } from '../../utils/formatters';

const ConversationList = ({ conversations, currentId, onSelect }) => (
  <div className="space-y-2">
    {conversations.map(conv => (
      <button
        key={conv.id}
        onClick={() => onSelect(conv.id)}
        className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-gray-100 ${
          currentId === conv.id ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-200'
        }`}
      >
        <div className="font-medium text-gray-800 truncate">
          {conv.title || 'Cuộc trò chuyện'}
        </div>
        <div className="text-sm text-gray-500">
          {formatTime(conv.updatedAt || conv.createdAt || conv.startedAt)}
        </div>
      </button>
    ))}
  </div>
);

export default ConversationList;