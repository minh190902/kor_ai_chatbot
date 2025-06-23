import { useTranslation } from "react-i18next";

const VocabEtymology = ({ etymology }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="font-bold mb-2">{t("vocab.tabs.etymology")}</div>
      <div className="text-gray-800">{etymology || t("vocab.no_data")}</div>
    </div>
  );
};

export default VocabEtymology;