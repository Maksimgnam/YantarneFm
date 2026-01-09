'use client';
import React, { useEffect, useRef } from 'react';
import './Team.scss';

const Team = () => {
  const containerRef = useRef(null);

  const teamMembers = [
    { name: "Андрій Стасишин", position: "Музичний редактор та Директор Радіостанції", instagram: "https://www.instagram.com/djstason", image: "/team/team1.webp" },
    { name: "Софія Труш", position: "Ведуча ракового шоу Не спати Програмний Директор", instagram: "https://www.instagram.com/_trush_sofia_/", image: "/team/team2.webp" },
    { name: "Марія Канцелярист", position: "Ведуча новин", instagram: "https://www.instagram.com/kantseliarist/", image: "/team/team3.webp" },
    { name: "Тарас Федунь", position: "Ведучий ранкового шоу Не Спати", instagram: "https://www.instagram.com/tarasfedun/", image: "/team/team4.webp" },
    { name: "Вікторія Дребот", position: "Ведуча Суботнього шоу", instagram: "https://www.instagram.com/vika_drebot/", image: "/team/team5.webp" },
    { name: "Андрій Бакалов", position: "Ведучий Суботнього шоу", instagram: "https://www.instagram.com/andrew.bakalov/", image: "/team/team6.webp" },
    { name: "Дмитро Дида", position: "Ведучий Суботнього шоу", instagram: "https://www.instagram.com/dima_dyda/", image: "/team/team7.webp" },


  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const totalWidth = container.scrollWidth / 2;
    container.style.setProperty('--scroll-width', `${totalWidth}px`);
  }, []);

  const renderTrack = () =>
    teamMembers.map((member, index) => (
      <div className="team-card" key={index}>
        <img src={member.image} alt={member.name} className="team-image" />
        <div className="team-info">
          <h2 className="team-name">{member.name}</h2>
          <p className="team-position">{member.position}</p>
          <div className="team-social">
            <a
              href={member.instagram}
              className="team-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${member.name}`}
            >
              <img src="/team/insta.webp" alt={`Instagram ${member.name}`} />
            </a>
          </div>
        </div>
      </div>
    ));

  return (
    <main id="team" className="team">
      <h1 className="team-title"><span>К</span>оманда</h1>
      <div className="line"></div>

      <div className="team__wrapper">
        <div className="team__container" ref={containerRef}>
          <div className="team__track">{renderTrack()}</div>
          <div className="team__track">{renderTrack()}</div>
        </div>
      </div>
    </main>
  );
};

export default Team;
