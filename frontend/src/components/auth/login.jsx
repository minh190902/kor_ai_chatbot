import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

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
      onLogin(data.user_id);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center min-w-[320px]"
      >
        <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mb-4 shadow">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Đăng nhập AI Chat</h2>
        <p className="text-gray-500 mb-6 text-center text-sm">Nhập tên của bạn để bắt đầu trò chuyện với AI Korean Tutor</p>
        <input
          type="text"
          placeholder="Nhập tên của bạn"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border border-orange-200 px-4 py-3 rounded-xl w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white py-3 rounded-xl font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Login;