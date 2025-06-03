import React from 'react';
import Message from './Message';
import LoadingSpinner from '../common/LoadingSpinner';
import { Bot } from 'lucide-react';;

const MessageList = ({ messages, isLoading }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages.length === 0 ? (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">Chào bạn! Tôi là AI assistant.</p>
          <p>Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn.</p>
        </div>
      </div>
    ) : (
      messages.map(msg => <Message key={msg.id} message={msg} />)
    )}

    {isLoading && (
      <div className="flex justify-start">
        <div className="flex items-start space-x-3 max-w-3xl">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <Bot className="w-4 h-4 text-gray-600" />
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    )}
  </div>
);

export default MessageList;