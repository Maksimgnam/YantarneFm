import React from 'react';
import './BlogCard.scss';
import Link from 'next/link';

const BlogCard = ({ title, description, image, link }) => {
  return (
    <div className='blog-card'>
      <img src={image || "/back.png"} alt="" />
      <div className='blog-card-block'>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className='btn-container'>
          <Link href={link} className='link'>
            <button>Більше</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
