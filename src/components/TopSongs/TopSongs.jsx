'use client';
import React, { useEffect, useState, useCallback } from 'react';
import './TopSongs.scss';
import TopSongCard from './TopSongCard/TopSongCard';

const AdminTopSongs = () => {
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
      setSongs([]); // ensure empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  return (
    <main id='topsongs' className='topsongs'>
      <h2><span>ТОП</span> Пісень</h2>
      <div className="line"></div>

      {loading ? (
        <div className='loader'>
          <p>Завантаження...</p>
        </div>
      ) : songs.length ? (
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
        ))
      ) : (
        <div className='loader'>
          <p>Пісень немає</p>
        </div>
      )}
    </main>
  );
};

export default AdminTopSongs;
