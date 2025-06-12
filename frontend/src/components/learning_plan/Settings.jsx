import React from "react";

const MODEL_PROVIDERS = [
  { label: "OpenAI", value: "openai" },
  { label: "Azure OpenAI", value: "azure" },
  // Thêm provider khác nếu cần
];

const MODEL_IDS = {
  openai: [
    { label: "GPT-4o Mini", value: "gpt-4o-mini" },
    { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" },
    // Thêm model khác nếu cần
  ],
  azure: [
    { label: "Azure GPT-4", value: "azure-gpt-4" },
    // ...
  ]
};

const LearningPlanSettings = ({ settings, setSettings }) => (
  <div className="p-4 bg-gray-50 border-r border-gray-200 min-w-[260px]">
    <h3 className="font-semibold mb-3 text-gray-800">AI Settings</h3>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model Provider
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={settings.model_provider}
          onChange={e =>
            setSettings(prev => ({
              ...prev,
              model_provider: e.target.value,
              model_id: MODEL_IDS[e.target.value][0]?.value || ""
            }))
          }
        >
          {MODEL_PROVIDERS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={settings.model_id}
          onChange={e => setSettings(prev => ({ ...prev, model_id: e.target.value }))}
        >
          {(MODEL_IDS[settings.model_provider] || []).map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Temperature: {settings.temperature}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={settings.temperature}
          onChange={e => setSettings(prev => ({ ...prev, temperature: Number(e.target.value) }))}
          className="w-full"
        />
      </div>
    </div>
  </div>
);

export default LearningPlanSettings;