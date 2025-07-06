'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const PinCode = () => {
  const inputs = useRef([]);
  const router = useRouter();
  const [error, setError] = useState('');

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      if (index < 5) {
        inputs.current[index + 1]?.focus();
      }
    } else {
      e.target.value = '';
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = inputs.current.map(input => input?.value).join('');
  
    if (code.length !== 6) {
      setError('Введіть 6 цифр');
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:2000/api/userByCode/${code}`);
      if (!res.ok) {
        throw new Error('Невірний код');
      }
  
      const userId = await res.json();
  

      localStorage.setItem('userId', userId);
  
      document.cookie = `userId=${userId}; path=/; max-age=${60 * 60 * 24 * 7}`;
  
      router.push('/account');
    } catch (err) {
      setError(err.message || 'Помилка під час перевірки коду');
    }
  };
  

  return (
    <div className='w-full h-svh font-semibold text-center flex flex-col items-center justify-between p-8 bg-[#1e1e1e]'>
      <Image src={'/logo.webp'} width={250} height={200} alt='' className='rounded-3xl' />
      <div className='w-full flex flex-col items-center justify-center'>
        <h2 className='text-[32px] mb-7'>Уведіть ваш пінкод</h2>
        <p className='text-[30px] m-2'>
          Після успішного створення акаунту/входу в акаунт <br /> вам надходить код.
        </p>
        <div className='flex gap-4 m-8'>
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              maxLength={1}
              type='text'
              className='w-[110px] h-[120px] text-5xl border-2 border-[#Cc0100] text-center placeholder:text-[#CC0100] rounded-lg text-black bg-white outline-none'
              placeholder='0'
              ref={el => inputs.current[i] = el}
              onChange={e => handleChange(e, i)}
              onKeyDown={e => handleKeyDown(e, i)}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-lg">{error}</p>}

        <button
          onClick={handleSubmit}
          className='w-[300px] h-[78px] bg-[#CC0100] m-5 rounded-lg text-xl cursor-pointer flex items-center justify-center'
        >
          <p className='text-3xl pr-3'>Ввести код</p>
        </button>
      </div>
      <div></div>
    </div>
  );
};

export default PinCode;

