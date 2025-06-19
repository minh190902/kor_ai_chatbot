import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, onInvalidUser }) => {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id || user?.user_id;
    if (!user || !userId) {
      setValid(false);
      setChecking(false);
      if (onInvalidUser) onInvalidUser();
      return;
    }
    fetch(`/api/user/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data && (data.success || data.id || data.user_id)) setValid(true);
        else throw new Error();
      })
      .catch(() => {
        localStorage.removeItem('user');
        setValid(false);
        if (onInvalidUser) onInvalidUser();
      })
      .finally(() => setChecking(false));
  }, [onInvalidUser]);

  if (checking) {
    return <div>Đang kiểm tra đăng nhập...</div>;
  }

  if (!valid) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;