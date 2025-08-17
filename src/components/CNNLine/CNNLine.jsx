'use client'
import React from "react";
import { useState, useEffect } from "react";

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
    ? Array(20).fill(cnnTexts.map(item => item.text).join(' • ')).join(' ')
    : "Loading CNN texts... • ";

  return (
    <main className="w-full h-10 bg-red-600 overflow-hidden relative">
      <div className="cnn-text">
      {displayText}
      </div>
    </main>
  );
};

export default CNNLine;
