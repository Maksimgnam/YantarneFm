'use client';

import React, { useEffect, useState } from 'react';
import './Blog.scss';
import Link from 'next/link';
import BlogCard from './BlogCard/BlogCard';
import Header from '../Header/Header';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/api/blogs`)
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="blog">
      <Header/>
      <header className="blog-header">
     

        <div className="flex flex-col items-center justify-center">
          <h2 className="title">
            <span>Y</span>antarne Блог
          </h2>
        </div>

      </header>

      <section className="blog-search">
        <input
          type="text"
          placeholder="Пошук публікації..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </section>

      <section className="blog-card-container">
        {loading ? (
          <div className="loading">
            <p>Завантаження...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="not-found">
            <p>Публікацій не знайдено</p>
          </div>
        ) : (
          filteredBlogs.map(blog => (
            <BlogCard
              key={blog._id}
              title={blog.title}
              description={blog.description}
              image={blog.image}
              link={`/blog/${blog._id}`}
            />
          ))
        )}
      </section>
    </main>
  );
};

export default Blog;
