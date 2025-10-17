import './SingleEvent.css';
import { useState, type JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import eventData from "../../assets/events.json"

function SingleEvent() {

    const navigate = useNavigate()
    const { eventID } = useParams<{ eventID: string }>();

    interface Event {
        eventID: number;
        title: string;
        description: string;
    }

    const events: Event[] = eventData.events;

    return (
        <div className="singleevent-wrapper">
            <div className='singleevent-back' onClick={() => navigate("/events")}>&lt; Terug</div>
            <div className='singleevents-title'>
                {events.find(evt => evt.eventID === Number(eventID))?.title}
                <div className='singleevents-desc'>
                    {events.find(evt => evt.eventID === Number(eventID))?.description}
                </div>
            </div>

        </div>
    );
}

export default SingleEvent;
