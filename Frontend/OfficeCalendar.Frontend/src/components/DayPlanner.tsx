import React, { useState, useEffect } from "react";
import "../Styling/DayPlanner.css";
import { Link, useParams } from "react-router-dom";

// The DayPlannerProps interface defines the optional props that the DayPlanner component can receive.
// 'initialDate' allows a parent component (like MonthDayView) to set which date should be displayed initially.
export interface DayPlannerProps {
    initialDate?: Date; // Optional prop to display a specific date when the component loads
}

// The DayPlanner component displays a daily view where users can navigate
// between days and potentially see tasks or events for the selected date.
const DayPlanner: React.FC<DayPlannerProps> = ({ initialDate }) => {
    // Get today's date for default initialization
    const today = new Date();

    // Extract the date parameter from the URL if available (e.g., /DayPlanner/2025-11-11)
    const { date } = useParams<{ date?: string }>();

    // Store the currently selected date in the component state.
    // Use the initialDate prop if provided, otherwise fall back to today's date.
    const [selectedDate, setSelectedDate] = useState(initialDate || today);

    // Whenever the 'date' URL parameter changes, update the selected date.
    // This ensures the displayed date matches the one in the URL.
    useEffect(() => {
        if (date) {
            const parsedDate = new Date(date);
            // Validate that the parsed date is valid before updating state
            if (!isNaN(parsedDate.getTime())) {
                setSelectedDate(parsedDate);
            }
        }
    }, [date]);

    // ✅ NEW: Watch for changes to initialDate prop (e.g., when clicking another day in the MonthPlanner)
    // This ensures that the displayed day updates even if the component stays mounted.
    useEffect(() => {
        if (initialDate) {
            setSelectedDate(initialDate);
        }
    }, [initialDate]);

    // Array of day names for displaying readable day titles
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Array of month names for readable month text
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Handles changing the currently displayed day by moving one day forward or backward.
    const handleDayChange = (direction: "prev" | "next") => {
        const newDate = new Date(selectedDate); // Create a copy of the current date
        // Adjust the date by -1 or +1 depending on the direction
        newDate.setDate(selectedDate.getDate() + (direction === "next" ? 1 : -1));
        setSelectedDate(newDate); // Update the state with the new date
    };

    return (
        <div className="day-planner">
            {/* Header section with navigation buttons and current day information */}
            <div className="day-header">
                {/* Previous day button */}
                <button onClick={() => handleDayChange("prev")} className="nav-button">◀</button>

                {/* Display the current day name and date */}
                <div className="day-info">
                    <h2 className="day-name">{dayNames[selectedDate.getDay()]}</h2>
                    <p className="day-date">
                        {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
                    </p>
                </div>

                {/* Next day button */}
                <button onClick={() => handleDayChange("next")} className="nav-button">▶</button>
            </div>


            {/* Main content area for daily events, tasks, or schedules */}
            <div className="day-content">
                <p className="placeholder-text">
                    (Here you could show events, tasks, or time slots for the selected day.)
                </p>
            </div>
        </div>
    );
};

export default DayPlanner;