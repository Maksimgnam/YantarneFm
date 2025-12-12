import Image from 'next/image';
import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="w-full bg-[#252525]">
      <div className="w-full h-1 bg-[#CC0100]" />

      <div className="w-full flex flex-col justify-center items-center p-12">
        <Image src="/logo.webp" width={200} height={200} alt="Logo" />

        <p className="text-center font-semibold m-5">
          <span className="text-[#CC0100]">Якщо</span> у вас є новина, якою хочете поділитися — надсилайте нам.
          <br />
          Якщо ви хочете стати частинкою команди або маєте класні ідеї — пишіть нам.
          <br />
          Якщо у вас виникли запитання стосовно реклами та співпраці — телефонуйте!
        </p>

        <div className="w-96 h-1.5 bg-[#CC0100] rounded-2xl my-10" />

        <p className="text-3xl text-center font-semibold">
          <span className="text-[#CC0100]">©</span> 2025 Усі права захищені
        </p>
      </div>
    </footer>
  );
};

export default Footer;
