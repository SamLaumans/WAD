import './Events.css';
import { useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import eventData from "../../assets/events.json"

function Events() {

    const navigate = useNavigate()

    interface Event {
        eventID: number;
        title: string;
        description: string;
    }

    const events: Event[] = eventData.events;

    const getEvents = (): JSX.Element[] => {
        if (events.length > 0) {
            const titles: JSX.Element[] = [];
            for (let i = 0; i < events.length; i++) {
                titles.push(
                    <div className='events-event'>
                        <div className='events-title'>{events[i].title}</div>
                        <div className='events-desc'>{events[i].description}</div>
                    </div>
                )
            }
            return titles
        }
        else return [];
    }

    return (
        <div className="events-event-wrapper">
            <h2 className='events-h2'>Evenementen ({getEvents().length})</h2>
            {getEvents()}
        </div>
    );
}

export default Events;
