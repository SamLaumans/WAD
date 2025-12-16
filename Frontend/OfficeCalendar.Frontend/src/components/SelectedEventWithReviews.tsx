import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Reviews from './Reviews'; // Make sure path is correct

// The SelectedEvent2 component displays detailed information about
// a single selected event along with its reviews.
const SelectedEvent2: React.FC = () => {
    // Extract the eventId from the URL (e.g. /events/:eventId)
    const { eventId } = useParams<{ eventId: string }>();

    // Interface describing an Event from the backend
    interface Event {
        id: string;
        title: string;
        desc: string;
        start_time: string;
        end_time: string;
        creator: {
            nickname: string;
            email: string;
        };
    }

    // State to store the selected event
    const [event, setEvent] = useState<Event | null>(null);

    // State to handle loading feedback
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all events and select the one matching the eventId
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch("http://localhost:5267/api/events/get-all");
                const data: Event[] = await response.json();

                // Find the event that matches the ID from the URL
                const foundEvent = data.find(e => e.id === eventId);
                setEvent(foundEvent || null);
            } catch (error) {
                console.error("Failed to fetch event:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    // Show loading state while fetching data
    if (isLoading) {
        return <p>Loading event...</p>;
    }

    // Show fallback if event was not found
    if (!event) {
        return <p>Event not found.</p>;
    }

    // Format date and time for display
    const startDate = new Date(event.start_time);
    const endDate = new Date(event.end_time);

    return (
        <div>
            {/* Page heading and short explanation */}
            <h2>Selected Event</h2>
            <p>Here you can see more information about the selected event.</p>

            {/* Table displaying event details */}
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Creator</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Description</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        {/* Each table cell displays one property from the event object */}
                        <td>{event.title}</td>
                        <td>{event.creator.nickname}</td>
                        <td>{startDate.toLocaleDateString()}</td>
                        <td>
                            {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            {" - "}
                            {endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td>{event.desc}</td>
                    </tr>
                </tbody>
            </table>

            {/* --- RENDER REVIEWS COMPONENT --- */}
            <Reviews eventId={event.id} />
        </div>
    );
};

export default SelectedEvent2;