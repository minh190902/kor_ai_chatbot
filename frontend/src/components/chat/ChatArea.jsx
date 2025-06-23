import React, { useEffect, useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { fetchContextInfo } from '../../services/api';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';

const ChatArea = ({
  messages,
  isLoading,
  inputMessage,
  setInputMessage,
  onSend,
  currentConversationId,
  onResetConversation
}) => {
  const [contextInfo, setContextInfo] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!currentConversationId) return;
    fetchContextInfo('', currentConversationId)
      .then(setContextInfo)
      .catch(() => setContextInfo(null));
  }, [currentConversationId]);

  return (
    <div className="h-full flex flex-col">
      {currentConversationId && (
        <div className="flex justify-end p-2">
          <button
            title={t("chat_area.delete_msg.title")}
            className="p-1 rounded hover:bg-red-100 transition"
            onClick={() => {
              if (window.confirm(t("chat_area.delete_msg.warning"))) {
                onResetConversation(currentConversationId);
              }
            }}
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      )}
      {contextInfo?.truncated && (
        <div className="p-2 bg-yellow-50 text-yellow-700 text-xs rounded mb-2">
          {t("chat_area.truncated")}
        </div>
      )}
      {contextInfo?.summary && (
        <div className="p-2 bg-blue-50 text-blue-700 text-xs rounded mb-2">
          {t("chat_area.summary")}: {contextInfo.summary}
        </div>
      )}
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
};

export default ChatArea;