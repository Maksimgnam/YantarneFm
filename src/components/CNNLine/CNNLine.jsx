// 'use client'
// import React, { useState, useEffect } from "react";

// const CNNLine = () => {
//   const [cnnTexts, setCnnTexts] = useState([]);

//   useEffect(() => {
//     const fetchCnnTexts = async () => {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/cnn-texts`);
//         if (!res.ok) throw new Error('Failed to fetch CNN texts');
//         const data = await res.json();
//         setCnnTexts(data.cnnTexts || []);
//       } catch (err) {
//         console.error('Error loading CNN texts:', err);
//       }
//     };

//     fetchCnnTexts();
//   }, []);

//   const displayText = cnnTexts.length
//     ? Array(10).fill(cnnTexts.map(item => item.text).join(' • ')).join(' ')
//     : Array(30).fill("Yantarne FM").join(" • ");

//   return (
//     <main className="h-10 w-full bg-red-600">
//       <div className="cnn-text">
//         {displayText}
//         {displayText}
//       </div>
//     </main>
//   );
// };

// export default CNNLine;

'use client'
import React, { useEffect, useState } from 'react';

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

  // fallback якщо API порожній
  const items = cnnTexts.length
    ? cnnTexts.map(item => item.text).join(' • ')
    : ["Нова частота 97.6 FM", "Yantarne FM", "Фестивалі", "Новини"];

  // множимо, щоб було багато тексту
  const repeatedItems = Array(1).fill(items).flat();

  return (
    <div className="cnn">
      <div className="cnn__container">
        <div className="cnn__track">
          {repeatedItems.map((text, i) => (
            <span key={i} className="item">{text}</span>
          ))}
        </div>
        <div className="cnn__track">
          {repeatedItems.map((text, i) => (
            <span key={`copy-${i}`} className="item">{text}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CNNLine;
