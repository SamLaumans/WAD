import React, { useState } from "react";
import MonthPlanner from "./MonthPlanner";
import DayPlanner from "./DayPlanner";
import "../Styling/MonthDayView.css";

// The MonthDayView component displays the MonthPlanner and DayPlanner side by side.
// When a day is clicked in the MonthPlanner, the DayPlanner updates to show that date.
const MonthDayView: React.FC = () => {
    // Store the currently selected date
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    return (
        <div className="month-day-container">
            {/* Left side: Month planner */}
            <div className="month-side">
                <MonthPlanner onDaySelect={(date: Date) => setSelectedDate(date)} />
            </div>

            {/* Right side: Only show day planner when a date is selected */}
            <div className="day-side">
                {selectedDate ? (
                    <DayPlanner initialDate={selectedDate} />
                ) : (
                    <p className="day-placeholder">Select a day to view details</p>
                )}
            </div>
        </div>
    );
};

export default MonthDayView;