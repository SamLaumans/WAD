import React, { useState } from "react";
import "../Styling/DayPlanner.css";
import { Link } from "react-router-dom";

// The DayPlanner component displays a daily view where users can navigate
// between days and potentially see tasks or events for the selected date.
const DayPlanner: React.FC = () => {
    // Get the current date when the component first renders
    const today = new Date();

    // Store the currently selected date in component state
    const [selectedDate, setSelectedDate] = useState(today);

    // Array of day names
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Array of month names for displaying readable month text
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Function to move to the previous or next day
    const handleDayChange = (direction: "prev" | "next") => {
        const newDate = new Date(selectedDate); // Create a copy of the current date
        // Adjust the date by -1 or +1 day depending on direction
        newDate.setDate(selectedDate.getDate() + (direction === "next" ? 1 : -1));
        setSelectedDate(newDate); // Update state with new date
    };

    return (
        <div className="day-planner">
            {/* Header with navigation buttons and current day info */}
            <div className="day-header">
                {/* Previous day button */}
                <button onClick={() => handleDayChange("prev")} className="nav-button">◀</button>

                {/* Display current day name and date */}
                <div className="day-info">
                    <h2 className="day-name">{dayNames[selectedDate.getDay()]}</h2>
                    <p className="day-date">
                        {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
                    </p>
                </div>

                {/* Next day button */}
                <button onClick={() => handleDayChange("next")} className="nav-button">▶</button>
            </div>

            {/* Navigation links to week and month planner views */}
            <div>
                <Link to="/WeekPlanner">Week Planner</Link>
            </div>
            <div>
                <Link to="/MonthPlanner">Maand Planner</Link>
            </div>

            {/* Placeholder for daily tasks, events, or schedule */}
            <div className="day-content">
                <p className="placeholder-text">
                    (Here you could show events, tasks, or time slots for the selected day.)
                </p>
            </div>
        </div>
    );
};

export default DayPlanner;