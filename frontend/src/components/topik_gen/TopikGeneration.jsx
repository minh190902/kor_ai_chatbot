import React, { useState } from "react";
import { generateTopikQuestion } from "../../services/api";
import { parseTopikXML } from "./parseTopikXML";
import TopikResult from "./TopikResult";
import TopikFilter from "./TopikFilter";

const TopikGeneration = ({ user_id }) => {
  const [filters, setFilters] = useState({
    level: "중급",
    type: "",
    subtype: "",
    topic: "",
    language: "Korean",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const payload = {
        user_id: user_id || "demo_user",
        level: filters.level,
        type: filters.type,
        subtype: filters.subtype,
        topic: filters.topic,
        language: filters.language,
      };
      const xmlString = await generateTopikQuestion(payload);
      const parsed = parseTopikXML(xmlString);
      if (parsed) setResult(parsed);
      else throw new Error("Không thể parse XML response");
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <TopikFilter
        filters={filters}
        setFilters={setFilters}
        loading={loading}
        onGenerate={handleGenerate}
        error={error}
      />
      <TopikResult result={result} />
    </div>
  );
};

export default TopikGeneration;