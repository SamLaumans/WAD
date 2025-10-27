import React from 'react';
import { Link } from 'react-router-dom';
import '../Styling/WeekPlanner.css'


export default function WeekPlanner() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const times = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30', '18:00', '18:30', '19:00'
    ];


    return (
        <div className="planner-container">
            {/* Header */}
            <header className="planner-header">
                <div className="planner-header-left">
                    <h1>Langer dan 3m</h1>
                    <p>voorbeeld bedrijf naam</p>
                </div>
                <h2 className="planner-title">Weekplanner</h2>
                <div>
                    <Link to="/MonthPlanner" className={location.pathname === '/MonthPlanner' ? 'active' : ''}>Maand Planner</Link>
                </div>
                <div className="planner-header-right">
                    <Link to="/create-event" className={location.pathname === '/create-event' ? 'active' : ''}>Create Event</Link>
                    <span>Gebruikersnaam</span>
                    <button>Loguit</button>
                </div>
            </header>

            {/* Week Grid */}
            <div className="planner-table-container">
                <table className="planner-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            {days.map((day) => (
                                <th key={day}>{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {times.map((time) => (
                            <tr key={time}>
                                <td className="time-col">{time}</td>
                                {days.map((day) => (
                                    <td key={day + time}></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}