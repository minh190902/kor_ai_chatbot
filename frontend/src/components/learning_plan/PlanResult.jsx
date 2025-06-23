import { ArrowLeft } from "lucide-react";
import { XMLParser } from "fast-xml-parser";
import { useTranslation } from "react-i18next";

// Helper render functions
function renderList(items) {
  if (!items) return null;
  if (Array.isArray(items)) return (
    <ul className="list-disc ml-6 space-y-1">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
  return <ul className="list-disc ml-6"><li>{items}</li></ul>;
}

function renderWeeklyPlan(weeklyPlan) {
  if (!weeklyPlan) return null;
  const days = Array.isArray(weeklyPlan.day) ? weeklyPlan.day : [weeklyPlan.day];
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 text-orange-600">📋 Weekly Study Plan</h3>
      <div className="grid gap-4">
        {days.map((day, idx) => (
          <div key={idx} className="bg-orange-50 rounded-lg p-4 shadow">
            <div className="font-bold text-orange-700 mb-1">
              {day['@_name']} <span className="text-gray-500 font-normal">({day['@_time']})</span>
            </div>
            <div className="mb-1 text-sm text-orange-800">
              <b>Focus:</b> {day.focus}
            </div>
            {renderList(day.activity?.item)}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderStrategies(strategies) {
  if (!strategies) return null;
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 text-orange-600">🎯 Learning Strategies</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(strategies).map(([skill, val]) => (
          <div key={skill} className="bg-yellow-50 rounded-lg p-4">
            <div className="font-semibold capitalize mb-1">{skill}</div>
            {renderList(val.item)}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderResources(resources) {
  if (!resources) return null;
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 text-orange-600">📚 Recommended Resources</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(resources).map(([type, val]) => (
          <div key={type} className="bg-orange-50 rounded-lg p-4">
            <div className="font-semibold capitalize mb-1">{type.replace(/_/g, " ")}</div>
            {renderList(val.item)}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderTimeline(timeline) {
  if (!timeline) return null;
  const phases = Array.isArray(timeline.phase) ? timeline.phase : [timeline.phase];
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 text-orange-600">🗓️ Timeline & Milestones</h3>
      <div className="space-y-4">
        {phases.map((phase, idx) => (
          <div key={idx} className="bg-yellow-50 rounded-lg p-4">
            <div className="font-bold text-orange-700 mb-1">{phase['@_name']}</div>
            <div className="mb-1 text-sm text-orange-800"><b>Objective:</b> {phase.objective}</div>
            {renderList(phase.plan?.item)}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderTips(tips) {
  if (!tips) return null;
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 text-orange-600">💡 Tips for Success</h3>
      {renderList(tips.item)}
    </div>
  );
}

const PlanResult = ({ plan, onBack }) => {
  // Parse XML
  let parsed = null;
  const { t } = useTranslation();
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      trimValues: true,
      parseTagValue: true,
      parseAttributeValue: true,
      allowBooleanAttributes: true,
    });
    // Remove BOM if present
    let xml = plan.learning_plan?.trim();
    if (xml?.charCodeAt(0) === 0xFEFF) xml = xml.slice(1);
    parsed = parser.parse(xml);
  } catch (e) {
    parsed = null;
  }

  const studyPlan = parsed?.study_plan;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-orange-500 flex items-center gap-2">
          {t("learning_plan.success")}
        </h2>
        <button
          onClick={onBack}
          className="text-orange-500 underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> {t("common.back")}
        </button>
      </div>
      {studyPlan ? (
        <>
          <div className="mb-4">
            <div className="text-lg font-semibold text-orange-700">{studyPlan.title}</div>
            <div className="text-gray-700 mt-2">{studyPlan.overview}</div>
          </div>
          {renderWeeklyPlan(studyPlan.weekly_plan)}
          {renderStrategies(studyPlan.learning_strategies)}
          {renderResources(studyPlan.recommended_resources)}
          {renderTimeline(studyPlan.timeline)}
          {renderTips(studyPlan.tips)}
        </>
      ) : (
        <pre className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap text-red-600">
          {t("learning_plan.error.no_plan")}<br />
          <span className="text-xs">{plan.learning_plan}</span>
        </pre>
      )}
    </div>
  );
};

export default PlanResult;