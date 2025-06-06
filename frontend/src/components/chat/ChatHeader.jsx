import React from 'react';
import { Menu } from 'lucide-react';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const ChatHeader = ({
  sidebarOpen,
  setSidebarOpen,
  username,
  onLogout,
}) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white border-b border-orange-100 p-4 shadow-sm flex-shrink-0 flex items-center justify-between">
      <div className="flex items-center">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-orange-100 rounded-lg transition-colors mr-3"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <span className="font-bold text-orange-500 text-xl">AI CHAT</span>
        {username && (
          <span className="ml-4 text-gray-500 text-sm">
            {t("header.greeting")}<b>{username}</b>
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <button
          onClick={onLogout}
          className="text-orange-500 underline text-sm ml-2"
        >
          {t('header.logout') || 'Đăng xuất'}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;