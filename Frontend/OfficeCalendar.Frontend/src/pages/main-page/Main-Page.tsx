import './Main-Page.css';
import { useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import messageData from "../../assets/messages.json"
import eventData from "../../assets/events.json"

function Main_Page() {

    const navigate = useNavigate()
    interface Message {
        messageID: number;
        title: string;
        message: string;
    }

    interface Event {
        eventID: number;
        title: string;
        description: string;
    }

    const messages: Message[] = messageData.messages;
    const events: Event[] = eventData.events;

    const getMessageTitles = (): JSX.Element[] => {
        if (messages.length > 0) {
            const titles: JSX.Element[] = [];
            for (let i = 0; i < messages.length && i < 3; i++) {
                titles.push(<div className='message' onClick={(e) => { e.stopPropagation(); navigate(`/messages/${messages[i].messageID}`); }}>- {messages[i].title}</div>)
            }
            return titles
        }
        else return [];
    }

    const getEventTitles = (): JSX.Element[] => {
        if (events.length > 0) {
            const titles: JSX.Element[] = [];
            for (let i = 0; i < events.length && i < 3; i++) {
                titles.push(<div className='event' onClick={(e) => { e.stopPropagation(); navigate(`/events/${events[i].eventID}`); }}>- {events[i].title}</div>)
            }
            return titles
        }
        else return [];
    }

    return (
        <div className="main-page-wrapper">
            <div className='placeholder'>
                Placeholder
            </div>

            <div className='infoboard'>

                <div className='clock'>
                    18:02
                </div>

                <div className='bulletin' onClick={() => navigate("/messages")}>
                    <h2>Berichten ({getMessageTitles().length})</h2>
                    {getMessageTitles()}
                </div>

                <div className='events' onClick={() => navigate("/events")}>
                    <h2>Evenementen ({getEventTitles().length})</h2>
                    {getEventTitles()}
                </div>

            </div>
        </div>
    );
}

export default Main_Page;
