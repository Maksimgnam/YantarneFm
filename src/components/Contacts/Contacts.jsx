'use client';
import React, { useState } from 'react';
import './Contacts.scss';
import Image from 'next/image';

const Contacts = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = `Нове повідомлення від користувача\n\nІм'я: ${name}\nПовідомлення: ${message}`;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: '1608433214', text }),
      });

      if (res.ok) {
        alert('Повідомлення надіслано ✅');
        setName('');
        setMessage('');
      } else {
        alert('Помилка при надсиланні ❌');
      }
    } catch (error) {
      console.error(error);
      alert('Сталася помилка під час запиту ❌');
    }
  };

  return (
    <main id="contacts" className="contacts">
      <h1 className="title">
        <span>К</span>онтакти
      </h1>

      <div className="line" />

      <div className="contacts__container">

        <div className="contacts-form">
          <h2>
            Надіслати <span>повідомлення</span>
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Введіть своє ім’я"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <textarea
              placeholder="Введіть повідомлення"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <button type="submit">Надіслати</button>
          </form>
        </div>


        <div className="contacts-image">
          <img src="/contacts/back.webp" alt="Contact background" />

          <div className="contacts-info-overlay">
            <div></div>

            <div>
              <p>
                <strong>
                  <span>Є</span>мейл:
                </strong>{' '}
                yantarne.fm@gmail.com
              </p>

              <p>
                <strong>
                  <span>С</span>тудія:
                </strong>{' '}
                +380982008688
              </p>

              <p>
                <strong>
                  <span>Р</span>еклама:
                </strong>{' '}
                +380683020555
              </p>
            </div>


            <div className="contacts-info-overlay-socials">
              <a
                href="https://www.instagram.com/yantarne.fm/"
                target="_blank"
                rel="noopener noreferrer"
                className="contacts-info-overlay-social"
                aria-label="Instagram"
              >
                <Image src="/contacts/instagram.webp" width={50} height={50} alt="Instagram icon" />
              </a>

              <a
                href="https://www.facebook.com/yantarne.fm"
                target="_blank"
                rel="noopener noreferrer"
                className="contacts-info-overlay-social"
                aria-label="Facebook"
              >
                <Image src="/contacts/facebook.webp" width={50} height={50} alt="Facebook icon" />
              </a>

              <a
                href="https://www.youtube.com/channel/UCTaO-GLI_0srISh-Ase5NZw"
                target="_blank"
                rel="noopener noreferrer"
                className="contacts-info-overlay-social"
                aria-label="YouTube"
              >
                <Image src="/contacts/youtube.webp" width={50} height={50} alt="YouTube icon" />
              </a>

              <a
                href="https://soundcloud.com/andriy-yantarne"
                target="_blank"
                rel="noopener noreferrer"
                className="contacts-info-overlay-social"
                aria-label="SoundCloud"
              >
                <Image src="/contacts/soundcloud.webp" width={50} height={50} alt="SoundCloud icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contacts;
