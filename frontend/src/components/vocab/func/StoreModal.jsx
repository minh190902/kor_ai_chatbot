import React, { useState } from "react";
import VocabTabs from "./Tabs";

const VocabStoreModal = ({ user_id, open, onClose }) => {
  const [vocabs, setVocabs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("info");
  const [hovered, setHovered] = useState(null);
  const [loading, setLoading] = useState(false);

  // Hàm lấy danh sách vocab
  const fetchVocabs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vocab-expansion/list?user_id=${user_id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
      const json = await res.json();
      setVocabs(json.data || []);
    } catch {
      setVocabs([]);
    }
    setLoading(false);
  };

  // Khi mở modal thì fetch vocab (chỉ fetch khi open chuyển từ false sang true)
  React.useEffect(() => {
    if (open) {
      fetchVocabs();
      setSelected(null);
      setTab("info");
    }
    // eslint-disable-next-line
  }, [open, user_id]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full relative">
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-orange-500 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-orange-500 flex items-center gap-2">
          Kho từ vựng của tôi
          <button
            onClick={fetchVocabs}
            className="ml-2 px-2 py-1 text-xs rounded bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
            title="Làm mới danh sách"
          >
            Làm mới
          </button>
        </h2>
        {loading ? (
          <div className="text-center text-orange-500 py-8">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vocabs.map((vocab, idx) => (
              <div
                key={vocab.vocab_id || idx}
                className={`
                  group relative p-4 rounded-lg shadow cursor-pointer
                  bg-orange-50
                  border-2 transition-all duration-200
                  ${selected && selected.vocab_id === vocab.vocab_id
                    ? "border-orange-600 scale-110 ring-4 ring-orange-100 z-20 shadow-xl"
                    : hovered === vocab.vocab_id
                      ? "border-orange-400 scale-105 shadow-lg z-10 bg-orange-100"
                      : "border-transparent hover:border-orange-300 hover:scale-105 hover:shadow-lg"
                  }
                `}
                onMouseEnter={() => setHovered(vocab.vocab_id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(vocab)}
                tabIndex={0}
                aria-label={vocab.user_word}
              >
                <div className="font-bold text-orange-700 text-lg flex items-center gap-2">
                  {vocab.user_word}
                  {idx === 0 && (
                    <span className="ml-2 bg-green-200 text-green-800 text-xs px-2 py-0.5 rounded-full animate-pulse">
                      Mới
                    </span>
                  )}
                </div>
                {hovered === vocab.vocab_id && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max max-w-xs bg-white border border-orange-200 shadow-lg rounded px-3 py-2 text-sm text-gray-700 z-30 pointer-events-none">
                    {(JSON.parse(vocab.xml_response)?.definitions?.[0]?.value) || "Không có mô tả"}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {selected && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4 shadow-lg animate-fade-in">
            <VocabTabs
              tab={tab}
              setTab={setTab}
              result={JSON.parse(selected.xml_response)}
              saved={true}
              handleSave={() => {}}
            />
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: none;}
        }
        .animate-fade-in {
          animation: fade-in 0.25s;
        }
      `}</style>
    </div>
  );
};

export default VocabStoreModal;