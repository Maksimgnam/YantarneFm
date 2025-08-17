'use client'
import AddPopup from '@/components/Admin/AdminBlog/AddPopup/AddPopup'
import AdminBlog from '@/components/Admin/AdminBlog/AdminBlog'
import DeletePopup from '@/components/Admin/AdminBlog/DeletePopup/DeletePopup'
import EditPopup from '@/components/Admin/AdminBlog/EditPopup/EditPopup'
import React from 'react'
import { useStore } from '@/store/store'

const page = () => {

  const {isAddPopupOpen, isEditPopupOpen, isDeletePopupOpen,  selectedBlog} = useStore()
  return (
   <main className='w-full h-svh'>
    <AdminBlog/>

    {
      isAddPopupOpen &&     <AddPopup/>
    }
      {
      isEditPopupOpen &&     <EditPopup blog={selectedBlog}/>
    }
      {
      isDeletePopupOpen &&     <DeletePopup blog={selectedBlog}/>
    }
   </main>
  )
}

export default page