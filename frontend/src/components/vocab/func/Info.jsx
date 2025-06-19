import React from "react";

const VocabInfo = ({ result }) => (
  <div>
    <div className="mb-2 flex flex-wrap items-center gap-4">
      <span className="text-xl font-bold text-orange-600">{result.word}</span>
      {result.pronunciation && (
        <span className="text-gray-500 italic">/{result.pronunciation}/</span>
      )}
      {result.level && (
        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
          {result.level}
        </span>
      )}
      {result.type && (
        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">
          {result.type}
        </span>
      )}
    </div>
    <div className="mb-2">
      <span className="font-bold">Định nghĩa:</span>
      <ul className="ml-4 mt-1">
        {(Array.isArray(result.definitions) ? result.definitions : []).map((def, i) => (
          <li key={i} className="mb-1">
            <span className="text-gray-800">
              {def.lang === "ko" ? "🇰🇷" : def.lang === "en" ? "🇬🇧" : ""}{" "}
              {def.value || def}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default VocabInfo;