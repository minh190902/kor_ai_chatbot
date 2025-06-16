import { useEffect, useState } from "react";
import axios from "axios";

export default function useLearningPlans(userId) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios.get(`/api/learning-plan?user_id=${userId}`)
      .then(res => setPlans(res.data))
      .finally(() => setLoading(false));
  }, [userId]);

  return { plans, loading };
}