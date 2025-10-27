import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../Styling/MonthPlanner.css'


const MonthPlanner: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (month: number, year: number) => {
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleYearChange = (change: number) => {
    setCurrentYear((prev) => prev + change);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const emptySlots = Array.from({ length: firstDayOfMonth }, () => null);

  return (
    <div className="month-planner">
      <div className="month-header">
        <button onClick={() => handleMonthChange("prev")} className="nav-button">◀</button>
        <h2 className="month-title">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button onClick={() => handleMonthChange("next")} className="nav-button">▶</button>
      </div>

      <div>
        <Link to="/WeekPlanner" className={location.pathname === '/WeekPlanner' ? 'active' : ''}>Week Planner</Link>
      </div>

      <div className="year-controls">
        <button onClick={() => handleYearChange(-1)} className="year-button">⏮ Year</button>
        <button onClick={() => handleYearChange(1)} className="year-button">Year ⏭</button>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="day-header">{day}</div>
        ))}

        {[...emptySlots, ...daysInMonth].map((day, index) => (
          <div
            key={index}
            className={`calendar-cell ${day ? "day-cell" : "empty-cell"}`}
          >
            {day && <span>{day}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthPlanner;