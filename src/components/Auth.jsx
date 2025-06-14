import React from 'react';
import Image from 'next/image';

const Auth = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
        <div className='w-72 h-auto mb-4'>
            <h2 className='text-center text-4xl text-[#F94D4D] font-medium m-4 ml-0 mr-0'>Увійти</h2>
            <input type="text" className='w-full h-14 border border-[#F94D4D] rounded-lg pl-2 text-white placeholder:text-white outline-none font-medium m-2 ml-0 mr-0' placeholder='Email'/>
            <input type="text" className='w-full h-14 border border-[#F94D4D] rounded-lg pl-2 text-white placeholder:text-white outline-none font-medium m-2 ml-0 mr-0'  placeholder='Пароль'/>
            <button className='w-72 h-[55px] bg-[#F94D4D] rounded-lg text-xl font-medium cursor-pointer m-2 ml-0 mr-0'>Увійти</button>
            <p className='text-[#F94D4D] text-center font-medium m-4 ml-0 mr-0'>Або</p>
            <button className='w-72 h-[55px] bg-[#F94D4D] rounded-xl text-xl font-medium cursor-pointer m-2 ml-0 mr-0 flex items-center justify-center'>
               <p className='pr-2'>Увійти за  </p>           <Image  src={'/telegram.png'} width={30} height={30} alt=''/> </button>

        </div>
    </div>
  )
}

export default Auth