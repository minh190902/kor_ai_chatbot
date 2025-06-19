import React, { useState } from "react";
import useLearningPlans from "../../hooks/useLearningPlans";
import { Settings } from "lucide-react";
import LearningPlanSettings from "../learning_plan/Settings";

const LearningPlanSidebar = ({ userId, onSelectPlan, currentPlanId, settings, setSettings }) => {
  const { plans, loading } = useLearningPlans(userId);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="h-full w-72 bg-white shadow-xl border-r border-orange-100 flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-orange-100">
        <h3 className="font-bold text-orange-600 text-lg flex-1">📚 Learning Plans</h3>
        <button
          className="p-2 rounded-lg hover:bg-orange-50 transition-colors"
          title="AI Settings"
          onClick={() => setShowSettings(s => !s)}
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      {showSettings && (
        <div className="border-b border-orange-100">
          <LearningPlanSettings settings={settings} setSettings={setSettings} />
        </div>
      )}
      <div className="px-4 py-2 border-b border-orange-100 font-semibold text-gray-700 text-sm">
        History
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading && <div>Loading...</div>}
        {plans.length === 0 && !loading && <div>No plans yet.</div>}
        <ul className="space-y-2">
          {(Array.isArray(plans) ? plans : []).map(plan => (
            <li
              key={plan.plan_id}
              className={`p-2 rounded-lg cursor-pointer ${plan.plan_id === currentPlanId ? "bg-orange-100 font-bold" : "hover:bg-orange-50"}`}
              onClick={() => onSelectPlan(plan.plan_id)}
            >
              <div className="text-sm">{plan.title}</div>
              <div className="text-xs text-gray-500">{plan.created_at?.slice(0,10)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LearningPlanSidebar;