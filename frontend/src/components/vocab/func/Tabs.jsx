import React from "react";
import VocabInfo from "./Info";
import VocabSynonyms from "./Synonyms";
import VocabAntonyms from "./Antonyms";
import VocabExamples from "./Examples";
import VocabEtymology from "./Etymology";
import VocabRelated from "./Related";
import { Save } from "lucide-react";

export const TABS = [
  { key: "info", label: "Thông tin" },
  { key: "synonyms", label: "Từ đồng nghĩa" },
  { key: "examples", label: "Ví dụ" },
  { key: "antonyms", label: "Từ trái nghĩa" },
  { key: "etymology", label: "Nguồn gốc" },
  { key: "related", label: "Biểu đạt liên quan" },
];

const VocabTabs = ({ tab, setTab, result, saved, handleSave }) => (
  <>
    <div className="flex gap-2 mb-4">
      {TABS.map(t => (
        <button
          key={t.key}
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            tab === t.key
              ? "bg-orange-100 text-orange-600"
              : "bg-gray-100 text-gray-500 hover:bg-orange-50"
          }`}
          onClick={() => setTab(t.key)}
        >
          {t.label}
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
        {saved ? "Đã lưu vào từ vựng của tôi" : "Lưu vào từ vựng của tôi"}
      </button>
    </div>
  </>
);

export default VocabTabs;