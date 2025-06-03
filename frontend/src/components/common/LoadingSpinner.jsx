import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex items-center space-x-2">
    <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
    <span className="text-gray-600">AI đang suy nghĩ...</span>
  </div>
);

export default LoadingSpinner;