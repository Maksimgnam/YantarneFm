import React from "react";
import "./About.scss";
import Image from "next/image";

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

      {/* Section 1 */}
      <section className="about__container">
        <article className="about_block">
          <Image
            src="/about/micro.webp"
            width={40}
            height={40}
            alt="Іконка мікрофона"
          />
          <h2 className="about_block-h2">Все почалось у 2021 році!</h2>
        </article>

        <p>
          Один творчий чоловік на імʼя Андрій Стасишин зібрав команду
          ентузіастів і заснував перше онлайн радіо рідного міста Новояворівська
          — Yantarne.FM!
        </p>
      </section>

      {/* Section 2 */}
      <section className="about__container second">
        <article className="about_block-two">
 
            <img className="e" src="/about/sound.webp" alt="Звук" />
      

          <div className="about_block-two-text">
            <p>
              З початком повномасштабного вторгнення отримали дозвіл від
              Армії.FM та Національної ради теле- та радіозвʼязку на тимчасове
              мовлення на частоті 88.9! Щиро дякуємо Армії.FM та Національній
              раді за довіру!
            </p>
          </div>
        </article>
      </section>

      {/* Cards */}
      <section className="about-card_container">
        {cards.map((card, index) => (
          <article key={index} className="about-card">
            <figure>
              <img src={card.image} alt={card.title.join(" ")} />
            </figure>

            <h3 className="text-center mt-3">
              {card.title.map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < card.title.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h3>
          </article>
        ))}
      </section>
    </main>
  );
};

export default About;
