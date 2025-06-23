import VocabInfo from "./Info";
import VocabSynonyms from "./Synonyms";
import VocabAntonyms from "./Antonyms";
import VocabExamples from "./Examples";
import VocabEtymology from "./Etymology";
import VocabRelated from "./Related";

import { useTranslation } from "react-i18next";
import { Save } from "lucide-react";

const VocabTabs = ({ tab, setTab, result, saved, handleSave }) => {
  const { t } = useTranslation();
  const TABS_LOCAL = [
    { key: "info", label: t("vocab.tabs.info") },
    { key: "synonyms", label: t("vocab.tabs.synonyms") },
    { key: "examples", label: t("vocab.tabs.examples") },
    { key: "antonyms", label: t("vocab.tabs.antonyms") },
    { key: "etymology", label: t("vocab.tabs.etymology") },
    { key: "related", label: t("vocab.tabs.related") },
  ];
  return (
    <>
      <div className="flex gap-2 mb-4">
        {TABS_LOCAL.map(tabs => (
          <button
            key={tabs.key}
            className={`px-4 py-2 rounded-t-lg font-semibold ${
              tab === tabs.key
                ? "bg-orange-100 text-orange-600"
                : "bg-gray-100 text-gray-500 hover:bg-orange-50"
            }`}
            onClick={() => setTab(tabs.key)}
          >
            {tabs.label}
          </button>
        ))}
      </div>
      <div className="bg-gray-50 rounded-b-lg p-4 min-h-[80px]">
        {tab === "info" && <VocabInfo result={result} />}
        {tab === "synonyms" && <VocabSynonyms synonyms={result.synonyms} />}
        {tab === "examples" && <VocabExamples examples={result.examples} />}
        {tab === "antonyms" && <VocabAntonyms antonyms={result.antonyms} />}
        {tab === "etymology" && <VocabEtymology etymology={result.etymology} />}
        {tab === "related" && <VocabRelated related={result.related} />}
      </div>
      <div className="flex justify-end mt-4">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
            saved
              ? "bg-green-100 text-green-700"
              : "bg-gradient-to-r from-orange-400 to-yellow-400 text-white hover:from-orange-500 hover:to-yellow-500"
          }`}
          onClick={handleSave}
          disabled={saved}
        >
          <Save className="w-5 h-5" />
          {saved ? t("vocab.saved") : t("vocab.save")}
        </button>
      </div>
    </>
  );
};

export default VocabTabs;