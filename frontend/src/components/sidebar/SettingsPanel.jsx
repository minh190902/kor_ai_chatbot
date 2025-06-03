import React from 'react';
import { DEFAULT_SETTINGS } from '../../utils/constants';

const SettingsPanel = ({ settings, setSettings }) => (
  <div className="p-4 bg-gray-50 border-b border-gray-200">
    <h3 className="font-semibold mb-3 text-gray-800">Cài đặt</h3>
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          API Endpoint
        </label>
        <input
          type="text"
          value={settings.apiEndpoint}
          onChange={e => setSettings(prev => ({ ...prev, apiEndpoint: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Temperature: {settings.temperature}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={settings.temperature}
          onChange={e => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
          className="w-full"
        />
      </div>
    </div>
  </div>
);

export default SettingsPanel;