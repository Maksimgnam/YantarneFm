'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './CNNLine.scss';

const CNNLine = () => {
  const [cnnTexts, setCnnTexts] = useState([]);
  const controls = useAnimation();

  useEffect(() => {
    const fetchCnnTexts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/cnn-texts`);
        const data = await res.json();
        setCnnTexts(data.cnnTexts || []);
      } catch (e) {
        console.error(e);
      }
    };

    fetchCnnTexts();
  }, []);

  useEffect(() => {
    controls.start({
      x: ['0%', '-50%'],
      transition: {
        ease: 'linear',
        duration: 20,
        repeat: Infinity,
      },
    });
  }, [controls]);

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
      <motion.div
        className="cnn__track"
        animate={controls}
        onHoverStart={() => controls.stop()}
        onHoverEnd={() => controls.start({
          x: ['0%', '-50%'],
          transition: {
            ease: 'linear',
            duration: 60,
            repeat: Infinity,
          },
        })}
      >
        <div className="cnn__text">{items}</div>
        <div className="cnn__text">{items}</div>
      </motion.div>
    </section>
  );
};

export default CNNLine;