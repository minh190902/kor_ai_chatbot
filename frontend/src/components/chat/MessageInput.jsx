import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ inputMessage, setInputMessage, onSend, isLoading }) => {
  const inputRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="border-t border-orange-100 p-4 bg-white">
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn của bạn..."
            className="w-full px-4 py-3 border border-orange-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
            disabled={isLoading}
          />
        </div>
        <button
          onClick={onSend}
          disabled={!inputMessage.trim() || isLoading}
          className="p-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-full hover:from-orange-500 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-lg hover:shadow-xl"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
      </p>
    </div>
  );
};

export default MessageInput;