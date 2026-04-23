"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import "./Timetable.scss";

export default function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [popupEvent, setPopupEvent] = useState(null);
  const [currentTimePx, setCurrentTimePx] = useState(null);
  const [isSchedule, setIsSchedule] = useState(true)
  const toggleSchedule = () => {
    setIsSchedule(prev => !prev);
  };

  const TIME_COL_WIDTH = 70;
  const HEADER_HEIGHT = 44;
  const HOUR_START = 8;
  const HOUR_END = 23;
  const HOUR_HEIGHT = 200; // Велика висота години для деталізації
  const TOTAL_HOURS = HOUR_END - HOUR_START;
  const MINUTE_PX = HOUR_HEIGHT / 60;

  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => HOUR_START + i);
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

  // --- ЛОГІКА ---
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const processEvents = (events) => {
    // Тільки сортуємо, нічого не видаляємо
    return events.sort((a, b) => {
      return timeToMinutes(a.start_time) - timeToMinutes(b.start_time);
    });
  };
  // --------------

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/timetable/events`);
        if (!response.ok) throw new Error("API error");

        const data = await response.json();
        const rawEvents = data.length ? data : getDefaultEvents();
        
        setTimetable(processEvents(rawEvents));
      } catch (err) {
        console.warn("Помилка завантаження, використані тестові дані", err);
        setError("Не вдалося завантажити розклад");
        setTimetable(processEvents(getDefaultEvents()));
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  const getDefaultEvents = () => [
    { title: "Ранкове шоу", start_time: "8:00", end_time: "12:00", days: [0, 1, 2, 3, 4], color: "#E65E5E" },
    { title: "Вечірній драйв", start_time: "20:00", end_time: "23:00", days: [0, 1, 2, 3, 4, 5, 6], color: "#6FA9F5" },
    // Короткі події для тесту "гарного відображення":
    { title: "Новини", start_time: "12:00", end_time: "12:10", days: [0, 1, 2, 3, 4], color: "#57ff6eff" },
    { title: "Погода", start_time: "12:15", end_time: "12:25", days: [0, 1, 2, 3, 4], color: "#FFA500" },
    { title: "Реклама", start_time: "12:30", end_time: "12:45", days: [0, 1, 2, 3, 4], color: "#D3D3D3" },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const minutesSinceStart = (now.getHours() - HOUR_START) * 60 + now.getMinutes();
      setCurrentTimePx(minutesSinceStart >= 0 && minutesSinceStart <= TOTAL_HOURS * 60 ? minutesSinceStart * MINUTE_PX : null);
    };
    updateTime();
    const interval = setInterval(updateTime, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const parseHM = (str) => str.split(":").map(Number);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  
  const getPositionPx = (start, end) => {
    const [sh, sm] = parseHM(start);
    const [eh, em] = parseHM(end);
    const startMin = (sh - HOUR_START) * 60 + sm;
    const endMin = (eh - HOUR_START) * 60 + em;
    
    const top = clamp(startMin, 0, TOTAL_HOURS * 60) * MINUTE_PX;
    // Мінімальна висота 20px, щоб блок не зникав, якщо тривалість 0 хв
    const height = Math.max(20, clamp(endMin, 0, TOTAL_HOURS * 60) * MINUTE_PX - top);
    
    return { top, height };
  };

  const isEventOnDay = (ev, dayIndex) => {
    if (ev.date) {
      const d = new Date(ev.date);
      if (!isNaN(d)) {
        d.setHours(0, 0, 0, 0);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        if (d < today) return false;
        return dayIndex === (d.getDay() === 0 ? 6 : d.getDay() - 1);
      }
    }
    return ev.days?.includes(dayIndex);
  };

  const goToPreviousDay = () => setCurrentDayIndex(prev => (prev === 0 ? 6 : prev - 1));
  const goToNextDay = () => setCurrentDayIndex(prev => (prev === 6 ? 0 : prev + 1));
  const showEventPopup = (event) => { setPopupEvent(event); document.body.style.overflow = "hidden"; };
  const closePopup = () => { setPopupEvent(null); document.body.style.overflow = ""; };

  return (


    <main id="timetable" className="timetable" onClick={popupEvent ? closePopup : undefined}>
        <div className="header">
        <div className="w-full h-auto flex md:flex-row flex-col items-center md:justify-between justify-center">
        <div className="title"><span>Р</span>озклад</div>
        <div className="line"></div>
        <button      className={`toggle-schedule-btn${!isSchedule ? " hidden" : ""}`} onClick={toggleSchedule}>
  {isSchedule ? "Сховати" : "Показати"}
</button>
        </div>
        {
  isSchedule && (
    <>
       {isMobile && (
          <div className="mobile-day-selector">
            <button onClick={goToPreviousDay} className="day-nav-btn prev-day">❮</button>
            <div className="current-day">{days[currentDayIndex]}</div>
            <button onClick={goToNextDay} className="day-nav-btn next-day">❯</button>
          </div>
        )}
    </>
  )
}
</div> 


     
{isSchedule ?   <>
      <div
        className="schedule"
        style={{
          padding: isMobile ? "0 10px 0 40px" : "0 40px",
          "--time-col-width": `${TIME_COL_WIDTH}px`,
          "--header-height": `${HEADER_HEIGHT}px`,
          "--hour-height": `${HOUR_HEIGHT}px`,
          "--hours": TOTAL_HOURS
        }}
      >
        <div className="schedule-grid">
          <div className="time-col-header" />
          {isMobile ? <div className="day-col-header">{days[currentDayIndex]}</div> :
            days.map((d, i) => <div key={i} className="day-col-header">{d}</div>)
          }

          <div className="time-col">{hours.map(h => <div key={h} className="time-cell">{String(h).padStart(2, "0")}:00</div>)}</div>

          {(isMobile ? [currentDayIndex] : [...Array(7).keys()]).map(dayIndex => (
            <div key={dayIndex} className="day-col" style={{ minHeight: `calc(var(--hour-height) * var(--hours))` }}>
              {timetable.filter(ev => isEventOnDay(ev, dayIndex)).map((ev, idx) => {
                const { top, height } = getPositionPx(ev.start_time, ev.end_time);
                
                // Якщо висота блоку менше 50px, вмикаємо режим "short-mode"
                const isShortEvent = height < 50;

                return (
                  <div 
                    key={idx} 
                    className={`event ${isShortEvent ? 'short-mode' : ''}`} 
                    style={{ top: `${top}px`, height: `${height}px`, backgroundColor: ev.color }}
                    title={`${ev.title} — ${ev.start_time}–${ev.end_time}`}
                    onClick={e => { e.stopPropagation(); showEventPopup(ev); }}
                  >
                    <div className="title">{ev.title}</div>
                    <div className="time">{ev.start_time}–{ev.end_time}</div>
                  </div>
                );
              })}
            </div>
          ))}

          <div className="grid-lines" />
          {currentTimePx !== null && <div className="current-time-line" style={{ top: `calc(var(--header-height) + ${currentTimePx}px)` }} />}
        </div>
      </div>

      {popupEvent && (
        <div className="event-popup" onClick={closePopup}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <div className="popup-header" style={{ backgroundColor: popupEvent.color }}>
              <h3>{popupEvent.title}</h3>
              <button className="close-popup" onClick={closePopup}>×</button>
            </div>
            <p className="popup-time"><strong>Час:</strong> {popupEvent.start_time}–{popupEvent.end_time}</p>
            <p className="popup-days"><strong>Дні:</strong> {popupEvent.days ? popupEvent.days.map(d => days[d]).join(', ') : (popupEvent.date ? new Date(popupEvent.date).toLocaleDateString('uk-UA') : 'Не вказано')}</p>
          </div>
        </div>
      )}
            </> : <div className="w-full h-[20vh] md:mt-10  text-center md:text-4xl text-3xl font-medium flex items-center justify-center">Розклад приховано</div>}
    </main>
    

  );
}