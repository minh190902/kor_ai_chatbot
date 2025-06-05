import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatArea = ({ messages, isLoading, inputMessage, setInputMessage, onSend }) => (
  <div className="flex-1 flex flex-col h-full max-h-screen">
    <MessageList messages={messages} isLoading={isLoading} />
    <MessageInput
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      onSend={onSend}
      isLoading={isLoading}
    />
  </div>
);

export default ChatArea;