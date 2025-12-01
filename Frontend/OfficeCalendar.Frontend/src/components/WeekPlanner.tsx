import React from 'react';
import { Link } from 'react-router-dom';
import '../Styling/WeekPlanner.css'
import EventModal from '../pages/create-event/EventModal';

// The WeekPlanner component displays a weekly schedule grid
// with time slots along the left and days of the week across the top.
// It's designed to later display events or appointments in each cell.
export default function WeekPlanner() {
    // Array representing days of the week (Sunday → Saturday)
    const [showEventModal, setShowEventModal] = React.useState(false);
    const [selectedSlot, setSelectedSlot] = React.useState<{ day: string; time: string } | null>(null);
    const [modalPosition, setModalPosition] = React.useState<{ top: number; left: number } | null>(null);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Array of time slots for each day, used to build the table rows
    const times = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30', '18:00', '18:30', '19:00'
    ];

    const POPUP_WIDTH = 350;
    const POPUP_HEIGHT = 620;

    const handleCellClick = (
        day: string,
        time: string,
        e: React.MouseEvent<HTMLTableCellElement>
    ) => {
        const rect = e.currentTarget.getBoundingClientRect();

        // 1. RECHTS of LINKS?
        const enoughSpaceRight = rect.right + POPUP_WIDTH < window.innerWidth;
        const left = enoughSpaceRight ? rect.right : rect.left - POPUP_WIDTH;

        // 2. POPUP verticaal centreren tov cel
        let top = rect.top + rect.height / 2 - POPUP_HEIGHT / 2;

        // 3. Prevent overflowing TOP
        if (top < 0) {
            top = 10; // kleine margin
        }

        // 4. Prevent overflowing BOTTOM
        if (top + POPUP_HEIGHT > window.innerHeight) {
            top = window.innerHeight - POPUP_HEIGHT - 10;
        }

        // Set final popup position
        setModalPosition({ top, left });

        setSelectedSlot({ day, time });
        setShowEventModal(true);
    };
    
    return (
        <div className="planner-container">
            {/* HEADER SECTION */}
            <header className="planner-header">
                {/* Left side: company or project information */}
                <div className="planner-header-left">
                </div>

                {/* Title for the planner */}
                <h2 className="planner-title">Weekplanner</h2>


                {/* Right side: user account options */}
                <div className="planner-header-right">
                    <button
                        onClick={() => setShowEventModal(true)}
                        style={{ cursor: 'pointer' }}
                    >
                        Nieuw Event Aanmaken
                    </button>
                </div>
            </header>

            {/*MAIN WEEK GRID SECTION*/}
            {/* EVENT POPUP */}
            <EventModal
                show={showEventModal}
                onClose={() => setShowEventModal(false)}
                position={modalPosition}
            />

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
                                    <td
                                        key={day + time}
                                        className="planner-cell"
                                        onClick={(e) => handleCellClick(day, time, e)}
                                    ></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}