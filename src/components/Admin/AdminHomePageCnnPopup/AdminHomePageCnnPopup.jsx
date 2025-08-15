'use client'
import React, { useEffect, useState } from 'react';
import './AdminHomePageCnnPopup.scss';
import { useStore } from '@/store/store';

const AdminHomePageCnnPopup = () => {
  const { closeCNNPopup } = useStore();
  const [cnnTexts, setCnnTexts] = useState([]);
  const [newText, setNewText] = useState('');

  // Load all texts
  useEffect(() => {
    fetch('http://localhost:2000/api/cnn-texts')
      .then(res => res.json())
      .then(data => setCnnTexts(data.cnnTexts || []))
      .catch(err => console.error(err));
  }, []);

  // Add text
  const handleAddText = async () => {
    if (!newText.trim()) return;
    if (cnnTexts.length >= 5) {
      alert('Максимум 5 текстів');
      return;
    }

    try {
      const res = await fetch('http://localhost:2000/api/cnn-texts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText })
      });
      const updated = await res.json();
      setCnnTexts(updated);
      setNewText('');
    } catch (err) {
      console.error(err);
    }
  };

  // Delete text by id
  const handleDelete = async (id) => {
    try {
      const res = await fetch('http://localhost:2000/api/cnn-texts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const updated = await res.json();
      setCnnTexts(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className='admin-homepage-cnn-popup-container'>
      <div className='admin-homepage-cnn-popup'>
        <div className='header'>
          <h2>Додати рекламу на CNN</h2>
          <button className='close-btn' onClick={closeCNNPopup}>x</button>
        </div>

        <div className='cards-container'>
          {cnnTexts.map(item => (
            <div className="card" key={item.id}>
              <span>{item.text}</span>
              <div className='w-full flex  items-center justify-end pr-3'>
                <button onClick={() => handleDelete(item.id)}>-</button>
              </div>
            </div>
          ))}
        </div>
        <div className='footer'>


        <input
            type="text"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Введіть новий текст"
          />
          <button className='add-btn' onClick={handleAddText}>+</button>
          </div>
      </div>
    </main>
  );
};

export default AdminHomePageCnnPopup;
