import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Styling/MonthPlanner.css";

// The MonthPlanner component displays a calendar view for the selected month and year.
// It allows navigation between months and years and shows a grid of days.
interface MonthPlannerProps {
    onDaySelect?: (date: Date) => void; // Optional callback for when a day is clicked
}

const MonthPlanner: React.FC<MonthPlannerProps> = ({ onDaySelect }) => {
    // Get today's date when the component first loads
    const today = new Date();

    // Store the current visible month (0 = January, 11 = December)
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    // Store the current visible year
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    // Store which date is currently selected (used for highlight)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Array of month names for display purposes
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Returns an array of day numbers (1...daysInMonth) for a given month and year
    const getDaysInMonth = (month: number, year: number) => {
        const days = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: days }, (_, i) => i + 1);
    };

    // Handles switching between months
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
        // Reset selected date when switching months (optional)
        setSelectedDate(null);
    };

    // Handles changing the current year
    const handleYearChange = (change: number) => {
        setCurrentYear((prev) => prev + change);
        setSelectedDate(null);
    };

    // Get all days in the current month
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);

    // Determine which day of the week the month starts on (0 = Sunday, 6 = Saturday)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    // Create "empty" slots to align the first day of the month correctly in the grid
    const emptySlots = Array.from({ length: firstDayOfMonth }, () => null);

    // Handle clicking a specific day in the calendar
    const handleDayClick = (day: number) => {
        const clickedDate = new Date(currentYear, currentMonth, day);
        setSelectedDate(clickedDate); // Highlight the selected day
        if (onDaySelect) onDaySelect(clickedDate); // Notify parent (MonthDayView)
    };

    return (
        <div className="month-planner">
            {/* Header with month navigation and title */}
            <div className="month-header">
                <button onClick={() => handleMonthChange("prev")} className="nav-button">◀</button>
                <h2 className="month-title">{monthNames[currentMonth]} {currentYear}</h2>
                <button onClick={() => handleMonthChange("next")} className="nav-button">▶</button>
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
                {[...emptySlots, ...daysInMonth].map((day, index) => {
                    if (!day) return <div key={index} className="empty-cell"></div>;

                    const thisDate = new Date(currentYear, currentMonth, day);
                    const isSelected =
                        selectedDate &&
                        thisDate.toDateString() === selectedDate.toDateString();

                    return (
                        <div
                            key={index}
                            className={`calendar-cell day-cell ${isSelected ? "selected" : ""}`}
                            onClick={() => handleDayClick(day)}
                        >
                            <span>{day}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthPlanner;