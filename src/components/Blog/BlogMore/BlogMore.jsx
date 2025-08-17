'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import './BlogMore.scss';

const BlogMore = () => {
  const { id } = useParams(); 
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/api/blogs/${id}`)
      .then(res => res.json())
      .then(data => {
        setBlog(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blog:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Завантаження...</p>;
  if (!blog) return <p>Блог не знайдено</p>;

  return (
    <main className='blog-more'>
        <div className="blog-header">
        <Link href={'/home'}>
          <button>{'<'}</button>
        </Link>
   
        <div className='menu'>
          <div className="menu-line"></div>
          <div className="menu-line"></div>
          <div className="menu-line"></div>
        </div>

      </div>
      <img src={blog.image || "/back.png"} alt="" />
      <div className='blog-more-text'>
        <h1>{blog.title}</h1>
        <p>{blog.description}</p>
      </div>
    </main>
  );
};

export default BlogMore;
