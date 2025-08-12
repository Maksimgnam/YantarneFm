"use client"
import React, { useEffect, useState } from "react";
import "./Timetable.scss";

export default function Timetable() {
  const [timetable] = useState([
    {
      title: "Ранкове шоу",
      start_time: "8:00",
      end_time: "12:00",
      days: [0, 1, 2, 3, 4],
      date: null,
      color: "#E65E5E"
    },
    {
      title: "Інтерв'ю",
      start_time: "13:00",
      end_time: "14:00",
      days: [],
      date: "2025-08-12",
      color: "#4ED97A"
    },
    {
      title: "Авторські музичні мікси від DJ StasON!",
      start_time: "20:00",
      end_time: "23:00",
      days: [0, 1, 2, 3, 4, 5, 6],
      date: null,
      color: "#6FA9F5"
    }
  ]);

  // Налаштування сітки
  const TIME_COL_WIDTH = 70; // px
  const HEADER_HEIGHT = 44; // px
  const HOUR_START = 8;
  const HOUR_END = 23;
  const HOUR_HEIGHT = 60; // px на годину
  const TOTAL_HOURS = HOUR_END - HOUR_START;
  const MINUTE_PX = HOUR_HEIGHT / 60;

  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => HOUR_START + i);
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

  // позиція поточного часу (в пікселях від початку області годин)
  const [currentTimePx, setCurrentTimePx] = useState(null);
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

  const isEventOnDay = (ev, dayIndex) => {
    if (ev.days && ev.days.length) return ev.days.includes(dayIndex);
    if (ev.date) return getDayIndexFromDate(ev.date) === dayIndex;
    return false;
  };

  return (
    <div className="timetable">
      <div className="header">
        <div className="title">Розклад</div>
        <div className="line"></div>
      </div>
    <div
      className="schedule"
      style={{
        padding: "0 40px", // зовнішні відступи
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
        {days.map((d, i) => (
          <div key={i} className="day-col-header">{d}</div>
        ))}

        {/* body: часова колонка (стає в другому рядку, першому стовпчику) */}
        <div className="time-col">
          {hours.map((h) => (
            <div key={h} className="time-cell">{String(h).padStart(2, "0")}:00</div>
          ))}
        </div>

        {/* колонки днів (другий рядок, колонки 2..8) */}
        {days.map((_, dayIndex) => (
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
                  >
                    <div className="title">{ev.title}</div>
                    <div className="time">{ev.start_time}–{ev.end_time}</div>
                  </div>
                );
              })}
          </div>
        ))}

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
    </div>
  );
}
