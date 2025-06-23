import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const LoadingContent = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-12 h-12 animate-spin text-orange-400 mb-4" />
      <div className="w-full max-w-xs bg-gray-100 rounded-full h-3 mb-4">
        <div
          className="bg-orange-400 h-3 rounded-full transition-all"
          style={{ width: "80%" }}
        />
      </div>
      <p className="text-gray-600 mb-2">{t("learning_plan.loading")}</p>
      <div className="bg-yellow-50 rounded-lg p-4 mt-4 text-center text-sm text-gray-700">
        <b>💡 Korean Culture Bite:</b>
        <br />
        "In Korea, it is polite to hand over items to elders with both hands."
      </div>
    </div>
  );
};

export default LoadingContent;