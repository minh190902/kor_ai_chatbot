import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatArea = ({ messages, isLoading, inputMessage, setInputMessage, onSend }) => (
  <div className="flex flex-col h-full">
    <div className="flex-1 min-h-0 overflow-hidden">
      <MessageList messages={messages} isLoading={isLoading} />
    </div>
    <div className="flex-shrink-0">
      <MessageInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        onSend={onSend}
        isLoading={isLoading}
      />
    </div>
  </div>
);

export default ChatArea;