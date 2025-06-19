import React from "react";

const VocabExamples = ({ examples }) => (
  <div>
    <div className="font-bold mb-2">Ví dụ</div>
    <ul className="space-y-2">
      {(Array.isArray(examples) ? examples : []).map((ex, i) => (
        <li key={i}>
          <div className="font-medium">{ex.ko}</div>
          <div className="text-gray-500">{ex.en}</div>
        </li>
      ))}
    </ul>
  </div>
);

export default VocabExamples;