import React from "react";

const VocabRelated = ({ related }) => (
  <div>
    <div className="font-bold mb-2">Biểu đạt liên quan</div>
    <ul className="list-disc ml-6">
      {(Array.isArray(related) ? related : []).map((w, i) => (
        <li key={i}>{w}</li>
      ))}
    </ul>
  </div>
);

export default VocabRelated;