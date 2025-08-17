'use client'
import React, { useState } from 'react';
import './AdminHomePageBackPopup.scss';
import { useStore } from '@/store/store';

const AdminHomePageBackPopup = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const { closeBackPopup } = useStore();

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    if (!file) return alert("Please select an image");
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/back-image`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      console.log("Updated:", data.backgroundImage);

      localStorage.setItem("backgroundImage", data.backgroundImage);

      closeBackPopup();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="admin-homepage-back-popup-container">
      <div className="admin-homepage-back-popup">
        <div className="header">
          <button onClick={closeBackPopup} className="close-btn">×</button>
        </div>

        <div className="upload-section">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="imageUpload"
            style={{ display: 'none' }}
          />

          <label htmlFor="imageUpload" className="upload-icon">
            {!preview ? (
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
            ) : (
              <img src={preview} alt="Uploaded Preview" />
            )}
          </label>
        </div>

        <button className="save-btn" onClick={handleSave}>Зберегти</button>
      </div>
    </main>
  );
};

export default AdminHomePageBackPopup;
