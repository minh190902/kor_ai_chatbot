import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation();
  return (
    <div className={`flex gap-2 justify-end mb-4 ${className}`}>
      <button
        className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-orange-400 text-white' : 'bg-gray-100'}`}
        onClick={() => i18n.changeLanguage('en')}
      >
        EN
      </button>
      <button
        className={`px-2 py-1 rounded ${i18n.language === 'vi' ? 'bg-orange-400 text-white' : 'bg-gray-100'}`}
        onClick={() => i18n.changeLanguage('vi')}
      >
        VI
      </button>
      <button
        className={`px-2 py-1 rounded ${i18n.language === 'ko' ? 'bg-orange-400 text-white' : 'bg-gray-100'}`}
        onClick={() => i18n.changeLanguage('ko')}
      >
        KO
      </button>
    </div>
  );
};

export default LanguageSwitcher;