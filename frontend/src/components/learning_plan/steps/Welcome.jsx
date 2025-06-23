import { useTranslation } from "react-i18next"

const Welcome = ({ onStart }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <h1 className="text-3xl font-bold text-orange-500 mb-4 text-center font-sans">
        🌸 {t("learning_plan.welcome.title")} 🌸
      </h1>
      <p className="text-gray-700 text-lg text-center mb-8">
        {t("learning_plan.welcome.overview")}<br />
        {t("learning_plan.welcome.start")}
      </p>
      <div className="flex gap-4">
        <button
          onClick={onStart}
          className="px-8 py-4 bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-xl rounded-2xl font-bold shadow-lg hover:from-orange-500 hover:to-yellow-500 transition-all"
        >
          {t("learning_plan.welcome.submit")}
        </button>
      </div>
    </div>
  );
};

export default Welcome;