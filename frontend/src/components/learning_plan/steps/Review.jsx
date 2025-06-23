import { useTranslation } from "react-i18next"

const Review = ({
  level,
  goals,
  GOALS,
  topikLevel,
  otherGoal,
  duration,
  customDuration,
  hours,
  HOURS,
  onBack,
  onSubmit
}) => {
  const { t } = useTranslation();
  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-orange-500 mb-4">✅ Review Your Plan</h2>
      <div className="w-full bg-orange-50 rounded-xl p-4 mb-6 text-gray-800">
        <div><b>Level:</b> {level}</div>
        <div>
          <b>Goals:</b>{" "}
          {goals
            .map((g) =>
              g === "topik" && topikLevel
                ? `TOPIK Level ${topikLevel}`
                : GOALS.find((x) => x.value === g)?.label
            )
            .join(", ")}
          {otherGoal && `, ${otherGoal}`}
        </div>
        <div><b>Duration:</b> {customDuration || duration} months</div>
        <div>
          <b>Weekly Study Time:</b>{" "}
          {HOURS.find((h) => h.value === hours)?.label}
        </div>
      </div>
      <div className="flex gap-4 mt-2 mb-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold"
        >
          {t("common.back")}
        </button>
        <button
          type="submit"
          className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-400 to-yellow-400 shadow hover:from-orange-500 hover:to-yellow-500 text-lg"
        >
          {t("learning_plan.submit")}
        </button>
      </div>
    </form>
  );
};

export default Review;