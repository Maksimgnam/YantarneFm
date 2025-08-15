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

const Admin = () => {
  const { isCNNPopupOpen,   isBackPopupOpen,} = useStore();
  return (
    <main className='admin'>
      <AdminHomePage/>
      {
        isBackPopupOpen &&  <AdminHomePageBackPopup/>
      }
      {
        isCNNPopupOpen &&  <AdminHomePageCnnPopup/> 
      }
 




    </main>
  )
}

export default Admin