'use client';

import React, { useEffect, useState } from 'react';
import './CNNLine.scss';

const CNNLine = () => {
  const [cnnTexts, setCnnTexts] = useState([]);

  useEffect(() => {
    const fetchCnnTexts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/cnn-texts`);
        if (!res.ok) throw new Error('Failed to fetch CNN texts');
        const data = await res.json();
        setCnnTexts(data.cnnTexts || []);
      } catch {}
    };

    fetchCnnTexts();
  }, []);

  const items = cnnTexts.length
    ? cnnTexts.map(item => item.text).join(' • ')
    : [
        "Нова частота 97.6 FM",
        "Yantarne FM",
        "Фестивалі",
        "Новини",
        "Музика без перерв"
      ].join(' • ');

  return (
    <section className="cnn">
      <div className="cnn__track">
        <div className="cnn__text">{items} • {items}</div>
      </div>
    </section>
  );
};

export default CNNLine;
