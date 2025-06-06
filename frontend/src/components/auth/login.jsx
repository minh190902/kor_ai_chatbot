import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ tên và mật khẩu');
      return;
    }
    try {
      const res = await fetch(`/api/${isRegister ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Đăng nhập thất bại');
        return;
      }
      onLogin(data);
    } catch (err) {
      setError('Lỗi kết nối server');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mb-4 shadow">
          {/* icon */}
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          {isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập AI Chat'}
        </h2>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border border-orange-200 px-4 py-3 rounded-xl w-full mb-3 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-orange-200 px-4 py-3 rounded-xl w-full mb-3 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white py-3 rounded-xl font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isRegister ? 'Đăng ký' : 'Đăng nhập'}
        </button>
        <button
          type="button"
          className="w-full mt-3 text-orange-500 underline text-sm"
          onClick={() => setIsRegister(r => !r)}
        >
          {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
        </button>
      </form>
    </div>
  );
};

export default Login;