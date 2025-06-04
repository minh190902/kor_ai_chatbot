import React from 'react';
import { User, Bot } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

const Message = ({ message }) => (
  <div className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
    <div className={`flex items-start space-x-3 max-w-3xl ${message.role === 'USER' ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        message.role === 'USER' ? 'bg-blue-600' : message.isError ? 'bg-red-100' : 'bg-gray-200'
      }`}>
        {message.role === 'USER' ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className={`w-4 h-4 ${message.isError ? 'text-red-600' : 'text-gray-600'}`} />
        )}
      </div>
      <div className={`px-4 py-3 rounded-2xl ${
        message.role === 'USER'
          ? 'bg-blue-600 text-white'
          : message.isError
            ? 'bg-red-50 border border-red-200 text-red-800'
            : 'bg-white border border-gray-200 text-gray-800'
      }`}>
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div className={`text-xs mt-2 ${
          message.role === 'USER' ? 'text-blue-100' : 'text-gray-500'
        }`}>{formatTime(message.timestamp)}</div>
      </div>
    </div>
  </div>
);

export default Message;