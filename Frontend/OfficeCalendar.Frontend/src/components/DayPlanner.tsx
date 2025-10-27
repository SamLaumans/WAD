import React, { useState } from "react";
import "../Styling/DayPlanner.css";
import { Link } from "react-router-dom";

const DayPlanner: React.FC = () => {
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today);

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleDayChange = (direction: "prev" | "next") => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + (direction === "next" ? 1 : -1));
        setSelectedDate(newDate);
    };

    return (
        <div className="day-planner">
            <div className="day-header">
                <button onClick={() => handleDayChange("prev")} className="nav-button">◀</button>
                <div className="day-info">
                    <h2 className="day-name">{dayNames[selectedDate.getDay()]}</h2>
                    <p className="day-date">
                        {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
                    </p>
                </div>
                <button onClick={() => handleDayChange("next")} className="nav-button">▶</button>
            </div>
            <div>
                <Link to="/WeekPlanner" className={location.pathname === '/WeekPlanner' ? 'active' : ''}>Week Planner</Link>
            </div>
            <div>
                <Link to="/MonthPlanner" className={location.pathname === '/MonthPlanner' ? 'active' : ''}>Maand Planner</Link>
            </div>

            <div className="day-content">
                <p className="placeholder-text">
                    (Here you could show events, tasks, or time slots for the selected day.)
                </p>
            </div>
        </div>
    );
};

export default DayPlanner;