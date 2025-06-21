"use client";

import React, { useEffect, useState } from 'react';

const Account = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/1750496674776`);
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUser();
  }, []);

  // 👇 Function to send a POST request to likeAudio
  const handleLikeAudio = async () => {
    if (!user) return;
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addSong`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nameAudio: 'example-audio.mp3', // must match backend expectations
          userId: user.id                 // make sure user.id exists
        })
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
  
      setMessage('Audio liked successfully!');
    } catch (err) {
      setMessage(err.message);
    }
  };
  

  return (
    <div className="w-full h-svh p-4">
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-blue-500">{message}</p>}

      {user ? (
        <div>
          <h1 className="text-xl font-bold">Account Details</h1>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <button
            onClick={handleLikeAudio}
            className='w-[300px] text-white h-[72px] bg-[#CC0100] font-bold rounded-lg text-xl cursor-pointer m-2 ml-0 mr-0 flex items-center justify-center'
          >
            ❤️ Like Audio
          </button>
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default Account;

