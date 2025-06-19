import React from "react";

const VocabSynonyms = ({ synonyms }) => (
  <div>
    <div className="font-bold mb-2">Từ đồng nghĩa</div>
    <ul className="list-disc ml-6">
      {(Array.isArray(synonyms) ? synonyms : []).map((w, i) => (
        <li key={i}>{w}</li>
      ))}
    </ul>
  </div>
);

export default VocabSynonyms;