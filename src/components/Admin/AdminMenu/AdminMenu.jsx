'use client';
import React from 'react';
import './AdminMenu.scss';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const AdminMenu = () => {
  const pathname = usePathname();
  const menuItems = [
    { href: '/admin', icon: '/admin/home.webp', size: 25, label: 'Головна сторінка' },
    { href: '/admin/timetable', icon: '/admin/timetable.webp', size: 30, label: 'Розклад' },
    { href: '/admin/topsongs', icon: '/admin/top.webp', size: 30, label: 'ТОП Пісень' },
    { href: '/admin/blog', icon: '/admin/blog.webp', size: 30, label: 'Блог' }
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
            <Link key={item.href} className='w-full' href={item.href}>
              <button className={pathname === item.href ? 'active' : ''}>
                <Image src={item.icon} width={item.size} height={item.size} alt="" />
                <p>{item.label}</p>
              </button>
            </Link>
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