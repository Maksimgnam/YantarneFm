
'use client';
import React, { useState } from 'react';
import './AddPopup.scss'
import { useStore } from '@/store/store';

const AddPopup = () => {
  const { closeAddPopup } = useStore();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!title || !description) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (file) {
      formData.append('image', file);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/blogs`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Blog created:', data);
        closeAddPopup();
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        console.error('Error creating blog');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className='container'>
      <div className="add-popup">
        <div className='add-popup-header'>
          <h2>Додати публікацію</h2>
          <button className='close-btn' onClick={closeAddPopup}>x</button>
        </div>
        <div className="add-popup-container">
        <div className="upload-section">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            id="imageUpload"
            style={{ display: 'none' }}
          />

          <label htmlFor="imageUpload" className="upload-icon">

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="80" height="80" fill="white">
                <path
                  d="M12 16V10M12 10l-3 3m3-3l3 3M20 17a4 4 0 0 0-3-3.87 
                  5 5 0 1 0-9.9-1.32A4 4 0 0 0 4 16H20z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

          </label>
        </div>
          <div className='add-popup-info'>
            <input 
              type="text" 
              placeholder='Назва' 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea 
              placeholder='Опис'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button onClick={handleSubmit}>Зберегти</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddPopup;


