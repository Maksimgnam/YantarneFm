import React from 'react';
import './Team.scss';


const Team = () => {
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
      <div className="team__container">
        {scrollingMembers.map((member, index) => (
          <div className="team-card" key={index}>
            <img src={member.image} alt={member.name} className="team-image" />
            <div className="team-info">
              <h3 className="team-name">{member.name}</h3>
              <p className="team-position">{member.position}</p>
              <div className='team-social'>
              <a
                href={member.instagram}
                className="team-instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className='team-btn' >
                  <img className='bg-cover'  src="/team/insta.webp" alt="" />
                </button>
         
              </a>
              </div>
            
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Team;
