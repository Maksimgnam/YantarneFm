import Link from 'next/link'
import React from 'react'

const Auth = () => {
  return (
    <main className='w-full h-svh flex items-center justify-center'>
        <Link href='/admin'>
            <button className='w-56 text-white h-14 bg-[#8FBF5B] font-semibold rounded-lg text-xl cursor-pointer m-2 ml-0 mr-0 flex items-center justify-center'>Auth</button>
        </Link>
    </main>
  )
}

export default Auth