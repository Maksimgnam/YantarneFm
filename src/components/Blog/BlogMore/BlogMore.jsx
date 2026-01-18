'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import './BlogMore.scss';
import Header from '@/components/Header/Header';

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
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="loader">
        <p>Завантаження...</p>
      </div>
    );

  if (!blog)
    return (
      <div className="loader">
        <p>Блог не знайдено</p>
      </div>
    );

  return (
    <main className="blog-more">
    {/* <header className="blog-header">
      <Link href="/" className="back-btn">← Назад</Link>
    </header> */}
    <Header/>
  
    <section className="blog-container">
      <img src={blog.image || "/back.png"} alt={blog.title} />
  
      <article className="blog-more-text">
        <h1>{blog.title}</h1>
        <p>{blog.description}</p>
      </article>
    </section>
  </main>
  
  );
};

export default BlogMore;
