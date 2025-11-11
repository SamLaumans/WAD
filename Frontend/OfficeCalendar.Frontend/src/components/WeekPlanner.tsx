import React from 'react';
import { Link } from 'react-router-dom';
import '../Styling/WeekPlanner.css'

// The WeekPlanner component displays a weekly schedule grid
// with time slots along the left and days of the week across the top.
// It's designed to later display events or appointments in each cell.
export default function WeekPlanner() {
    // Array representing days of the week (Sunday → Saturday)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Array of time slots for each day, used to build the table rows
    const times = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30', '18:00', '18:30', '19:00'
    ];

    return (
        <div className="planner-container">
            {/* HEADER SECTION */}
            <header className="planner-header">
                {/* Left side: company or project information */}
                <div className="planner-header-left">
                </div>

                {/* Title for the planner */}
                <h2 className="planner-title">Weekplanner</h2>

                {/* Navigation links to other planner views */}
                <div>
                    <Link to="/DayPlanner">Dag Planner</Link>
                </div>
                <div>
                    <Link to="/MonthPlanner">Maand Planner</Link>
                </div>

                {/* Right side: user account options */}
                <div className="planner-header-right">
                    <Link to="/create-event" >Create Event</Link>

                </div>
            </header>

            {/*MAIN WEEK GRID SECTION*/}
            <div className="planner-table-container">
                <table className="planner-table">
                    <thead>
                        <tr>
                            {/* First column header for time labels */}
                            <th>Time</th>

                            {/* Column headers for each day of the week */}
                            {days.map((day) => (
                                <th key={day}>{day}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {/* Create a row for each time slot */}
                        {times.map((time) => (
                            <tr key={time}>
                                {/* Leftmost cell shows the time */}
                                <td className="time-col">{time}</td>

                                {/* Create a cell for each day at that time slot */}
                                {days.map((day) => (
                                    <td key={day + time}></td> // Each empty cell could later hold an event
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}