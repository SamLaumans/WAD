import React from "react";
import "../Styling/WeekPlanner.css";
import EventModal from "../pages/create-event/EventModal";

export default function WeekPlanner() {
    const [showEventModal, setShowEventModal] = React.useState(false);
    const [selectedSlot, setSelectedSlot] = React.useState<{ day: string; time: string } | null>(null);
    const [modalPosition, setModalPosition] = React.useState<{ top: number; left: number } | null>(null);

    const [events, setEvents] = React.useState<any[]>([]);
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
    React.useEffect(() => {
        fetch("/eventweekplanner.json")
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error("Error loading events:", err));
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

                                {days.map((day, index) => (
                                    <td
                                        key={day + time}
                                        className="planner-cell"
                                        onClick={(e) => handleCellClick(day, time, e)}
                                    >
                                        {events
                                            .filter(ev =>
                                                isEventInCurrentWeek(ev) && // <--- NIEUW
                                                getDayIndexInWeek(ev.start_time) === index &&
                                                getTimeString(ev.start_time) === time
                                            )
                                            .map(ev => (
                                                <div key={ev.id} className="event-item">
                                                    {ev.title}
                                                </div>
                                            ))}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
