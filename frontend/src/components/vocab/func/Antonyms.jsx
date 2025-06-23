import { useTranslation } from "react-i18next";

const VocabAntonyms = ({ antonyms }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="font-bold mb-2">{t("vocab.tabs.antonyms")}</div>
      <ul className="list-disc ml-6">
        {(Array.isArray(antonyms) ? antonyms : []).map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>
    </div>
  );
};

export default VocabAntonyms;