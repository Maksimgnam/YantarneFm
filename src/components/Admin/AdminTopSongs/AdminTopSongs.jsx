'use client';
import React, { useEffect, useState, useCallback } from 'react';
import './AdminTopSongs.scss';
import AdminTopSongCard from './AdminTopSongCard/AdminTopSongCard';
import AdminTopSongsPopup from '../AdminTopSongsPopup/AdminTopSongsPopup';
import { useStore } from '@/store/store';

const AdminTopSongs = () => {
  const { isTopSongPopupOpen } = useStore();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/top-songs`);
      if (!res.ok) throw new Error('Failed to fetch songs');
      const data = await res.json();
      setSongs(data.songs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSongs();

    const interval = setInterval(() => {
      fetchSongs();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchSongs]);



  return (
    <main className='admin-topsongs'>
      <h2><span>ТОП</span> Пісень</h2>
      {songs.map((song, idx) => (
        <AdminTopSongCard
          key={song._id}
          index={idx + 1}
          title={song.title}
          artist={song.artist}
          image={song.image}
          audio={song.audio}
          refreshSongs={fetchSongs} 
          id={song._id}
        />
      ))}
      {isTopSongPopupOpen && (
        <AdminTopSongsPopup refreshSongs={fetchSongs} />
      )}
    </main>
  );
};

export default AdminTopSongs;
