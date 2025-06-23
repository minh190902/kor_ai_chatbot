import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

// Hàm parse XML trả về object JS
function parseTopicXML(xmlString) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "text/xml");

  const getText = (tag) => {
    const el = xml.getElementsByTagName(tag)[0];
    if (!el) return "";
    // Nếu có CDATA, lấy nodeValue
    if (el.childNodes.length && el.childNodes[0].nodeType === 4) {
      return el.childNodes[0].nodeValue;
    }
    return el.textContent || "";
  };

  // Metadata
  const metadata = {};
  ["level", "type", "subtype", "topic", "skill", "field"].forEach((k) => {
    metadata[k] = getText(k);
  });

  const passage = getText("passage");
  const question = getText("question");

  // Choices
  const choiceNodes = xml.getElementsByTagName("choice");
  const choices = [];
  for (let i = 0; i < choiceNodes.length; i++) {
    let text = "";
    if (
      choiceNodes[i].childNodes.length &&
      choiceNodes[i].childNodes[0].nodeType === 4
    ) {
      text = choiceNodes[i].childNodes[0].nodeValue;
    } else {
      text = choiceNodes[i].textContent;
    }
    choices.push({
      id: choiceNodes[i].getAttribute("id"),
      text,
    });
  }

  // Answer
  const answerId = getText("id");
  const rationale = getText("rationale");
  const distractorNodes = xml.getElementsByTagName("item");
  const wrong = [];
  for (let i = 0; i < distractorNodes.length; i++) {
    let reason = "";
    if (
      distractorNodes[i].childNodes.length &&
      distractorNodes[i].childNodes[0].nodeType === 4
    ) {
      reason = distractorNodes[i].childNodes[0].nodeValue;
    } else {
      reason = distractorNodes[i].textContent;
    }
    wrong.push({
      id: distractorNodes[i].getAttribute("choice_id"),
      reason,
    });
  }

  return {
    info: metadata,
    passage,
    question,
    choices,
    answer: answerId,
    explanation: rationale,
    wrong,
  };
}

const LEVELS = [
  { label: "초급", value: "초급" },
  { label: "중급", value: "중급" },
  { label: "고급", value: "고급" },
];

const TYPES = [
  "Grammar & Vocabulary",
  "Detail Comprehension",
  "Main Idea Comprehension",
  "Logical Inference & Structure",
];

const SUBTYPES = {
  "Grammar & Vocabulary": [
    {
      label: "Choose the correct grammar/vocabulary for the blank",
      value: "Choose the correct grammar/vocabulary for the blank",
      applicable_levels: ["초급", "중급", "고급"],
    },
    {
      label: "Choose the expression with the same meaning as the underlined part",
      value: "Choose the expression with the same meaning as the underlined part",
      applicable_levels: ["고급"],
    },
  ],
  "Detail Comprehension": [
    {
      label: "Choose the statement that matches the content",
      value: "Choose the statement that matches the content",
      applicable_levels: ["초급", "중급", "고급"],
    },
    {
      label: "Understand information from notices/diagrams",
      value: "Understand information from notices/diagrams",
      applicable_levels: ["초급", "중급", "고급"],
    },
  ],
  "Main Idea Comprehension": [
    {
      label: "Identify the main idea",
      value: "Identify the main idea",
      applicable_levels: ["중급", "고급"],
    },
    {
      label: "Choose the topic/title of the passage",
      value: "Choose the topic/title of the passage",
      applicable_levels: ["중급", "고급"],
    },
    {
      label: "Understand the meaning of a newspaper headline",
      value: "Understand the meaning of a newspaper headline",
      applicable_levels: ["고급"],
    },
  ],
  "Logical Inference & Structure": [
    {
      label: "Arrange sentences in logical order",
      value: "Arrange sentences in logical order",
      applicable_levels: ["중급", "고급"],
    },
    {
      label: "Find the correct position for a sentence",
      value: "Find the correct position for a sentence",
      applicable_levels: ["중급", "고급"],
    },
    {
      label: "Infer the content to go inside the parentheses",
      value: "Infer the content to go inside the parentheses",
      applicable_levels: ["중급", "고급"],
    },
    {
      label: "Identify the writer’s attitude or emotion",
      value: "Identify the writer’s attitude or emotion",
      applicable_levels: ["고급"],
    },
  ],
};

