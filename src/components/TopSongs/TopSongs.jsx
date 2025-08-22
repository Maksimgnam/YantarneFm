'use client';
import React, { useEffect, useState, useCallback } from 'react';
import './TopSongs.scss';
import TopSongCard from './TopSongCard/TopSongCard';
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

  }, []);



  return (
    <main className='topsongs'>
      <h2><span>ТОП</span> Пісень</h2>
      <div className="line"></div>

      {loading ? ( 
          <div className='loader'>
            <p className='text-4xl font-medium'>Завантаження...</p>
          </div>
        ) :
      songs.map((song, idx) => (
        <TopSongCard
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

    </main>
  );
};

export default AdminTopSongs;
