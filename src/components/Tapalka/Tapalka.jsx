'use client'
import React, { useState } from 'react';
import './Tapalka.scss';

const Tapalka = () => {
  const [tap, setTap] = useState(0);

  return (
    <main className="w-full h-svh flex flex-col items-center justify-center gap-4">
      {/* <h1 className="text-4xl font-bold">{tap}</h1>
      
      <div className="flex gap-3">
        <button 
          onClick={() => setTap(tap + 1)} 
          className="px-4 py-2 bg-green-500 cursor-pointer text-white rounded-xl hover:bg-green-600 transition"
        >
          +
        </button>
      </div> */}
    </main>
  );
};

export default Tapalka;
