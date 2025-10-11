'use client'
import React, { useEffect, useRef } from 'react';
import './Team.scss';

const Team = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const totalWidth = container.scrollWidth / 2;
    container.style.setProperty('--scroll-width', `${totalWidth}px`);
  }, [])
  const teamMembers = [
        { name: "Андрій Стасишин", position: "Директор та муз. редактор", instagram: "https://www.instagram.com/djstason",  image: "/team/team1.webp"},
        { name: "Софія Труш", position: "Програмний директор, ведуча", instagram: "https://www.instagram.com/_trush_sofia_/",  image: "/team/team2.webp" },
        { name: "Марія Канцелярист", position: "Ведуча новин", instagram: "https://www.instagram.com/kantseliarist/",  image: "/team/team3.webp" },
        { name: "Тарас Федунь", position: "Ведучий", instagram: "https://www.instagram.com/tarasfedun/",  image: "/team/team4.webp" },
        { name: "Юрій Калагурка", position: "Менеджер по рекламі", instagram: "https://www.instagram.com/kalagurkaiurii/", image: "/team/team5.webp" },
      ];
  const scrollingMembers = [...teamMembers, ...teamMembers];

  return (
    <main id='team' className="team">
    <h1 className="team-title"> <span>К</span>оманда</h1>
    <div className='line'></div>
  
    <div className="team__wrapper">
  <div className="team__container">
    <div className="team__track">
      {teamMembers.map((member, index) => (
           <div className="team-card" key={index}>
                       <img src={member.image} alt={member.name} className="team-image" />
                       <div className="team-info">
                        <h2 className="team-name">{member.name}</h2>
                         <p className="team-position">{member.position}</p>
                         <div className='team-social'>
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
      ))}
    </div>
    <div className="team__track">
      {teamMembers.map((member, index) => (
           <div className="team-card" key={index}>
                        <img src={member.image} alt={member.name} className="team-image" />
                        <div className="team-info">
                          <h3 className="team-name">{member.name}</h3>
                          <p className="team-position">{member.position}</p>
                          <div className='team-social'>
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
      ))}
    </div>
  </div>
</div>

  </main>
  
  );
};

export default Team;
