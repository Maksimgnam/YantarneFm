"use client";
import React, {useState, useEffect} from 'react'
import './News.scss'
import Image from 'next/image'

const News = () => {

  const [news, setNews] = useState({text: "Завантаження..", url: "Завантаження..."});

  const fetchNews = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/getVideoPage`);
      if (!response.ok) {
        console.log("Responce is not ok :(")
        return;
      } else {
        const data = await response.json();
        let url = data[0].url;
        let text = data[0].text;
        setNews({text, url});
      }
    } catch (error) {
      console.log("Error during fetching videoPage news:", error);
      return;
    }
  }

  useEffect(()=>{
    fetchNews()
  }, [])

  useEffect(()=>{
    console.log(news)
  }, [news])

  return (
    <main id='news' className='news'>
      <h2 className='title'><span>{news.text.slice(0, 1)}</span>{news.text.slice(1)}</h2>
      <div className='line'></div>
      <iframe
        className='news-video'
        src={`https://www.youtube.com/embed/${news.url.slice(17)}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <div className="news-footer">
      
        <div className='news-footer-card'>
          <div className='news-footer-card-block'>
            <Image src={'/support/coffee.webp'} width={40} height={40} alt='' />
          </div>
          <h2 className='text-center'>Будемо вдячні  за <br /> підтримку 😊</h2>
          <a href="https://buymeacoffee.com/yantarne.fm" target='_blank'>
            <button>Підтримати</button>
          </a>
         
        </div>
      </div>
    </main>
  )
}

export default News
