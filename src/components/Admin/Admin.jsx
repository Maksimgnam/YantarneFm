'use client';
import React from 'react';
import './Admin.scss'
import AdminMenu from './AdminMenu/AdminMenu';
import AdminHomePage from './AdminHomePage/AdminHomePage';
import AdminTopSongs from './AdminTopSongs/AdminTopSongs';
import AdminHomePageCnnPopup from './AdminHomePageCnnPopup/AdminHomePageCnnPopup';
import AdminHomePageBackPopup from './AdminHomePageBackPopup/AdminHomePageBackPopup';
import { useStore } from '@/store/store';
import AdminTopSongsPopup from './AdminTopSongsPopup/AdminTopSongsPopup';
import AdminTimetable from './AdminTimetable/AdminTimetable';

const Admin = () => {
  const { isCNNPopupOpen, isBackPopupOpen } = useStore();
  const [activeComponent, setActiveComponent] = React.useState('timetable');
  return (
    <main className='admin'>
      <AdminMenu setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
      <div className='admin-content'>
        {activeComponent === 'home' && <AdminHomePage/>}
        {activeComponent === 'timetable' && <AdminTimetable />}
        {
          isBackPopupOpen &&  <AdminHomePageBackPopup/>
        }
        {
          isCNNPopupOpen &&  <AdminHomePageCnnPopup/> 
        }
      </div>
    </main>
  )
}

export default Admin