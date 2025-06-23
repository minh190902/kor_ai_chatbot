import { useTranslation } from "react-i18next";

const VocabSynonyms = ({ synonyms }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="font-bold mb-2">{t("vocab.tabs.synonyms")}</div>
      <ul className="list-disc ml-6">
        {(Array.isArray(synonyms) ? synonyms : []).map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>
    </div>
  );
};

export default VocabSynonyms;