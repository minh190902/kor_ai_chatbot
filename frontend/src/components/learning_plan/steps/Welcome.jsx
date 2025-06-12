import React from "react";

const Welcome = ({ onStart, onBackHome }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <h1 className="text-3xl font-bold text-orange-500 mb-4 text-center font-sans">
      🌸 Welcome to AI Learning Plan 🌸
    </h1>
    <p className="text-gray-700 text-lg text-center mb-8">
      Ready to create your personalized Korean learning journey?<br />
      Let's get started!
    </p>
    <div className="flex gap-4">
      <button
        onClick={onStart}
        className="px-8 py-4 bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-xl rounded-2xl font-bold shadow-lg hover:from-orange-500 hover:to-yellow-500 transition-all"
      >
        Start Creating Plan
      </button>
      <button
        onClick={onBackHome}
        className="px-6 py-4 bg-gray-100 text-orange-500 text-lg rounded-2xl font-bold shadow hover:bg-gray-200 transition-all"
      >
        ← AI Home
      </button>
    </div>
  </div>
);

export default Welcome;