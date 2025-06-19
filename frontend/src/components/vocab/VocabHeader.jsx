import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useNavigate } from 'react-router-dom';

const VocabHeader = ({ onOpenVocabStore }) => {
  const navigate = useNavigate();

  return (
    <div className="border-b bg-white shadow-sm flex items-center justify-between px-6 h-16">
      {/* Left */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-bold text-orange-500 text-xl">AI VOCAB</span>
      </div>
      {/* Center */}
      <div className="flex-1 flex justify-center items-center">
        <LanguageSwitcher />
      </div>
      {/* Right */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenVocabStore}
          className="text-orange-500 underline text-sm flex items-center gap-1"
        >
          <BookOpen className="w-4 h-4" /> Kho từ vựng của tôi
        </button>
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

export default VocabHeader;