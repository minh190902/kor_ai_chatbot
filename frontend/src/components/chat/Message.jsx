import { User, Bot } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

const Message = ({ message }) => (
  <div className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`flex items-start max-w-xl ${message.role === 'USER' ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        message.role === 'USER'
          ? 'bg-gray-600 ml-3'
          : 'bg-gradient-to-r from-orange-400 to-yellow-400 mr-3'
      }`}>
        {message.role === 'USER'
          ? <User className="w-5 h-5 text-white" />
          : <Bot className="w-5 h-5 text-white" />}
      </div>
      <div>
        <div className={`px-4 py-3 rounded-2xl ${
          message.role === 'USER'
            ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-lg'
            : message.isError
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-white border border-orange-100 text-gray-800 shadow-sm'
        }`}>
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
        <div className={`text-xs mt-2 ${
          message.role === 'USER' ? 'text-orange-100 text-right' : 'text-gray-400 text-left'
        }`}>{formatTime(message.timestamp)}</div>
      </div>
    </div>
  </div>
);

export default Message;