import React from 'react';
import './About.scss'
import Image from 'next/image';
const About = () => {
  const cards = [
    { title: ["Підтримка молодих", "талантів"], image: '/about/star.webp' },
    { title: ["Професійна", "студія"], image: '/about/bigmicro.webp' },
    { title: ["Якісна українська", "музика"], image: '/about/music.webp' }
  ]
  return (
    <main className='about'>
      <h1 className="title"> <span>Х</span>то ми?</h1>
      <div className='line'></div>
      <div className="about__container">
        <div className='about_block'>
         <Image src={'/about/micro.webp'} width={40} height={40} alt=''/>
          <h2 className='about_block-h2'>Все почалось у 2021 році! </h2>
        </div>
        <p>Один творчий чоловік на імʼя Андрій Стасишин зібрав команду ентузіастів і заснував перше онлайн радіо рідного міста Новояворівська Yantarne.FM!</p>
      </div>

      <div className="about__container second">
 
        <div className='about_block-two'>
         {/* <Image src={'/about/sound.webp'}  width={300} height={300} alt=''/> */}
         <img src="/about/sound.webp" alt="" />
         <div className='about_block-two-text'>
          <p>З початком повномасштабного вторгнення, отримали дозвіл від Армії.FM та Національної ради теле- та радіозвʼязку на тимчасове мовлення на частоті 88.9! Щиро дякуємо Армії.FM та Національній раді за довіру!</p>
         </div>

        </div>
      </div>

      <div className='about-card_container'>
      {cards.map((item, index) => (
        <div key={index} className='about-card'>
          <img src={item.image} alt="" />
            <p>
              {item.title.map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < item.title.length - 1 && <br />}
                  </React.Fragment>
                ))}
            </p>
          </div>
        ))}
      </div>

    </main>
  )
}

export default About