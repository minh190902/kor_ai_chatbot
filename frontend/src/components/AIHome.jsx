import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, CalendarCheck, Brain, BookOpen, LogOut } from 'lucide-react';
import LanguageSwitcher from './common/LanguageSwitcher';

const features = [
  {
    title: 'AI Korean Learning Chat',
    description: 'Trò chuyện luyện tập tiếng Hàn với AI.',
    icon: <MessageCircle className="w-10 h-10 text-orange-500" />,
    path: '/chat',
  },
  {
    title: 'AI Learning Planner',
    description: 'Lập kế hoạch học tập cá nhân hóa.',
    icon: <CalendarCheck className="w-10 h-10 text-yellow-500" />,
    path: '/learning-plan',
  },
  {
    title: 'AI Problem Generation',
    description: 'Tạo bài tập, câu hỏi luyện tập tự động.',
    icon: <Brain className="w-10 h-10 text-orange-400" />,
    path: '/problem-generation',
  },
  {
    title: 'Vocabulary Expansion',
    description: 'Mở rộng vốn từ vựng hiệu quả.',
    icon: <BookOpen className="w-10 h-10 text-yellow-400" />,
    path: '/vocab-expansion',
  },
];

const AIHome = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex flex-col items-center justify-center relative">
      {/* Language Switcher ở giữa top */}
      <div className="w-full flex justify-center mt-6 mb-2">
        <LanguageSwitcher />
      </div>
      {/* Logout ở góc phải */}
      <div className="absolute top-4 right-4">
        <button
          onClick={onLogout}
          className="text-orange-500 underline text-sm flex items-center gap-1"
        >
          <LogOut className="w-4 h-4" /> Đăng xuất
        </button>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">AI Korean Learning</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {features.map((f) => (
          <div
            key={f.title}
            onClick={() => navigate(f.path)}
            className="cursor-pointer bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition group border border-orange-100 hover:border-orange-300"
          >
            <div className="mb-4">{f.icon}</div>
            <h2 className="text-xl font-semibold text-gray-800 group-hover:text-orange-500">{f.title}</h2>
            <p className="text-gray-500 mt-2 text-center">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIHome;