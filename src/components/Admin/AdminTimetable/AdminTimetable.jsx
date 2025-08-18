"use client"
import React, { useState, useEffect } from 'react'
import './AdminTimetable.scss'

const AdminTimetable = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    start_time: '',
    end_time: '',
    days: [],
    date: '',
    color: '#6FA9F5'
  });
  
  const [editingId, setEditingId] = useState(null);
  
  // Days of the week for checkboxes
  const daysOfWeek = [
    { value: 0, label: 'Пн' },
    { value: 1, label: 'Вт' },
    { value: 2, label: 'Ср' },
    { value: 3, label: 'Чт' },
    { value: 4, label: 'Пт' },
    { value: 5, label: 'Сб' },
    { value: 6, label: 'Нд' }
  ];
  
  // Fetch all events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Запит до API для отримання подій
      const response = await fetch('http://localhost:2000/api/timetable/events');
      
      if (!response.ok) {
        // Якщо API недоступне, використовуємо тестові дані
        const defaultEvents = [
          {
            title: "Ранкове шоу",
            start_time: "8:00",
            end_time: "12:00",
            days: [0, 1, 2, 3, 4],
            date: null,
            color: "#E65E5E"
          },
          {
            title: "Авторські музичні мікси від DJ StasON!",
            start_time: "20:00",
            end_time: "23:00",
            days: [0, 1, 2, 3, 4, 5, 6],
            date: null,
            color: "#6FA9F5"
          }
        ];
        
        setEvents(defaultEvents);
        console.warn('Використовуються тестові дані розкладу');
      } else {
        // Використовуємо дані з API
        const data = await response.json();
        setEvents(data);
      }
      
      setError(null);
    } catch (err) {
      setError('Помилка завантаження подій: ' + err.message);
      console.error('Помилка завантаження подій:', err);
      
      // Використовуємо тестові дані у випадку помилки
      const defaultEvents = [
        {
          title: "Ранкове шоу",
          start_time: "8:00",
          end_time: "12:00",
          days: [0, 1, 2, 3, 4],
          date: null,
          color: "#E65E5E"
        },
        {
          title: "Авторські музичні мікси від DJ StasON!",
          start_time: "20:00",
          end_time: "23:00",
          days: [0, 1, 2, 3, 4, 5, 6],
          date: null,
          color: "#6FA9F5"
        }
      ];
      
      setEvents(defaultEvents);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle checkbox changes for days
  const handleDayChange = (dayValue) => {
    setFormData(prev => {
      const newDays = prev.days.includes(dayValue)
        ? prev.days.filter(d => d !== dayValue)
        : [...prev.days, dayValue];
      return { ...prev, days: newDays };
    });
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      start_time: '',
      end_time: '',
      days: [],
      date: '',
      color: '#6FA9F5'
    });
    setEditingId(null);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (editingId !== null) {
        // Update existing event
        const eventToUpdate = { ...formData };
        const eventId = editingId._id; 
        
        try {
          const response = await fetch(`http://localhost:2000/api/timetable/events/${eventId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventToUpdate),
          });
          
          if (!response.ok) {
            throw new Error('Не вдалося оновити подію');
          }
        } catch (apiError) {
          console.error('API помилка при оновленні події:', apiError);
          // Продовжуємо з локальним оновленням, якщо API недоступне
        }
        
        // Локальне оновлення стану
        const updatedEvents = events.map(event => 
          event === editingId ? { ...formData } : event
        );
        setEvents(updatedEvents);
      } else {
        // Add new event
        const newEvent = { ...formData };
        
        // Спроба створити подію через API
        try {
          const response = await fetch('http://localhost:2000/api/timetable/events', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEvent),
          });
          
          if (!response.ok) {
            throw new Error('Не вдалося створити подію');
          }
          
          // Отримуємо створену подію з ID від сервера
          const createdEvent = await response.json();
          setEvents([...events, createdEvent]);
        } catch (apiError) {
          console.error('API помилка при створенні події:', apiError);
          // Продовжуємо з локальним створенням, якщо API недоступне
          setEvents([...events, newEvent]);
        }
      }
    } catch (err) {
      setError('Помилка при збереженні події: ' + err.message);
      console.error('Помилка при збереженні події:', err);
    } finally {
      setLoading(false);
      resetForm();
    }
  };
  
  // Edit an event
  const handleEdit = (event) => {
    setEditingId(event);
    setFormData({
      title: event.title,
      start_time: event.start_time,
      end_time: event.end_time,
      days: event.days || [],
      date: event.date || '',
      color: event.color
    });
  };
  
  // Delete an event
  const handleDelete = async (eventToDelete) => {
    try {
      setLoading(true);
      
      // Спроба видалити подію через API, якщо є ID
      if (eventToDelete._id) {
        try {
          const response = await fetch(`http://localhost:2000/api/timetable/events/${eventToDelete._id}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error('Не вдалося видалити подію');
          }
        } catch (apiError) {
          console.error('API помилка при видаленні події:', apiError);
          // Продовжуємо з локальним видаленням, якщо API недоступне
        }
      }
      
      // Локальне видалення зі стану
      setEvents(events.filter(event => event !== eventToDelete));
      setError(null);
    } catch (err) {
      setError('Помилка при видаленні події: ' + err.message);
      console.error('Помилка при видаленні події:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className='admin-timetable'>
      <div className="admin-timetable-container">
        <h1>Управління розкладом</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Завантаження...</div>
        ) : (
          <>
            <h2>Додати нову подію</h2>
            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-group">
                <label htmlFor="title">Назва події:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start_time">Час початку:</label>
                  <input
                    type="time"
                    id="start_time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="end_time">Час закінчення:</label>
                  <input
                    type="time"
                    id="end_time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Дні тижня:</label>
                <div className="days-checkboxes">
                  {daysOfWeek.map(day => (
                    <div key={day.value} className="day-checkbox">
                      <input
                        type="checkbox"
                        id={`day-${day.value}`}
                        checked={formData.days.includes(day.value)}
                        onChange={() => handleDayChange(day.value)}
                      />
                      <label htmlFor={`day-${day.value}`}>{day.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="date">Дата (для одноразової події):</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date || ''}
                  onChange={handleChange}
                />
                <small>Залиште порожнім для регулярних подій</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="color">Колір:</label>
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-buttons">
                <button type="submit" className="btn-save">
                  {editingId !== null ? 'Оновити подію' : 'Додати подію'}
                </button>
                {editingId !== null && (
                  <button type="button" className="btn-cancel" onClick={resetForm}>
                    Скасувати
                  </button>
                )}
              </div>
            </form>
            
            <h2>Існуючі події</h2>
            {events.length === 0 ? (
              <div className="no-events">Немає подій у розкладі</div>
            ) : (
              <div className="events-list">
                {events.map((event, index) => (
                  <div key={index} className="event-item" style={{ borderLeft: `4px solid ${event.color}` }}>
                    <div className="event-details">
                      <h3>{event.title}</h3>
                      <p>
                        <strong>Час:</strong> {event.start_time} - {event.end_time}
                      </p>
                      <p>
                        <strong>Дні:</strong> {event.days && event.days.length > 0 
                          ? event.days.map(d => daysOfWeek.find(day => day.value === d)?.label).join(', ')
                          : 'Немає'}
                      </p>
                      {event.date && (
                        <p><strong>Дата:</strong> {event.date}</p>
                      )}
                    </div>
                    <div className="event-actions">
                      <button onClick={() => handleEdit(event)} className="btn-edit">Редагувати</button>
                      <button onClick={() => handleDelete(event)} className="btn-delete">Видалити</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default AdminTimetable