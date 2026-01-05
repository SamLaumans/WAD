import React, { useState, useEffect } from "react";
import "../Styling/DayPlanner.css";
import { Link, useParams } from "react-router-dom";
import EventModal from "../pages/create-event/EventModal";

export interface DayPlannerProps {
    initialDate?: Date;
}

interface Event {
    id: string;
    title: string;
    desc: string;
    start_time: string;
    end_time: string;
}

const DayPlanner: React.FC<DayPlannerProps> = ({ initialDate }) => {
    // Today's date (fallback if no initialDate is provided)
    const today = new Date();

    // Read optional date parameter from URL (e.g., /dayplanner/2025-01-01)
    const { date } = useParams<{ date?: string }>();

    // State: currently selected day in the planner
    const [selectedDate, setSelectedDate] = useState(initialDate || today);

    // State: all events fetched from backend
    const [events, setEvents] = useState<Event[]>([]);

    // State: loading indicator while fetching events
    const [isLoading, setIsLoading] = useState(true);

    // State: controls visibility of the "Create Event" modal
    const [showEventModal, setShowEventModal] = useState(false);

    // Day and month name helpers for UI display
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Converts a Date object into YYYY-MM-DD format (safe for backend)
    const toLocalDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // Sync selectedDate with URL parameter when it changes
    useEffect(() => {
        if (date) {
            const parsed = new Date(date);
            if (!isNaN(parsed.getTime())) {
                setSelectedDate(parsed);
            }
        }
    }, [date]);

    // Sync selectedDate when initialDate prop changes
    useEffect(() => {
        if (initialDate) {
            setSelectedDate(initialDate);
        }
    }, [initialDate]);


    // Fetch all events from backend API
    const fetchEvents = async () => {
        try {
            setIsLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:5267/api/events/my-events", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error("Failed to fetch my events:", response.status);
                return;
            }

            const data: Event[] = await response.json();
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setIsLoading(false);
        }
    };


    // Fetch events once when component mounts
    useEffect(() => {
        fetchEvents();
    }, []);


    // Navigate to previous or next day
    const handleDayChange = (direction: "prev" | "next") => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + (direction === "next" ? 1 : -1));
        setSelectedDate(newDate);
    };


    // Filter events that occur on the selected day
    const eventsForSelectedDay = events.filter(event => {
        const eventDate = new Date(event.start_time);
        return (
            eventDate.getFullYear() === selectedDate.getFullYear() &&
            eventDate.getMonth() === selectedDate.getMonth() &&
            eventDate.getDate() === selectedDate.getDate()
        );
    });


    // Close modal and refresh events after creating a new one
    const handleCloseModal = () => {
        setShowEventModal(false);
        fetchEvents();
    };

    // Default slot info passed to EventModal when creating a new event
    const selectedSlot = {
        day: dayNames[selectedDate.getDay()],
        time: "09:00",
        date: toLocalDateString(selectedDate),
    };

    return (
        <div className="day-planner">
            {/* Header with navigation and date display */}
            <div className="day-header">
                <button onClick={() => handleDayChange("prev")} className="nav-button">◀</button>

                <div className="day-info">
                    <h2 className="day-name">{dayNames[selectedDate.getDay()]}</h2>
                    <p className="day-date">
                        {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
                    </p>
                </div>

                <button onClick={() => handleDayChange("next")} className="nav-button">▶</button>
            </div>

            {/* Main content area showing events */}
            <div className="day-content">
                {isLoading && <p>Loading events...</p>}

                {/* No events for this day */}
                {!isLoading && eventsForSelectedDay.length === 0 && (
                    <p className="placeholder-text">
                        No events scheduled for this day.
                    </p>
                )}

                {/* Render each event as a clickable link */}
                {!isLoading && eventsForSelectedDay.map(event => (
                    <Link
                        key={event.id}
                        to={`/selectedeventwithreviews/${event.id}`}
                        className="day-event-link"
                    >
                        <div className="day-event">
                            <h3>{event.title}</h3>
                            <p>
                                {new Date(event.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                {" - "}
                                {new Date(event.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            <p>{event.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Footer with button to open event creation modal */}
            <div className="day-footer">
                <button
                    className="create-event-button"
                    onClick={() => setShowEventModal(true)}
                >
                    Nieuw Event Aanmaken
                </button>
            </div>

            {/* Event creation modal */}
            <EventModal
                show={showEventModal}
                onClose={handleCloseModal}
                slot={selectedSlot}
            />
        </div>
    );
};

export default DayPlanner;
