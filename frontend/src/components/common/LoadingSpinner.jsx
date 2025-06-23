import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LoadingSpinner = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
      <span className="text-gray-600">{t('common.ai_loading')}</span>
    </div>
  );
};

export default LoadingSpinner;