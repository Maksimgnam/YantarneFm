import Image from 'next/image';
import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer>
      <div className="top-line" />

      <div className="footer-content">
        <Image src="/logo.webp" width={200} height={200} alt="Logo" />

        <p>
          <span>Якщо</span> у вас є новина, якою хочете поділитися — надсилайте нам.
          <br />
          Якщо ви хочете стати частинкою команди або маєте класні ідеї — пишіть нам.
          <br />
          Якщо у вас виникли запитання стосовно реклами та співпраці — телефонуйте!
        </p>

        <div className="separator" />

        <p className="copyright">
          <span>©</span> 2025 Усі права захищені
        </p>
      </div>
    </footer>
  );
};

export default Footer;
