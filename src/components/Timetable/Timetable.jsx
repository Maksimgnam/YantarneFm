"use client"
import React, { useEffect, useState } from "react";
import "./Timetable.scss";

export default function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1); // Поточний день тижня (0 = Пн, 6 = Нд)
  const [popupEvent, setPopupEvent] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  
  // Завантаження подій з API
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        // Запит до API для отримання подій
        const response = await fetch('http://localhost:2000/api/timetable/events');
        
        // Якщо API недоступне, використовуємо тестові дані
        if (response.ok) {
          // Тестові дані для відображення
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
          setTimetable(defaultEvents);
          console.warn('Використовуються тестові дані розкладу');
        } else {
          // Використовуємо дані з API
          const data = await response.json();
          setTimetable(data);
        }
      } catch (err) {
        console.error('Помилка завантаження розкладу:', err);
        setError('Не вдалося завантажити розклад');
        
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
        setTimetable(defaultEvents);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimetable();
  }, []);

  // Налаштування сітки
  const TIME_COL_WIDTH = 70; // px
  const HEADER_HEIGHT = 44; // px
  const HOUR_START = 8;
  const HOUR_END = 23;
  const HOUR_HEIGHT = 80; // px на годину - збільшено відстань між годинами
  const TOTAL_HOURS = HOUR_END - HOUR_START;
  const MINUTE_PX = HOUR_HEIGHT / 60;

  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => HOUR_START + i);
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

  // позиція поточного часу (в пікселях від початку області годин)
  const [currentTimePx, setCurrentTimePx] = useState(null);
  
  // Check for mobile devices and update on resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const minutesSinceStart = (now.getHours() - HOUR_START) * 60 + now.getMinutes();
      if (minutesSinceStart >= 0 && minutesSinceStart <= TOTAL_HOURS * 60) {
        setCurrentTimePx(minutesSinceStart * MINUTE_PX);
      } else {
        setCurrentTimePx(null);
      }
    };
    update();
    const t = setInterval(update, 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const parseHM = (str) => {
    const [h, m = 0] = str.split(":").map(Number);
    return { h, m };
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // повертає top і height в px (відносно початку області годин)
  const getPositionPx = (start, end) => {
    const s = parseHM(start);
    const e = parseHM(end);
    const startMin = (s.h - HOUR_START) * 60 + s.m;
    const endMin = (e.h - HOUR_START) * 60 + e.m;
    const top = clamp(startMin, 0, TOTAL_HOURS * 60) * MINUTE_PX;
    const height = Math.max(6, clamp(endMin, 0, TOTAL_HOURS * 60) * MINUTE_PX - top);
    return { top, height };
  };

  const getDayIndexFromDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return null;
    const jsDay = d.getDay(); // 0 = Sun ... 6 = Sat
    return jsDay === 0 ? 6 : jsDay - 1; // 0=Mon ... 6=Sun
  };
  
  // Перевірка, чи дата події є актуальною (поточною або майбутньою)
  const isDateRelevant = (dateStr) => {
    if (!dateStr) return true; // Якщо дата не вказана, вважаємо подію регулярною
    
    const eventDate = new Date(dateStr);
    if (isNaN(eventDate)) return true; // Якщо дата некоректна, показуємо подію
    
    // Встановлюємо час на початок дня для коректного порівняння
    eventDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Подія актуальна, якщо її дата >= сьогоднішній
    return eventDate >= today;
  };

  const isEventOnDay = (ev, dayIndex) => {
    // Перевіряємо, чи дата події актуальна
    if (ev.date && !isDateRelevant(ev.date)) return false;
    
    // Перевіряємо, чи подія відображається в цей день тижня
    if (ev.days && ev.days.length) return ev.days.includes(dayIndex);
    if (ev.date) return getDayIndexFromDate(ev.date) === dayIndex;
    return false;
  };

  // Функції для перемикання між днями
  const goToPreviousDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex === 0 ? 6 : prevIndex - 1));
  };

  const goToNextDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex === 6 ? 0 : prevIndex + 1));
  };
  
  // Функція для відображення попапу з інформацією про подію
  const showEventPopup = (event) => {
    setPopupEvent(event);
    // Для повноекранного попапу не потрібно розраховувати позицію
    document.body.style.overflow = 'hidden'; // Блокуємо скролінг основної сторінки
  };
  
  // Закриття попапу
  const closePopup = () => {
    setPopupEvent(null);
    document.body.style.overflow = ''; // Відновлюємо скролінг основної сторінки
  };

  return (
    <div id="timetable" className="timetable" onClick={popupEvent ? closePopup : undefined}>
      <div className="header">
        <div className="title">Розклад</div>
        <div className="line"></div>
        {isMobile && (
          <div className="mobile-day-selector">
            <button onClick={goToPreviousDay} className="day-nav-btn prev-day">❮</button>
            <div className="current-day">{days[currentDayIndex]}</div>
            <button onClick={goToNextDay} className="day-nav-btn next-day">❯</button>
          </div>
        )}
      </div>
    <div
      className="schedule"
      style={{
        padding: isMobile ? "0 10px 0 40px" : "0 40px", // зовнішні відступи, зменшені для мобільних
        // передаємо CSS-змінні
        "--time-col-width": `${TIME_COL_WIDTH}px`,
        "--header-height": `${HEADER_HEIGHT}px`,
        "--hour-height": `${HOUR_HEIGHT}px`,
        "--hours": TOTAL_HOURS
      }}
    >
      <div
        className="schedule-grid"
        /* grid одночасно і для header і для body — тому дні точно над колонками */
      >
        {/* header row (автоматично піде в перший рядок grid) */}
        <div className="time-col-header" />
        {/* На мобільних показуємо тільки поточний день, на десктопі - всі дні */}
        {isMobile ? (
          <div className="day-col-header">{days[currentDayIndex]}</div>
        ) : (
          days.map((d, i) => (
            <div key={i} className="day-col-header">{d}</div>
          ))
        )}

        {/* body: часова колонка (стає в другому рядку, першому стовпчику) */}
        <div className="time-col">
          {hours.map((h) => (
            <div key={h} className="time-cell">{String(h).padStart(2, "0")}:00</div>
          ))}
        </div>

        {/* колонки днів (другий рядок, колонки 2..8) */}
        {isMobile ? (
          // На мобільних показуємо тільки поточний день
          <div
            className="day-col"
            style={{ minHeight: `calc(var(--hour-height) * var(--hours))` }}
          >
            {timetable
              .filter((ev) => isEventOnDay(ev, currentDayIndex))
              .map((ev, idx) => {
                const { top, height } = getPositionPx(ev.start_time, ev.end_time);
                return (
                  <div
                    key={idx}
                    className="event"
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      backgroundColor: ev.color
                    }}
                    title={`${ev.title} — ${ev.start_time}–${ev.end_time}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      showEventPopup(ev);
                    }}
                  >
                    <div className="title">{ev.title}</div>
                    <div className="time">{ev.start_time}–{ev.end_time}</div>
                  </div>
                );
              })}
          </div>
        ) : (
          // На десктопі показуємо всі дні
          days.map((_, dayIndex) => (
            <div
              key={dayIndex}
              className="day-col"
              style={{ minHeight: `calc(var(--hour-height) * var(--hours))` }}
            >
              {timetable
                .filter((ev) => isEventOnDay(ev, dayIndex))
                .map((ev, idx) => {
                  const { top, height } = getPositionPx(ev.start_time, ev.end_time);
                  return (
                    <div
                      key={idx}
                      className="event"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        backgroundColor: ev.color
                      }}
                      title={`${ev.title} — ${ev.start_time}–${ev.end_time}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        showEventPopup(ev);
                      }}
                    >
                      <div className="title">{ev.title}</div>
                      <div className="time">{ev.start_time}–{ev.end_time}</div>
                    </div>
                  );
                })}
            </div>
          ))
        )}

        {/* Шар сітки: горизонтальні лінії через усю ширину (включно з колонкою часу) */}
        <div
          className="grid-lines"
          /* абсолютний шар всередині .schedule-grid, фон — repeating-linear-gradient */
        />

        {/* Оранжева лінія поточного часу (якщо у діапазоні) */}
        {currentTimePx !== null && (
          <div
            className="current-time-line"
            style={{ top: `calc(var(--header-height) + ${currentTimePx}px)` }}
          />
        )}
      </div>
    </div>
    
    {/* Попап з інформацією про подію */}
    {popupEvent && (
      <div 
        className="event-popup"
        onClick={closePopup}
      >
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <div className="popup-header" style={{ backgroundColor: popupEvent.color }}>
            <h3>{popupEvent.title}</h3>
            <button className="close-popup" onClick={closePopup}>×</button>
          </div>
          <p className="popup-time"><strong>Час:</strong> {popupEvent.start_time}–{popupEvent.end_time}</p>
          <p className="popup-days">
            <strong>Дні:</strong> {popupEvent.days ? 
              popupEvent.days.map(d => days[d]).join(', ') : 
              (popupEvent.date ? new Date(popupEvent.date).toLocaleDateString('uk-UA') : 'Не вказано')}
          </p>
        </div>
      </div>
    )}
    </div>
  );
}
