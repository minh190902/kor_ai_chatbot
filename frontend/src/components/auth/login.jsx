import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if (data.user_id) {
        // localStorage.setItem('user_id', data.user_id);
        // // Nếu backend trả về session_id, lưu luôn
        // if (data.session_id) {
        // localStorage.setItem('session_id', data.session_id);
        // }
        onLogin(data.user_id);
    }
    };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>
        <input
          type="text"
          placeholder="Nhập tên của bạn"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Login;