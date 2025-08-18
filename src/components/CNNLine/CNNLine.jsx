'use client'
import React, { useState, useEffect } from "react";

const CNNLine = () => {
  const [cnnTexts, setCnnTexts] = useState([]);

  useEffect(() => {
    const fetchCnnTexts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/cnn-texts`);
        if (!res.ok) throw new Error('Failed to fetch CNN texts');
        const data = await res.json();
        setCnnTexts(data.cnnTexts || []);
      } catch (err) {
        console.error('Error loading CNN texts:', err);
      }
    };

    fetchCnnTexts();
  }, []);

  const displayText = cnnTexts.length
    ? Array(30).fill(cnnTexts.map(item => item.text).join(' • ')).join(' ')
    : Array(50).fill("Yantarne FM").join(" • ");

  return (
    <main className="w-full h-10 bg-red-600 overflow-hidden relative flex items-center">
      <div className="cnn-text whitespace-nowrap text-white text-lg f">
        {displayText}
      </div>
    </main>
  );
};

export default CNNLine;
