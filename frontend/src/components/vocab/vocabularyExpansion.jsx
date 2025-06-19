import React, { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { getLanguageName } from '../../utils/getLanguageName';
import VocabTabs from "./func/Tabs";
import { normalizeVocabData } from "./func/parse";
import VocabHeader from './VocabHeader';
import VocabStoreModal from './func/StoreModal';

const VocabularyExpansion = ({ user_id }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("info");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState(""); // Thông báo lưu
  const [showVocabStore, setShowVocabStore] = useState(false); // Hiện kho từ vựng
  const [settings, setSettings] = useState({
    model_provider: "openai",
    model_id: "gpt-4o-mini",
    temperature: 0.7,
  });

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setSaved(false);
    setSaveMessage("");
    try {
      const res = await fetch("/api/vocab-expansion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          model_provider: settings.model_provider,
          model_id: settings.model_id,
          temperature: settings.temperature,
          user_word: input.trim(),
          language: getLanguageName() || "Vietnamese",
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Không thể tra cứu từ vựng");
      setResult(normalizeVocabData(json.data.vocab_expansion));
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!result) return;
    setSaved(true);
    setSaveMessage("");
    try {
      const res = await fetch("/api/vocab-expansion/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          user_word: result.word || input,
          xml_response: JSON.stringify(result),
        }),
      });
      if (!res.ok) throw new Error("Lưu thất bại");
      setSaveMessage("✅ Đã lưu vào từ vựng của bạn!");
    } catch (err) {
      setSaved(false);
      setSaveMessage("❌ Lưu thất bại, vui lòng thử lại.");
    }
  };

  return (
    <>
      <VocabHeader onOpenVocabStore={() => setShowVocabStore(true)} />
      <VocabStoreModal
        user_id={user_id}
        open={showVocabStore}
        onClose={() => setShowVocabStore(false)}
      />
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8 mb-8">
        <h2 className="text-2xl font-bold text-orange-500 mb-4 flex items-center gap-2">
          <span>AI Vocabulary Expansion</span>
        </h2>
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="Nhập từ vựng tiếng Hàn hoặc tiếng Anh..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            disabled={loading}
          />
          <button
            className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:from-orange-500 hover:to-yellow-500 transition"
            onClick={handleSearch}
            disabled={loading}
          >
            <Search className="w-5 h-5" />
            Tra cứu
          </button>
        </div>
        {loading && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="w-10 h-10 animate-spin text-orange-400 mb-2" />
            <div className="text-gray-500">Đang tra cứu từ vựng...</div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-4">{error}</div>
        )}
        {saveMessage && (
          <div
            className={`mb-4 rounded-lg p-3 text-sm ${
              saveMessage.startsWith("✅")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {saveMessage}
          </div>
        )}
        {result && (
          <VocabTabs
            tab={tab}
            setTab={setTab}
            result={result}
            saved={saved}
            handleSave={handleSave}
          />
        )}
        {!result && !loading && (
          <div className="bg-blue-50 rounded-lg p-4 mt-4 text-center text-sm text-blue-700">
            Nhập một từ vựng để tra cứu ý nghĩa, ví dụ, đồng nghĩa, trái nghĩa, nguồn gốc, biểu đạt liên quan...
          </div>
        )}
      </div>
    </>
  );
};

export default VocabularyExpansion;