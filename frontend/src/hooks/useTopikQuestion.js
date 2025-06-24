import { useEffect, useState } from "react";
import { fetchTopikQuestionTypes } from "../services/api";

export default function useTopikQuestionTypes() {
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem("topik_question_types");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // always fetch data on mount
  useEffect(() => {
    if (!data) {
      setLoading(true);
      setError("");
      fetchTopikQuestionTypes()
        .then(res => {
          setData(res);
          localStorage.setItem("topik_question_types", JSON.stringify(res));
        })
        .catch(err => setError(err.message || "Không thể tải dữ liệu"))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, []);

  // Hàm load thủ công nếu muốn gọi lại
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchTopikQuestionTypes();
      setData(res);
      localStorage.setItem("topik_question_types", JSON.stringify(res));
    } catch (err) {
      setError(err.message || "Không thể tải dữ liệu");
    }
    setLoading(false);
  };

  return { data, loading, error, load };
}