const LANGUAGES = [
  { label: "한국어", value: "Korean" },
  { label: "English", value: "English" },
  { label: "Tiếng Việt", value: "Vietnamese" },
];

const defaultType = TYPES[0];
const defaultSubtype = SUBTYPES[defaultType][0].value;

const TopikGeneration = ({ user_id }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    level: "중급",
    type: defaultType,
    subtype: defaultSubtype,
    topic: "",
    language: "Korean",
  });
  const [result, setResult] = useState(null);
  const [xmlResult, setXmlResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTypeChange = (e) => {
    const type = e.target.value;
    const firstSubtype = SUBTYPES[type].find(st => st.applicable_levels.includes(filters.level)).value;
    setFilters(f => ({
      ...f,
      type,
      subtype: firstSubtype,
    }));
  };

  const handleSubtypeChange = (e) => {
    setFilters(f => ({
      ...f,
      subtype: e.target.value,
    }));
  };

  const handleFilter = (key, value) => {
    let newFilters = { ...filters, [key]: value };
    if (key === "level") {
      const validSubtypes = SUBTYPES[filters.type].filter(st => st.applicable_levels.includes(value));
      if (!validSubtypes.find(st => st.value === filters.subtype)) {
        newFilters.subtype = validSubtypes[0]?.value || "";
      }
    }
    setFilters(newFilters);
  };

  const handleTopicChange = (e) => {
    let value = e.target.value;
    if (value.length > 12) value = value.slice(0, 12);
    setFilters(f => ({
      ...f,
      topic: value,
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setXmlResult(null);
    try {
      const payload = {
        user_id: user_id || "demo_user",
        level: filters.level,
        type: filters.type,
        subtype: filters.subtype,
        topic: filters.topic,
        language: filters.language,
      };
      const res = await fetch("/api/topik/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Không thể tạo câu hỏi");
      // Nếu trả về dạng XML:
      if (json.data && typeof json.data === "string" && json.data.startsWith("<?xml")) {
        setXmlResult(parseTopicXML(json.data));
      } else {
        setResult(json.data);
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    }
    setLoading(false);
  };

  const subtypeOptions = useMemo(() => {
    return SUBTYPES[filters.type].filter(
      st => st.applicable_levels.includes(filters.level)
    );
  }, [filters.type, filters.level]);

  // Render choices cho cả dạng object (xml) và array (json)
  function renderChoices(choices, answer, isXml = false) {
    if (!choices) return null;
    return (
      <div className="space-y-2">
        {choices.map((opt, idx) => {
          const isCorrect = isXml
            ? (opt.id || (idx + 1).toString()) === (answer || "").toString()
            : idx === answer;
          return (
            <div
              key={opt.id || idx}
              className={`p-2 rounded-lg border transition ${
                isCorrect
                  ? "bg-green-100 border-green-400 font-semibold"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {isXml ? opt.text : opt}
            </div>
          );
        })}
      </div>
    );
  }

  // Render wrong analysis cho cả dạng object (xml) và array (json)
  function renderWrong(wrong, choices, isXml = false) {
    if (!wrong) return null;
    return (
      <ul className="list-disc pl-5">
        {wrong.map((w, i) => (
          <li key={w.id || w.option || i} className="mb-1">
            <span className="font-semibold">
              {isXml
                ? choices.find(c => c.id === w.id)?.text
                : choices[w.option]
              }
              :
            </span>{" "}
            {w.reason}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Bộ lọc */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 flex flex-col gap-6 border border-orange-100">
        <div className="flex flex-wrap gap-6">
          {/* Level */}
          <div className="flex flex-col min-w-[140px]">
            <label className="font-semibold mb-2 text-gray-700">난이도</label>
            <select
              className="border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
              value={filters.level}
              onChange={e => handleFilter("level", e.target.value)}
            >
              {LEVELS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          {/* Type */}
          <div className="flex flex-col min-w-[180px]">
            <label className="font-semibold mb-2 text-gray-700">유형</label>
            <select
              className="border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
              value={filters.type}
              onChange={handleTypeChange}
            >
              {TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          {/* Subtype */}
          <div className="flex flex-col min-w-[220px]">
            <label className="font-semibold mb-2 text-gray-700">세부 유형</label>
            <select
              className="border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
              value={filters.subtype}
              onChange={handleSubtypeChange}
            >
              {subtypeOptions.map(st => (
                <option key={st.value} value={st.value}>{st.label}</option>
              ))}
            </select>
          </div>
          {/* Language */}
          <div className="flex flex-col min-w-[120px]">
            <label className="font-semibold mb-2 text-gray-700">언어 선택</label>
            <select
              className="border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
              value={filters.language}
              onChange={e => handleFilter("language", e.target.value)}
            >
              {LANGUAGES.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Topic */}
        <div>
          <label className="font-semibold mb-2 text-gray-700 block">주제 (최대 12자)</label>
          <input
            type="text"
            value={filters.topic}
            onChange={handleTopicChange}
            maxLength={12}
            placeholder="예: 재택근무, 반려동물..."
            className="border border-orange-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
          />
        </div>
        <div>
          <button
            className="mt-2 px-8 py-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-xl shadow font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all disabled:opacity-60"
            onClick={handleGenerate}
            disabled={loading || !filters.topic}
          >
            {loading ? t("common.loading") : "문제 생성"}
          </button>
        </div>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </div>

      {/* Kết quả câu hỏi (JSON hoặc XML) */}
      {(result || xmlResult) && (
        <div className="bg-purple-50 rounded-2xl p-8 shadow-lg mb-8 border border-purple-100">
          {/* Thông tin câu hỏi */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs">{(result?.info?.field || xmlResult?.info?.field) || (result?.info?.type || xmlResult?.info?.type)}</span>
            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs">{(result?.info?.type || xmlResult?.info?.type) || ""}</span>
            <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs">{(result?.info?.level || xmlResult?.info?.level) || ""}</span>
            <span className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-xs">{(result?.info?.topic || xmlResult?.info?.topic) || ""}</span>
            {(result?.info?.skill || xmlResult?.info?.skill) && (
              <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs">{result?.info?.skill || xmlResult?.info?.skill}</span>
            )}
          </div>
          {/* Đoạn văn/đề bài */}
          <div className="mb-4">
            <div className="font-bold mb-1">지문</div>
            <div
              className="bg-white rounded-lg p-4 border border-gray-100"
              dangerouslySetInnerHTML={{
                __html: (result?.passage || xmlResult?.passage || "")
              }}
            />
          </div>
          {/* Câu hỏi */}
          <div className="mb-4">
            <div className="font-bold mb-1">문제</div>
            <div
              className="bg-white rounded-lg p-4 border border-gray-100"
              dangerouslySetInnerHTML={{
                __html: (result?.question || xmlResult?.question || "")
              }}
            />
          </div>
          {/* Đáp án lựa chọn */}
          <div className="mb-4">
            <div className="font-bold mb-1">선택지</div>
            {xmlResult
              ? renderChoices(xmlResult.choices, xmlResult.answer, true)
              : renderChoices(result?.options, result?.answer, false)}
          </div>
          {/* Giải thích đáp án */}
          <div className="mb-4">
            <div className="font-bold mb-1 text-green-700">정답 및 해설</div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              {xmlResult
                ? xmlResult.explanation
                : result?.explanation}
            </div>
          </div>
          {/* Sai lầm thường gặp */}
          <div>
            <div className="font-bold mb-1 text-red-700">오답 해설</div>
            {xmlResult
              ? renderWrong(xmlResult.wrong, xmlResult.choices, true)
              : renderWrong(result?.wrong, result?.options, false)}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopikGeneration;