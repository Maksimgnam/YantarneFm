'use client'
import React from 'react';
import './Ads.scss';
import Image from 'next/image';

const Ads = () => {
  const adsOptions = [
    {
      platform: "Telegram",
      title: "📢 Реклама у Telegram-каналі",
      features: [
        "📲 Пост про твій бізнес — стильна подача та реальні охоплення на 5000 підписників",
        "🔷 Ідеально для брендів, івентів, сервісів та онлайн-магазинів",
        "✨ Стильна подача, реальні охоплення, зацікавлена аудиторія"
      ],
      image: "/ads/telegram.png"
    },
    {
      platform: "Instagram",
      title: "📸 Реклама у Instagram",
      features: [
        "🎯 5 000+ активних підписників",
        "📲 Сторіс про твій бізнес",
        "🔷 Ідеально для локальних брендів, івентів, сервісів та онлайн-магазинів",
        "✨ Стильна подача, реальні охоплення, зацікавлена аудиторія"
      ],
      image: "/ads/insta.webp"
    },
    {
      platform: "Facebook",
      title: "📘 Реклама у Facebook",
      features: [
        "🎯 Доступ до понад 6 000+ активних підписників",
        "📣 Розміщення постів про ваш бізнес, івенти або послуги",
        "🔷 Ідеально для локальних брендів, сервісів та онлайн-магазинів",
        "✨ Ефективна подача і реальні охоплення"
      ],
      image: "/ads/facebook.webp"
    },
    {
      platform: "Website",
      title: "🌐 Реклама на Сайті",
      features: [
        "🎯 Демонструйте вашу рекламу онлайн перед понад 20 000 активних відвідувачів щомісяця",
        "📣 Показ реклами у вигляді банерів, текстових оголошень на сайті",
        "🔷 Ідеально для локальних брендів, сервісів, подій та онлайн-магазинів",
        "✨ Висока видимість та зацікавлена аудиторія"
      ],
      image: "/ads/site.webp"
    }
  ];

  return (
    <main className='ads'>
      <h1 className="title">
        <span>Р</span>еклама на Yantarne.<span>FM</span>
      </h1>
      <div className='line'></div>
      <div className="ads-center-card animate-pulse">
          <Image src={'/about/sound.webp'} width={170} height={170} alt='sound'/>
          <p className='pt-3'>Реклама в прямому ефірі</p>
        </div>
      <div className='ads__container'>
     
        {adsOptions.map((item, index) => (
          <div key={index} className='ads-card'>
            <Image className='ads-card-img' src={item.image} width={110} height={110} alt='card_img'/>
            <h2>{item.title}</h2>
            <p>
              {item.features.map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < item.features.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
            <div className="ads-card-line"></div>
          </div>
        ))}

        <div className="ads-center-circle animate-pulse">
          <Image src={'/about/sound.webp'} width={170} height={170} alt='sound'/>
          <p className='pt-3'>Реклама в прямому ефірі</p>
        </div>
      </div>
    </main>
  )
}

export default Ads;
