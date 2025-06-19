import React from "react";

const VocabEtymology = ({ etymology }) => (
  <div>
    <div className="font-bold mb-2">Nguồn gốc</div>
    <div className="text-gray-800">{etymology || "Không có dữ liệu"}</div>
  </div>
);

export default VocabEtymology;