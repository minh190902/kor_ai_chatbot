import React from "react";

const VocabAntonyms = ({ antonyms }) => (
  <div>
    <div className="font-bold mb-2">Từ trái nghĩa</div>
    <ul className="list-disc ml-6">
      {(Array.isArray(antonyms) ? antonyms : []).map((w, i) => (
        <li key={i}>{w}</li>
      ))}
    </ul>
  </div>
);

export default VocabAntonyms;