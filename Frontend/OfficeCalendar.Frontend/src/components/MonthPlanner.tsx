import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../Styling/MonthPlanner.css'

// The MonthPlanner component displays a calendar view for the selected month and year.
// It allows navigation between months and years and shows a grid of days.
const MonthPlanner: React.FC = () => {
    // Get today's date when the component first loads
    const today = new Date();

    // Store the current visible month (0 = January, 11 = December)
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    // Store the current visible year
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    // Array of month names for display purposes
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Returns an array of day numbers (1...daysInMonth) for a given month and year
    const getDaysInMonth = (month: number, year: number) => {
        // new Date(year, month + 1, 0) gives the last day of the specified month
        const days = new Date(year, month + 1, 0).getDate();
        // Create an array [1, 2, 3, ..., days]
        return Array.from({ length: days }, (_, i) => i + 1);
    };

    // Handles switching between months (previous or next)
    const handleMonthChange = (direction: "prev" | "next") => {
        if (direction === "prev") {
            // If currently in January, go to December of the previous year
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
            } else {
                // Otherwise just go one month back
                setCurrentMonth(currentMonth - 1);
            }
        } else {
            // If currently in December, go to January of the next year
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
            } else {
                // Otherwise just go one month forward
                setCurrentMonth(currentMonth + 1);
            }
        }
    };

    // Handles changing the current year by adding or subtracting a value (e.g., ±1)
    const handleYearChange = (change: number) => {
        setCurrentYear((prev) => prev + change);
    };

    // Get all days in the current month as an array
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);

    // Determine which day of the week the month starts on (0 = Sunday, 6 = Saturday)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    // Create "empty" slots to align the first day of the month correctly in the calendar grid
    const emptySlots = Array.from({ length: firstDayOfMonth }, () => null);

    return (
        <div className="month-planner">
            {/* Header with month navigation and title */}
            <div className="month-header">
                {/* Go to previous month */}
                <button onClick={() => handleMonthChange("prev")} className="nav-button">◀</button>

                {/* Display current month and year */}
                <h2 className="month-title">
                    {monthNames[currentMonth]} {currentYear}
                </h2>

                {/* Go to next month */}
                <button onClick={() => handleMonthChange("next")} className="nav-button">▶</button>
            </div>

            {/* Navigation links to other planner views */}
            <div>
                <Link to="/DayPlanner" className={location.pathname === '/DayPlanner' ? 'active' : ''}>Dag Planner</Link>
            </div>
            <div>
                <Link to="/WeekPlanner" className={location.pathname === '/WeekPlanner' ? 'active' : ''}>Week Planner</Link>
            </div>

            {/* Buttons to navigate between years */}
            <div className="year-controls">
                <button onClick={() => handleYearChange(-1)} className="year-button">⏮ Year</button>
                <button onClick={() => handleYearChange(1)} className="year-button">Year ⏭</button>
            </div>

            {/* Calendar grid layout */}
            <div className="calendar-grid">
                {/* Render weekday headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="day-header">{day}</div>
                ))}

                {/* Render empty cells for alignment + actual day numbers */}
                {[...emptySlots, ...daysInMonth].map((day, index) => (
                    <div
                        key={index}
                        className={`calendar-cell ${day ? "day-cell" : "empty-cell"}`}
                    >
                        {/* Only show number if it's a valid day */}
                        {day && <span>{day}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthPlanner;