'use client';

import React from 'react';
import './BlogCard.scss';
import Link from 'next/link';

const BlogCard = ({ title, description, image, link }) => {
  return (
    <article className="blog-card">
      <img src={image || "/back.png"} alt={title} />

      <div className="blog-card-block">
        <h2>{title}</h2>
        <p>{description}</p>

        <div className="btn-container">
          <Link href={link} className="link">
            <button>Більше</button>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
