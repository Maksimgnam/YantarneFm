"use client";

import React, { useEffect, useState } from 'react';
import './Account.scss'

const Account = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userId = getCookie('userId'); 
      if (!userId) {
        setError('User ID not found in cookies');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`);
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();
        console.log(data);
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  const handleLikeAudio = async () => {
    if (!user) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addSong`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nameAudio: 'Aaron Smith feat. Luvli - Dancin Krono Remix.mp3',
          userId: user.id
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
          <p><strong>Names:</strong> {user.firstName}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <button
            onClick={handleLikeAudio}
            className='w-[300px] text-white h-[72px] bg-[#CC0100] font-bold rounded-lg text-xl cursor-pointer m-2 ml-0 mr-0 flex items-center justify-center'
          >
            Like Audio
          </button>
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default Account;
