import React from 'react';
import { Menu, ArrowLeft } from 'lucide-react';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({
  sidebarOpen,
  setSidebarOpen,
  username,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="border-b bg-white shadow-sm flex items-center justify-between px-6 h-16">
      {/* Trái */}
      <div className="flex items-center gap-2 min-w-0">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-orange-500 mr-2"
            title="Mở menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <span className="font-bold text-orange-500 text-xl">AI CHAT</span>
        {username && (
          <span className="ml-4 text-gray-500 text-sm truncate">
            {t("header.greeting")}<b>{username}</b>
          </span>
        )}
      </div>
      {/* Giữa */}
      <div className="flex-1 flex justify-center items-center">
        <LanguageSwitcher />
      </div>
      {/* Phải */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/ai')}
          className="text-orange-500 underline text-sm flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Home
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;