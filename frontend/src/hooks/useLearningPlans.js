import { useEffect, useState } from "react";
import axios from "axios";

export default function useLearningPlans(userId) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios.get(`/api/learning-plan?user_id=${userId}`)
      .then(res => {
        // Nếu backend trả về { success, data }
        if (Array.isArray(res.data)) {
          setPlans(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setPlans(res.data.data);
        } else {
          setPlans([]);
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { plans, loading };
}