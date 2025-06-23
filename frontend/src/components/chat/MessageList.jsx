import React, { useEffect, useRef } from 'react';
import Message from './Message';
import { Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TypingIndicator = () => (
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center mr-2">
      <Bot className="w-5 h-5 text-white" />
    </div>
    <div className="bg-white border border-orange-100 px-4 py-3 rounded-2xl shadow-sm flex space-x-1">
      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
    </div>
  </div>
);

const MessageList = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);
  const { t } = useTranslation();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 min-h-[400px]">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">{t("chat_area.welcome_message.title")}</h3>
            <p className="text-center max-w-md">{t("chat_area.welcome_message.content")}</p>
          </div>
        ) : (
          <>
            {messages.map(msg => <Message key={msg.id} message={msg} />)}
            
            {isLoading && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;