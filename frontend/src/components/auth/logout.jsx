import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 *
 * @param {Function} onLogout
 * @returns {Function}
 */
const useLogout = (onLogout) => {
  const navigate = useNavigate();

  return useCallback(() => {
    if (onLogout) onLogout();
    navigate('/');
  }, [onLogout, navigate]);
};

export default useLogout;