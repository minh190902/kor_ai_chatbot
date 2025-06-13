import React from "react";
import useLearningPlans from "../../hooks/useLearningPlans";

const LearningPlanSidebar = ({ userId, onSelectPlan, currentPlanId }) => {
  const { plans, loading } = useLearningPlans(userId);

  return (
    <div className="p-4">
      <h3 className="font-bold mb-2 text-orange-600">📚 Learning Plans</h3>
      {loading && <div>Loading...</div>}
      {plans.length === 0 && !loading && <div>No plans yet.</div>}
      <ul className="space-y-2">
        {plans.map(plan => (
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
  );
};

export default LearningPlanSidebar;