'use client';

import React from 'react';
import './Ads.scss';
import Image from 'next/image';
import { FaTelegramPlane, FaMicrophone, FaHandshake, FaLightbulb } from 'react-icons/fa';
import { BsFillMicFill, BsHandThumbsUp, BsLightbulbFill } from 'react-icons/bs';
import { MdOutlineRssFeed } from 'react-icons/md';

const Ads = () => {
  const adsOptions = [
    {
      title: 'Реклама в соціальних мережах',
      icon: <MdOutlineRssFeed />,
      features: [
        'Просуваємо ваш бізнес там, де нас читають і дивляться щодня',
        'Формати:',
        '• пост у Telegram',
        '• пост у Facebook',
        '• Instagram Stories',
        'Підходить для акцій, подій, новинок, відкриттів та спецпропозицій',
      ],
    },
    {
      title: 'Блокова реклама в ефірі',
      icon: <BsFillMicFill />,
      features: [
        'Класичні рекламні ролики в ефірі радіо Yantarne.FM',
        'Ваша реклама звучить у визначені години',
        'Регулярно та чітко доносить інформацію до слухачів нашої громади',
      ],
    },
    {
      title: 'Інформаційна реклама від ведучих',
      icon: <FaMicrophone />,
      features: [
        'Реклама у форматі живої рекомендації від ведучих в ефірі',
        'Звучить природно, довірливо',
        'Особливо ефективно у ранковому шоу - як особиста порада, а не стандартний ролик',
      ],
    },
    {
      title: 'Партнерство з радіо',
      icon: <FaHandshake />,
      features: [
        'Станьте офіційним партнером наших програм та проєктів',
        'Можливі формати:',
        '• партнер погоди',
        '• партнер точної години',
        '• партнер спеціальних рубрик чи проєктів',
        'Це довготривала присутність вашого бренду в ефірі та асоціація з контентом, який люблять слухачі',
      ],
    },
    {
      title: 'Індивідуальна співпраця',
      icon: <FaLightbulb />,
      features: [
        'Маєте ідею - ми допоможемо її реалізувати',
        'Відкриті до нестандартних рекламних форматів',
        'Спецпроєктів, інтеграцій та рішень під конкретні цілі вашого бізнесу',
      ],
    },
  ];

  return (
    <main className="ads">
      <h1 className="title">
        <span>Р</span>еклама на Yantarne.<span>FM</span>
      </h1>

      <div className="line" />

      <div className="ads-center-card animate-pulse">
        <Image src="/about/sound.webp" width={50} height={50} alt="sound" className='sound-image' />
        <p className="pt-3">Реклама в прямому ефірі</p>
      </div>

      <section className="ads__container">
        {adsOptions.map((item, index) => (
          <article
            key={index}
            className={`ads-card ${index === 4 ? 'ads-card--full' : ''}`}
          >
            <div className="ads-card-icon">{item.icon}</div>

        
            <h2>{item.title}</h2>

            <p>
              {item.features.map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < item.features.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>

            <div className="ads-card-line" />
          </article>
        ))}
      </section>
    </main>
  );
};

export default Ads;
