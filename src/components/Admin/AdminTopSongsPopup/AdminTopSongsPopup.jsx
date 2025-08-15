'use client';
import React, { useState, useEffect } from 'react';
import './AdminTopSongsPopup.scss';
import { useStore } from '@/store/store';

const AdminTopSongsPopup = () => {
  const { isTopSongPopupOpen, selectedSongId, selectedSongIndex, closeTopSongPopup } = useStore();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audio, setAudio] = useState('');

  useEffect(() => {
    if (selectedSongId) {
      fetch(`/api/top-songs/${selectedSongId}`)
        .then(res => res.json())
        .then(data => {
          setTitle(data.title || '');
          setArtist(data.artist || '');
          setAudio(data.audio || '');
        })
        .catch(err => console.error(err));
    }
  }, [selectedSongId]);

  const handleSave = async () => {
    if (!selectedSongId) return;

    try {
      const res = await fetch(`http://localhost:2000/api/top-songs/${selectedSongId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, artist, audio })
      });
      const updated = await res.json();
      console.log('Updated song:', updated);
      closeTopSongPopup();
    } catch (err) {
      console.error('Error updating song:', err);
    }
  };

  if (!isTopSongPopupOpen) return null;

  return (
    <main className='admin-topsongs-popup-container'>
      <div className="admin-topsongs-popup">
        <div className="header">
          <h2>Пісня  <span className='text-[#CC0100]'>#{selectedSongIndex}</span></h2>
          <button className='close' onClick={closeTopSongPopup}>x</button>
        </div>
        <input 
          type="text" 
          placeholder="Назва" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Виконавець" 
          value={artist} 
          onChange={e => setArtist(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Аудіо URL" 
          value={audio} 
          onChange={e => setAudio(e.target.value)} 
        />
        <button className='save' onClick={handleSave}>Зберегти</button>
      </div>
    </main>
  );
};

export default AdminTopSongsPopup;
