import React, { useState, useEffect } from 'react';
import '../Styling/WeekPlanner.css'
import EventModal from '../pages/create-event/EventModal';

interface User {
    username: string;
    email: string;
    nickname: string;
    creation_date: string;
    role: number;
}

interface Event {
    id: string;
    creator: User;
    title: string;
    desc: string;
    start_time: string;
    end_time: string;
    last_edited_date: string | null;
    bookings: any[];
}

// The WeekPlanner component displays a weekly schedule grid
// with time slots along the left and days of the week across the top.
// It's designed to display events from the database in each cell.
export default function WeekPlanner() {
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string; date: string } | undefined>(undefined);
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', desc: '', start_time: '', end_time: '' });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Array of time slots for each day, used to build the table rows
    const times = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30', '18:00', '18:30', '19:00'
    ];

    const POPUP_WIDTH = 350;
    const POPUP_HEIGHT = 620;

    useEffect(() => {
        fetchEvents();
        const interval = setInterval(fetchEvents, 30000); // elke 30 seconden
        return () => clearInterval(interval);
    }, []);

    const fetchEvents = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5267/api/Events/my-events', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });
            const data = await res.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleEditEvent = async () => {
        if (!selectedEvent) return;
        const token = localStorage.getItem('token');
        const body = {
            title: editForm.title,
            desc: editForm.desc,
            start_time: new Date(editForm.start_time),
            end_time: new Date(editForm.end_time),
        };
        try {
            const res = await fetch(`http://localhost:5267/api/Events?eventid=${selectedEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                fetchEvents();
                setShowEventDetails(false);
                setEditMode(false);
            } else {
                alert('Failed to update event');
            }
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;
        if (!confirm('Are you sure you want to delete this event?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5267/api/Events?eventid=${selectedEvent.id}`, {
                method: 'DELETE',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });
            if (res.ok) {
                fetchEvents();
                setShowEventDetails(false);
            } else {
                alert('Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const getWeekStart = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    };

    const weekStart = getWeekStart(new Date());
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
    });

    const handleCellClick = (
        day: string,
        time: string,
        date: string,
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

        setSelectedSlot({ day, time, date });
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
                slot={selectedSlot}
                onEventCreated={fetchEvents}
            />

            <div className="planner-table-container">
                <table className="planner-table">
                    <thead>
                        <tr>
                            {/* First column header for time labels */}
                            <th>Time</th>

                            {/* Column headers for each day of the week */}
                            {days.map((day, i) => (
                                <th key={day}>{day} {weekDays[i].getDate()}</th>
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
                                {days.map((day, i) => {
                                    const date = weekDays[i];
                                    const [h, m] = time.split(':').map(Number);
                                    const cellStart = new Date(date);
                                    cellStart.setHours(h, m, 0, 0);
                                    const cellEnd = new Date(cellStart);
                                    cellEnd.setMinutes(cellStart.getMinutes() + 30);
                                    const cellEvents = events.filter(e => {
                                        const start = new Date(e.start_time);
                                        const end = new Date(e.end_time);
                                        return start < cellEnd && end > cellStart;
                                    });
                                    return (
                                        <td
                                            key={day + time}
                                            className="planner-cell"
                                            onClick={(e) => handleCellClick(day, time, weekDays[i].toISOString().split('T')[0], e)}
                                        >
                                            {cellEvents.map(event => (
                                                <div
                                                    key={event.id}
                                                    className="event-item"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedEvent(event);
                                                        setEditForm({
                                                            title: event.title,
                                                            desc: event.desc,
                                                            start_time: event.start_time,
                                                            end_time: event.end_time,
                                                        });
                                                        setShowEventDetails(true);
                                                        setEditMode(false);
                                                    }}
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Event Details Modal */}
            {showEventDetails && selectedEvent && (
                <div className="modal-overlay" onClick={() => setShowEventDetails(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        {editMode ? (
                            <>
                                <h3>Edit Event</h3>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    placeholder="Title"
                                />
                                <textarea
                                    value={editForm.desc}
                                    onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                                    placeholder="Description"
                                />
                                <input
                                    type="datetime-local"
                                    value={editForm.start_time.slice(0, 16)}
                                    onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
                                />
                                <input
                                    type="datetime-local"
                                    value={editForm.end_time.slice(0, 16)}
                                    onChange={(e) => setEditForm({ ...editForm, end_time: e.target.value })}
                                />
                                <button onClick={handleEditEvent}>Save</button>
                                <button onClick={() => setEditMode(false)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <h3>{selectedEvent.title}</h3>
                                <p><strong>Description:</strong> {selectedEvent.desc}</p>
                                <p><strong>Start:</strong> {new Date(selectedEvent.start_time).toLocaleString()}</p>
                                <p><strong>End:</strong> {new Date(selectedEvent.end_time).toLocaleString()}</p>
                                <p><strong>Creator:</strong> {selectedEvent.creator.nickname}</p>
                                <button onClick={() => setEditMode(true)}>Edit</button>
                                <button onClick={handleDeleteEvent}>Delete</button>
                                <button onClick={() => setShowEventDetails(false)}>Close</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}