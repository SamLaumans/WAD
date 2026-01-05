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
    const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | undefined>(undefined);
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', desc: '', start_time: '', end_time: '' });

    // const [events, setEvents] = React.useState<any[]>([]);
    const [currentWeekStart, setCurrentWeekStart] = React.useState<Date>(getSunday(new Date()));

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const times = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
        "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
        "18:00", "18:30", "19:00"
    ];

    const POPUP_WIDTH = 350;
    const POPUP_HEIGHT = 620;

    // --- Load events ---
    // --- Load events from backend ---
    React.useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem("token"); // pas aan waar je token staat
                const res = await fetch("http://localhost:5267/api/events/get-all", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    throw new Error(`Error fetching events: ${res.status}`);
                }

                const data = await res.json();

                // Je backend geeft nu één object terug. Als je meerdere events wilt, moet het een array zijn.
                // Als je backend een array terugstuurt, kun je dit direct gebruiken:
                setEvents(Array.isArray(data) ? data : [data]);
            } catch (err) {
                console.error(err);
            }
        };

        fetchEvents();
    }, []);


    // --- Utils ---
    function getSunday(date: Date) {
        const d = new Date(date);
        const day = d.getDay();            // 0 = Sun
        const diff = d.getDate() - day;    // terug naar zondag
        return new Date(d.setDate(diff));
    }

    const addDays = (date: Date, days: number) => {
        const copy = new Date(date);
        copy.setDate(copy.getDate() + days);
        return copy;
    };

    const formatDate = (d: Date) =>
        d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });

    // --- NIEUW: check of event in deze week valt ---
    const isEventInCurrentWeek = (ev: any) => {
        const start = new Date(ev.start_time);

        const weekStart = new Date(currentWeekStart);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        weekEnd.setHours(23, 59, 59, 999);

        return start >= weekStart && start <= weekEnd;
    };

    // Dagindex binnen geselecteerde week
    const getDayIndexInWeek = (date: string) => {
        const d = new Date(date);
        const diff = (d.getTime() - currentWeekStart.getTime()) / (1000 * 60 * 60 * 24);
        return Math.floor(diff);
    };

    const getTimeString = (date: string) => {
        const d = new Date(date);
        return d.toTimeString().slice(0, 5);
    };

    const handlePrevWeek = () => {
        setCurrentWeekStart(prev => addDays(prev, -7));
    };

    const handleNextWeek = () => {
        setCurrentWeekStart(prev => addDays(prev, 7));
    };
    useEffect(() => {
        fetchEvents();
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
        e: React.MouseEvent<HTMLTableCellElement>
    ) => {
        const rect = e.currentTarget.getBoundingClientRect();

        const enoughSpaceRight = rect.right + POPUP_WIDTH < window.innerWidth;
        const left = enoughSpaceRight ? rect.right : rect.left - POPUP_WIDTH;

        let top = rect.top + rect.height / 2 - POPUP_HEIGHT / 2;

        if (top < 0) top = 10;
        if (top + POPUP_HEIGHT > window.innerHeight) {
            top = window.innerHeight - POPUP_HEIGHT - 10;
        }

        setModalPosition({ top, left });

        setSelectedSlot({ day, time });
        setShowEventModal(true);
    };

    const monday = currentWeekStart;
    const sunday = addDays(currentWeekStart, 6);

    return (
        <div className="planner-container">

            {/* Header */}
            <header className="planner-header">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button onClick={handlePrevWeek}>←</button>
                    <button onClick={handleNextWeek}>→</button>

                    <span style={{ fontSize: "1.2rem", marginLeft: "10px", color: "#bbbbff" }}>
                        Week: {formatDate(monday)} - {formatDate(sunday)}
                    </span>
                </div>

                <h2 className="planner-title">Weekplanner</h2>

                <div className="planner-header-right">
                    <button
                        onClick={() => setShowEventModal(true)}
                        style={{ cursor: "pointer" }}
                    >
                        Nieuw Event Aanmaken
                    </button>
                </div>
            </header>

            {/* Modal */}
            <EventModal
                show={showEventModal}
                onClose={() => setShowEventModal(false)}
                position={modalPosition}
                slot={selectedSlot}
            />

            {/* Main grid */}
            <div className="planner-table-container">
                <table className="planner-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            {days.map((day, index) => {
                                const date = addDays(monday, index);
                                const label = date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });

                                return (
                                    <th key={day}>
                                        {day}
                                        <br />
                                        <span style={{ fontSize: "0.8rem", color: "#ccccff" }}>
                                            {label}
                                        </span>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        {times.map((time) => (
                            <tr key={time}>
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
                                            onClick={(e) => handleCellClick(day, time, e)}
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
