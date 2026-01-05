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
    const today = new Date();
    const { date } = useParams<{ date?: string }>();

    const [selectedDate, setSelectedDate] = useState(initialDate || today);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showEventModal, setShowEventModal] = useState(false);

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // ---------------------------
    // Local date helper (timezone-safe)
    // ---------------------------
    const toLocalDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // ---------------------------
    // Date syncing
    // ---------------------------
    useEffect(() => {
        if (date) {
            const parsed = new Date(date);
            if (!isNaN(parsed.getTime())) {
                setSelectedDate(parsed);
            }
        }
    }, [date]);

    useEffect(() => {
        if (initialDate) {
            setSelectedDate(initialDate);
        }
    }, [initialDate]);

    // ---------------------------
    // Fetch events
    // ---------------------------
    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:5267/api/events/get-all");
            const data: Event[] = await response.json();
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // ---------------------------
    // Navigation
    // ---------------------------
    const handleDayChange = (direction: "prev" | "next") => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + (direction === "next" ? 1 : -1));
        setSelectedDate(newDate);
    };

    // ---------------------------
    // Filter events for selected day
    // ---------------------------
    const eventsForSelectedDay = events.filter(event => {
        const eventDate = new Date(event.start_time);
        return (
            eventDate.getFullYear() === selectedDate.getFullYear() &&
            eventDate.getMonth() === selectedDate.getMonth() &&
            eventDate.getDate() === selectedDate.getDate()
        );
    });

    // ---------------------------
    // Modal helpers
    // ---------------------------
    const handleCloseModal = () => {
        setShowEventModal(false);
        fetchEvents();
    };

    const selectedSlot = {
        day: dayNames[selectedDate.getDay()],
        time: "09:00",
        date: toLocalDateString(selectedDate), // ✅ FIXED
    };

    return (
        <div className="day-planner">
            {/* Header */}
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

            {/* Content */}
            <div className="day-content">
                {isLoading && <p>Loading events...</p>}

                {!isLoading && eventsForSelectedDay.length === 0 && (
                    <p className="placeholder-text">
                        No events scheduled for this day.
                    </p>
                )}

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

            {/* Footer */}
            <div className="day-footer">
                <button
                    className="create-event-button"
                    onClick={() => setShowEventModal(true)}
                >
                    Nieuw Event Aanmaken
                </button>
            </div>

            {/* Modal */}
            <EventModal
                show={showEventModal}
                onClose={handleCloseModal}
                slot={selectedSlot}
            />
        </div>
    );
};

export default DayPlanner;