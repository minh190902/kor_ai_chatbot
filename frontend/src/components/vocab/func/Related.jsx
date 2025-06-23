import { useTranslation } from "react-i18next";

const VocabRelated = ({ related }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="font-bold mb-2">{t("vocab.tabs.related")}</div>
      <ul className="list-disc ml-6">
        {(Array.isArray(related) ? related : []).map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>
    </div>
  );
};

export default VocabRelated;