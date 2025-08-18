'use client';
import React, { useState, useEffect } from 'react';
import './EditPopup.scss'
import { useStore } from '@/store/store';

const EditPopup = ({ blog }) => {
  const { closeEditPopup} = useStore();
  const [title, setTitle] = useState(blog?.title || '');
  const [description, setDescription] = useState(blog?.description || '');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setDescription(blog.description);
    }
  }, [blog]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (file) formData.append('image', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/blogs/${blog._id}`, {
        method: 'PUT',
        body: formData
      });

      if (res.ok) {
        console.log('Blog updated');
        closeEditPopup();
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        console.error('Error updating blog');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className='container'>
      <div className="edit-popup">
        <div className='edit-popup-header'>
          <h2>Редагувати {blog?.title}</h2>
          <button className='close-btn' onClick={closeEditPopup}>x</button>
        </div>
        <div className="edit-popup-container">
     
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
          <div className='edit-popup-info'>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button onClick={handleSave}>Зберегти</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditPopup;
