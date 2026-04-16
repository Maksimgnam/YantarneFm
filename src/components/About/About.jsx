import React from "react";
import "./About.scss";
import Image from "next/image";
import {
  FiMic,
  FiMusic,
  FiRadio,
  FiUsers,
  FiHeart,
  FiTrendingUp,
  FiMapPin,
} from "react-icons/fi";

const About = () => {
  const cards = [
    { title: ["Підтримка молодих", "талантів"], image: "/about/star.webp" },
    { title: ["Професійна", "студія"], image: "/about/bigmicro.webp" },
    { title: ["Якісна українська", "музика"], image: "/about/music.webp" },
  ];

  return (
    <main id="about" className="about">
      <h1 className="title">
        <span>Х</span>то ми?
      </h1>
      <div className="line" />

      {/* INTRO */}
      <section className="about__container">
        <p>
          <strong>Yantarne.FM</strong> — це сучасне українське радіо
           Новояворівська, створене у
           2021 році командою ентузіастів
          на чолі з <a target="_blank" href="https://www.instagram.com/djstason"  className="accent underline">Андрієм Стасишиним</a>.
        </p>

        <p>
          Почавши як онлайн-радіо, з початком
        повномасштабної війни ми отримали дозвіл на
          тимчасове FM-мовлення на частоті
          <strong> 88.9 FM</strong> за підтримки
          <span className="accent"> Армії.FM</span> та
          <span className="accent">
            {" "}
            Національної ради з питань телебачення і радіомовлення
          </span>.
        </p>
      </section>

      {/* HISTORY */}
      <section className="about__container second">
        <article className="about_block">
          <Image
            src="/about/micro.webp"
            className="about-micro"
            width={40}
            height={40}
            alt="Мікрофон"
          />
          <h2 className="about_block-h2">
            Як ми <span className="accent">розвивалися</span>
          </h2>
        </article>

        <p>
          Відтоді ми працюємо щодня,
          навчаємося, експериментуємо та
    розвиваємося. За короткий час
          <strong> Yantarne.FM</strong> сформувалося як молода,
          сильна команда з амбіціями, чітким баченням і
         любов’ю до свого міста.
        </p>
      </section>

      {/* FEATURES */}


<section className="about__container">
  <h2 className="about_block-h2">
    Що нас <span className="accent">вирізняє</span>
  </h2>

  <div className="about-features">
    <article className="feature-card">
      <FiMic className="feature-icon" />
      <p>Сучасна студія та якісний звук</p>
    </article>

    <article className="feature-card">
      <FiMusic className="feature-icon" />
      <p>Нетиповий плейлист: нове, актуальне, українське</p>
    </article>

    <article className="feature-card">
      <FiRadio className="feature-icon" />
      <p>Живі ефіри та щирі ведучі</p>
    </article>

    <article className="feature-card">
      <FiMapPin className="feature-icon" />
      <p>Локальні новини та важлива інформація для громади</p>
    </article>

    <article className="feature-card">
      <FiHeart className="feature-icon" />
      <p>Власні соціальні та культурні проєкти</p>
    </article>

    <article className="feature-card">
      <FiTrendingUp className="feature-icon" />
      <p>Підтримка молодих виконавців і спілкування з артистами</p>
    </article>

    <article className="feature-card">
      <FiUsers className="feature-icon" />
      <p>Фокус на голос громади</p>
    </article>
  </div>
</section>


      {/* FM */}
      <section className="about__container second">
        <p>
          У грудні 2023 рокуми зробили
          важливий крок — отримали
          <span className="accent"> власну FM-частоту</span>.
        </p>

        <p>
          Сьогодні <strong>Yantarne.FM</strong> мовить на
          <strong> 97.6 FM</strong> — в авто, вдома, на роботі та
     онлайн у будь-якій точці світу.
        </p>

        <p className="about-strong">
          <strong>Yantarne.FM</strong> — це не просто радіо.
          Це радіо, яке
      звучить по-справжньому.
        </p>
      </section>

  
    </main>
  );
};

export default About;
