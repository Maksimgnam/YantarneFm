'use client';
import React from 'react';
import './AdminMenu.scss';
import Link from 'next/link';
import Image from 'next/image';

const AdminMenu = ({ activeComponent, setActiveComponent }) => {
  const menuItems = [
    { id: 'home', icon: '/admin/home.webp', size: 25, label: 'Головна сторінка' },
    { id: 'timetable', icon: '/admin/timetable.webp', size: 30, label: 'Розклад' },
    { id: 'topsongs', icon: '/admin/top.webp', size: 30, label: 'ТОП Пісень' },
    { id: 'blog', icon: '/admin/blog.webp', size: 30, label: 'Блог' }
  ];

  return (
    <div className='admin-menu'>
      <div className='admin-menu-top'>
        <div className="admin-menu-header">
          <button>A</button>
          <h2>Admin</h2>
        </div>
        <div className='line'></div>

        <div className='admin-menu-container'>
          {menuItems.map((item) => (
            <div key={item.id} className='w-full'>
              <button 
                className={activeComponent === item.id ? 'active' : ''}
                onClick={() => setActiveComponent(item.id)}
              >
                <Image src={item.icon} width={item.size} height={item.size} alt="" />
                <p>{item.label}</p>
              </button>
            </div>
          ))}
        </div>
      </div>

      <Link className='w-full' href={'/home'}>
        <button className='logout'>Вийти</button>
      </Link>
    </div>
  );
};

export default AdminMenu;
