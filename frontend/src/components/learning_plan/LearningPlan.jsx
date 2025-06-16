import React, { useState } from "react";
import LanguageSwitcher from "../common/LanguageSwitcher";
import Welcome from "./steps/Welcome";
import Input from "./steps/Input";
import Review from "./steps/Review";
import LoadingContent from "./LoadingContent";
import PlanResult from "./PlanResult";
import { useNavigate } from "react-router-dom";
import { fetchLearningPlan, fetchLearningPlanDetail } from '../../services/api';
import LearningPlanSidebar from "../sidebar/LearningPlanSidebar";

// Khai báo các constant dùng chung
const LEVELS = [
  "Beginner – Hangul and basic vocabulary",
  "Elementary – Can form simple sentences",
  "Intermediate – Able to engage in daily conversations",
  "Advanced – Can discuss complex topics"
];

const GOALS = [
  { label: "Prepare for TOPIK", value: "topik" },
  { label: "Improve daily conversation", value: "conversation" },
  { label: "Business Korean", value: "business" },
  { label: "Prepare for studying/emigrating to Korea", value: "study_abroad" },
  { label: "Understand K-POP/Drama", value: "kpop" }
];

const DURATIONS = [
  { label: "3 months (intensive)", value: "3 months (intensive)" },
  { label: "6 months (standard)", value: "6 months (standard)" },
  { label: "12 months (relaxed)", value: "12 months (relaxed)" },
  { label: "Custom", value: "custom" }
];

const HOURS = [
  { label: "3–5 hours (weekend focused)", value: 4 },
  { label: "6–10 hours (1 hour/day weekdays)", value: 8 },
  { label: "11–15 hours (2 hours/day weekdays)", value: 13 },
  { label: "16+ hours (intensive learning)", value: 16 }
];

const steps = ["welcome", "level", "goals", "duration", "hours", "review"];

const LearningPlan = ({ user_id }) => {
  const [step, setStep] = useState("welcome");
  const [level, setLevel] = useState("");
  const [goals, setGoals] = useState([]);
  const [topikLevel, setTopikLevel] = useState("");
  const [otherGoal, setOtherGoal] = useState("");
  const [duration, setDuration] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [hours, setHours] = useState(8);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [settings, setSettings] = useState({
    model_provider: "openai",
    model_id: "gpt-4o-mini",
    temperature: 0.7
  });
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  // when user selects a plan from sidebar
  // fetch the plan details and set it to state
  const handleSelectPlan = async (planId) => {
    setCurrentPlanId(planId);
    setLoading(true);
    try {
      const result = await fetchLearningPlanDetail(planId);
      setPlan(result);
    } catch {
      setPlan(null);
    }
    setLoading(false);
  };

  // Stepper logic
  const nextStep = () => setStep(steps[steps.indexOf(step) + 1]);
  const prevStep = () => setStep(steps[steps.indexOf(step) - 1]);

  // Start from welcome step
  const handleStart = () => setStep("level");

  // Submit learning plan
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);
    try {
      const payload = {
        user_id: user_id || "demo_user",
        model_provider: settings.model_provider,
        model_id: settings.model_id,
        temperature: settings.temperature,
        self_assessment: level,
        user_goals: goals.map(g => g === "topik" && topikLevel ? `topik_${topikLevel}` : g)
          .concat(otherGoal ? [otherGoal] : [])
          .join(", "),
        period: duration === "custom" ? customDuration : duration,
        weekly_study_hours: hours,
      };
      const result = await fetchLearningPlan("", payload);
      setPlan({ learning_plan: result.learning_plan });
    } catch (err) {
      alert("Có lỗi khi tạo kế hoạch học tập!");
    }
    setLoading(false);
  };

  // Loading & Result
  if (loading) return <LoadingContent />;
  if (plan)
    return (
      <PlanResult
        plan={plan}
        onBack={() => {
          setPlan(null);
          setCurrentPlanId(null);
          setStep("welcome");
        }}
      />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex flex-row items-stretch py-0">
      {/* Sidebar on the left */}
      <LearningPlanSidebar
        userId={user_id}
        onSelectPlan={handleSelectPlan}
        currentPlanId={currentPlanId}
        settings={settings}
        setSettings={setSettings}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full flex justify-center mb-4 mt-8">
          <LanguageSwitcher />
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full transition-all duration-300 mt-4">
          {step === "welcome" && (
            <Welcome
              onStart={handleStart}
              onBackHome={() => navigate("/ai")}
            />
          )}
          {["level", "goals", "duration", "hours"].includes(step) && (
            <Input
              step={step}
              level={level}
              setLevel={setLevel}
              LEVELS={LEVELS}
              goals={goals}
              setGoals={setGoals}
              GOALS={GOALS}
              topikLevel={topikLevel}
              setTopikLevel={setTopikLevel}
              otherGoal={otherGoal}
              setOtherGoal={setOtherGoal}
              duration={duration}
              setDuration={setDuration}
              customDuration={customDuration}
              setCustomDuration={setCustomDuration}
              DURATIONS={DURATIONS}
              hours={hours}
              setHours={setHours}
              HOURS={HOURS}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === "review" && (
            <Review
              level={level}
              goals={goals}
              GOALS={GOALS}
              topikLevel={topikLevel}
              otherGoal={otherGoal}
              duration={duration}
              customDuration={customDuration}
              hours={hours}
              HOURS={HOURS}
              onBack={prevStep}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPlan;