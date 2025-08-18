'use client'
import React from 'react'
import AdminHomePageBackPopup from './AdminHomePageBackPopup/AdminHomePageBackPopup';
import AdminHomePageCnnPopup from './AdminHomePageCnnPopup/AdminHomePageCnnPopup';
import { useStore } from '@/store/store'
import AdminHomePage from './AdminHomePage/AdminHomePage';

const Admin = () => {
  const { isCNNPopupOpen, isBackPopupOpen } = useStore();
  return (
    <div className='w-full h-svh '>
    <AdminHomePage/>

          {
          isBackPopupOpen &&  <AdminHomePageBackPopup/>
        }
        {
          isCNNPopupOpen &&  <AdminHomePageCnnPopup/> 
        }
    </div>
  )
}

export default Admin