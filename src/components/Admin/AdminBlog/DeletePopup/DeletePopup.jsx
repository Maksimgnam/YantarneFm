import React from 'react'
import './DeletePopup.scss';
import { useStore } from '@/store/store';

const DeletePopup = ({ blog }) => {
  const { closeDeletePopup } = useStore();

  const handleDelete = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/blogs/${blog._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        console.log('Blog deleted');
        closeDeletePopup();
      } else {
        console.error('Error deleting blog');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className='container'>
      <div className="delete-popup">
        <div className="delete-popup-buttons">
          <button className="edit-btn" onClick={closeDeletePopup}>Скасувати</button>
          <button className="delete-btn" onClick={handleDelete}>Видалити</button>
        </div>
      </div>
    </main>
  );
}

export default DeletePopup;
