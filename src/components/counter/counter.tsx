'use client';

import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">计数器</h2>
      <div className="flex items-center gap-6">
        <button
          onClick={() => setCount(count - 1)}
          className="w-12 h-12 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
        >
          -
        </button>
        <div className="min-w-[80px] text-center">
          <span className="text-4xl font-bold text-gray-700">{count}</span>
        </div>
        <button
          onClick={() => setCount(count + 1)}
          className="w-12 h-12 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;
