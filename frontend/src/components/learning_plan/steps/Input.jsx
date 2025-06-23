import { useTranslation } from "react-i18next";

const Input = ({
  step,
  level, setLevel, LEVELS,
  goals, setGoals, GOALS, topikLevel, setTopikLevel, otherGoal, setOtherGoal,
  duration, setDuration, customDuration, setCustomDuration, DURATIONS,
  hours, setHours, HOURS,
  nextStep, prevStep
}) => {
  // Handler cho goals
  const handleGoalChange = (goal) => {
    if (goals.includes(goal)) setGoals(goals.filter(g => g !== goal));
    else setGoals([...goals, goal]);
  };
  const { t } = useTranslation();

  // Render step content based on current step
  if (step === "level") {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">📊 Your Current Korean Level</h2>
        <div className="w-full space-y-3 mb-6">
          {LEVELS.map(l => (
            <label key={l} className={`block cursor-pointer bg-orange-50 rounded-xl px-4 py-3 border-2 ${level === l ? 'border-orange-400 bg-orange-100' : 'border-transparent'} transition-all`}>
              <input
                type="radio"
                name="level"
                value={l}
                checked={level === l}
                onChange={() => setLevel(l)}
                className="mr-3"
              />
              {l}
            </label>
          ))}
        </div>
        <div className="flex gap-4 mt-2">
          <button
            onClick={prevStep}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold"
          >{t("common.back")}</button>
          <button
            onClick={() => level && nextStep()}
            className={`px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-orange-400 to-yellow-400 shadow ${level ? 'hover:from-orange-500 hover:to-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
            disabled={!level}
          >{t("common.next")}</button>
        </div>
      </div>
    );
  }

  if (step === "goals") {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">🎯 Your Learning Goals</h2>
        <div className="w-full space-y-3 mb-6">
          {GOALS.map(g => (
            <label key={g.value} className={`block cursor-pointer bg-orange-50 rounded-xl px-4 py-3 border-2 ${goals.includes(g.value) ? 'border-orange-400 bg-orange-100' : 'border-transparent'} transition-all`}>
              <input
                type="checkbox"
                value={g.value}
                checked={goals.includes(g.value)}
                onChange={() => handleGoalChange(g.value)}
                className="mr-3"
              />
              {g.label}
              {g.value === 'topik' && goals.includes('topik') && (
                <select
                  className="ml-2 border rounded px-2 py-1 text-sm"
                  value={topikLevel}
                  onChange={e => setTopikLevel(e.target.value)}
                  required
                >
                  <option value="">Choose level</option>
                  {[1,2,3,4,5,6].map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              )}
            </label>
          ))}
          <label className={`block cursor-pointer bg-orange-50 rounded-xl px-4 py-3 border-2 ${goals.includes('other') ? 'border-orange-400 bg-orange-100' : 'border-transparent'} transition-all`}>
            <input
              type="checkbox"
              checked={goals.includes('other')}
              onChange={e => {
                if (e.target.checked) {
                  setGoals([...goals, 'other']);
                } else {
                  setGoals(goals.filter(g => g !== 'other'));
                  setOtherGoal('');
                }
              }}
              className="mr-3"
            />
            Other:
            <input
              type="text"
              className="border rounded px-2 py-1 text-sm flex-1 ml-2"
              value={otherGoal}
              onChange={e => setOtherGoal(e.target.value)}
              placeholder="Your goal"
              disabled={!goals.includes('other')}
            />
          </label>
        </div>
        <div className="flex gap-4 mt-2">
          <button
            onClick={prevStep}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold"
          >{t("common.back")}</button>
          <button
            onClick={() => goals.length > 0 && nextStep()}
            className={`px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-orange-400 to-yellow-400 shadow ${goals.length > 0 ? 'hover:from-orange-500 hover:to-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
            disabled={goals.length === 0}
          >{t("common.next")}</button>
        </div>
      </div>
    );
  }

  if (step === "duration") {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">📅 Learning Duration</h2>
        <div className="w-full space-y-3 mb-6">
          {DURATIONS.map(d => (
            <label key={d.value} className={`block cursor-pointer bg-orange-50 rounded-xl px-4 py-3 border-2 ${duration === d.value || (d.value === 'custom' && customDuration) ? 'border-orange-400 bg-orange-100' : 'border-transparent'} transition-all`}>
              <input
                type="radio"
                name="duration"
                value={d.value}
                checked={duration === d.value || (d.value === 'custom' && customDuration)}
                onChange={() => {
                  setDuration(d.value);
                  if (d.value !== 'custom') setCustomDuration('');
                }}
                className="mr-3"
              />
              {d.label}
              {d.value === 'custom' && duration === 'custom' && (
                <input
                  type="number"
                  min={1}
                  className="ml-2 border rounded px-2 py-1 w-20"
                  value={customDuration}
                  onChange={e => setCustomDuration(e.target.value)}
                  placeholder="months"
                  required
                />
              )}
            </label>
          ))}
        </div>
        <div className="flex gap-4 mt-2">
          <button
            onClick={prevStep}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold"
          >{t("common.back")}</button>
          <button
            onClick={() => (duration !== '' && (duration !== 'custom' || customDuration)) && nextStep()}
            className={`px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-orange-400 to-yellow-400 shadow ${(duration !== '' && (duration !== 'custom' || customDuration)) ? 'hover:from-orange-500 hover:to-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
            disabled={duration === '' || (duration === 'custom' && !customDuration)}
          >{t("common.next")}</button>
        </div>
      </div>
    );
  }

  if (step === "hours") {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">⏰ Weekly Study Time</h2>
        <div className="w-full space-y-3 mb-6">
          {HOURS.map(h => (
            <label key={h.value} className={`block cursor-pointer bg-orange-50 rounded-xl px-4 py-3 border-2 ${hours === h.value ? 'border-orange-400 bg-orange-100' : 'border-transparent'} transition-all`}>
              <input
                type="radio"
                name="hours"
                value={h.value}
                checked={hours === h.value}
                onChange={() => setHours(h.value)}
                className="mr-3"
              />
              {h.label}
            </label>
          ))}
        </div>
        <div className="flex gap-4 mt-2">
          <button
            onClick={prevStep}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold"
          >{t("common.back")}</button>
          <button
            onClick={() => hours && nextStep()}
            className={`px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-orange-400 to-yellow-400 shadow ${hours ? 'hover:from-orange-500 hover:to-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
            disabled={!hours}
          >{t("common.next")}</button>
        </div>
      </div>
    );
  }

  return null;
};

export default Input;