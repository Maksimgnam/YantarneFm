'use client';
import React, { useEffect, useState } from 'react';
import './AdminBlog.scss';
import { useStore } from '@/store/store';

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openEditPopup, openAddPopup,  openDeletePopup} = useStore()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/api/blogs`)
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blogs:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main className='admin-blog'>
      <div className='admin-blog-header'>
        <h2><span>Б</span>лог</h2>
        <button className='add-btn' onClick={openAddPopup}>Додати публікацію</button>
      </div>

      <div className="admin-blog-card-container">
        {loading ? (
          <p>Завантаження...</p>
        ) : blogs.length === 0 ? (
          <p>Публікацій немає</p>
        ) : (
          blogs.map(blog => (
            <div key={blog._id} className="admin-blog-card">
              <img src={blog.image || '/back.png'} alt={blog.title} />
              <div className="admin-blog-card-block">
                <h1>{blog.title}</h1>
                <p>{blog.description}</p>
                <div className="btn-container">
                <button className="edit-btn"  onClick={() => openEditPopup(blog)}>Редагувати</button>
                <button className="delete-btn" onClick={()=>openDeletePopup(blog)}>Видалити</button>
              </div>
              </div>
            
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default AdminBlog;
