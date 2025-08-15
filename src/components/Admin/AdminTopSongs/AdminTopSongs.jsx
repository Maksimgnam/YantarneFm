import React from 'react'
import './AdminTopSongs.scss'
import AdminTopSongCard from './AdminTopSongCard/AdminTopSongCard'
const AdminTopSongs = () => {
  return (
    <main className='admin-topsongs'>
      <h2><span>ТОП</span> Пісень</h2>
        <AdminTopSongCard/>
    </main>
  )
}

export default AdminTopSongs